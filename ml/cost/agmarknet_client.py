"""
AGMARKNET 2.0 public API client.

This module is intentionally separate from the deterministic cost calculator.
It retrieves government mandi price/arrival data; it does not calculate farm cost.

The API endpoints below are the public backend used by the AGMARKNET 2.0
website. The endpoint mapping was verified from the site's public frontend
behavior and independent endpoint documentation. The client uses browser-like
headers because the API may reject naive server-side requests.
"""

from __future__ import annotations

import os
from typing import Any, Iterable

import requests


class AgmarknetError(RuntimeError):
    """Raised when AGMARKNET cannot return a successful response."""


class AgmarknetClient:
    def __init__(
        self,
        base_url: str | None = None,
        timeout: int = 30,
        session: requests.Session | None = None,
    ) -> None:
        self.base_url = (
            base_url
            or os.getenv("AGMARKNET_BASE_URL")
            or "https://api.agmarknet.gov.in/v1"
        ).rstrip("/")
        self.timeout = timeout
        self.session = session or requests.Session()
        self.session.headers.update(
            {
                "Accept": "application/json, text/plain, */*",
                "Origin": "https://agmarknet.gov.in",
                "Referer": "https://agmarknet.gov.in/",
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/153.0.0.0 Safari/537.36"
                ),
            }
        )

    def _request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json_body: dict[str, Any] | None = None,
        expect_binary: bool = False,
    ) -> Any:
        url = f"{self.base_url}/{path.lstrip('/')}"
        try:
            response = self.session.request(
                method,
                url,
                params=params,
                json=json_body,
                timeout=self.timeout,
            )
        except requests.RequestException as exc:
            raise AgmarknetError(f"AGMARKNET request failed: {exc}") from exc

        if not response.ok:
            raise AgmarknetError(
                f"AGMARKNET request failed: HTTP {response.status_code} "
                f"{response.text[:500]}"
            )

        if expect_binary:
            return {
                "content": response.content,
                "content_type": response.headers.get(
                    "content-type", "application/octet-stream"
                ),
                "filename": response.headers.get("content-disposition"),
            }

        content_type = response.headers.get("content-type", "")
        if "application/json" in content_type:
            return response.json()

        # Some deployments omit the JSON content type.
        try:
            return response.json()
        except ValueError:
            return response.text

    def get_filters(self) -> dict[str, Any]:
        return self._request("GET", "/daily-price-arrival/filters")

    def list_states(
        self,
        *,
        page: int = 1,
        search: str | None = None,
        status: int | None = None,
    ) -> Any:
        params: dict[str, Any] = {"page": page}
        if search:
            params["search"] = search
        if status is not None:
            params["status"] = status
        return self._request("GET", "/location/state", params=params)

    def list_commodity_context(self, commodity_id: int | str) -> Any:
        return self._request("GET", f"/list-comm/{commodity_id}")

    def date_wise_specific_commodity(
        self,
        *,
        year: int,
        month: int,
        state_id: int | str,
        commodity_id: int | str,
        include_excel: bool = False,
    ) -> Any:
        return self._request(
            "GET",
            "/prices-and-arrivals/date-wise/specific-commodity",
            params={
                "year": year,
                "month": month,
                "stateId": state_id,
                "commodityId": commodity_id,
                "includeExcel": str(include_excel).lower(),
            },
            expect_binary=include_excel,
        )

    def market_price_last_week(
        self,
        *,
        market_id: int | str,
        state_id: int | str,
        commodity_id: int | str,
        include_excel: bool = False,
    ) -> Any:
        return self._request(
            "GET",
            "/prices-and-arrivals/market-price/lastweek",
            params={
                "marketId": market_id,
                "stateId": state_id,
                "commodityId": commodity_id,
                "includeExcel": str(include_excel).lower(),
            },
            expect_binary=include_excel,
        )

    def commodity_market_daily_report_state_marketwise(
        self,
        *,
        date: str,
        state_id: int | str,
        market_category_id: int | str,
        include_excel: bool = False,
    ) -> Any:
        return self._request(
            "GET",
            "/prices-and-arrivals/commodity-market/daily-report-state-marketwise",
            params={
                "date": date,
                "state": state_id,
                "marketCategoryid": market_category_id,
                "includeExcel": str(include_excel).lower(),
            },
            expect_binary=include_excel,
        )

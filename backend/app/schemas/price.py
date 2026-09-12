"""Price forecasting schemas.

NOTE: All fields below are TEMPORARY / TBD and represent contract placeholders.
Because ml/price/ files in the repository contain no code or model artifacts,
all input parameters (market, crop, horizon) and forecast trend outputs remain TBD.
"""
from typing import Any, Optional
from pydantic import BaseModel, Field


class PriceForecastRequest(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Crop price forecasting input variables will be derived from ml/price.",
    )
    parameters: Optional[Any] = Field(
        default=None,
        description="TEMPORARY/TBD: Forecasting horizon and commodity parameters placeholder.",
    )


class PriceForecastResponse(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Price forecast response series will be derived from ml/price.",
    )
    message: str = Field(
        default="Contract registered. Model interface is TBD.",
        description="Contract status message.",
    )
    forecast: Optional[Any] = Field(
        default=None,
        description="TEMPORARY/TBD: Price forecast output series placeholder.",
    )

"""Focused tests for bounded AGMARKNET retries."""

from unittest.mock import patch

import requests

from ml.cost.agmarknet_client import AgmarknetClient, AgmarknetError


class FakeResponse:
    def __init__(self, status_code: int, payload: dict | None = None):
        self.status_code = status_code
        self._payload = payload or {"success": True}
        self.text = str(self._payload)
        self.content = b""
        self.headers = {"content-type": "application/json"}

    @property
    def ok(self):
        return 200 <= self.status_code < 400

    def json(self):
        return self._payload


class FakeSession:
    def __init__(self, outcomes):
        self.outcomes = iter(outcomes)
        self.calls = 0
        self.headers = {}

    def request(self, *args, **kwargs):
        self.calls += 1
        outcome = next(self.outcomes)
        if isinstance(outcome, Exception):
            raise outcome
        return outcome


def test_timeout_is_retried_then_succeeds():
    session = FakeSession([requests.ReadTimeout("temporary"), FakeResponse(200)])
    client = AgmarknetClient(session=session, max_retries=3, backoff_factor=0)

    with patch("ml.cost.agmarknet_client.time.sleep") as sleep:
        client.get_filters()

    assert session.calls == 2
    sleep.assert_called_once_with(0)


def test_503_stops_after_bounded_retries():
    session = FakeSession([FakeResponse(503) for _ in range(4)])
    client = AgmarknetClient(session=session, max_retries=3, backoff_factor=0.5)

    with patch("ml.cost.agmarknet_client.time.sleep") as sleep:
        try:
            client.get_filters()
        except AgmarknetError as exc:
            assert "after 3 retries" in str(exc)
        else:
            raise AssertionError("Expected retries to be exhausted")

    assert session.calls == 4
    assert [call.args[0] for call in sleep.call_args_list] == [0.5, 1.0, 2.0]


if __name__ == "__main__":
    test_timeout_is_retried_then_succeeds()
    test_503_stops_after_bounded_retries()
    print("AGMARKNET retry tests passed.")
"""
Smoke-test the AGMARKNET client.

Run from the repository root after adding requests:
    python scripts/test_agmarknet.py

This does NOT write to MongoDB and does NOT alter the cost calculator.
"""

from ml.cost.agmarknet_client import AgmarknetClient, AgmarknetError


def main() -> None:
    client = AgmarknetClient()

    try:
        filters = client.get_filters()
    except AgmarknetError as exc:
        print("AGMARKNET API unavailable:", exc)
        print(
            "If the website works in your browser but Python gets 403, "
            "check that browser-like headers are preserved and that the "
            "machine is using an India-based network path."
        )
        return

    print("AGMARKNET filters request succeeded.")
    if isinstance(filters, dict):
        print("Top-level keys:", list(filters.keys())[:20])
    else:
        print("Response type:", type(filters).__name__)


if __name__ == "__main__":
    main()

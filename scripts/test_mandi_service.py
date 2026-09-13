from ml.cost.agmarknet_client import AgmarknetClient
from ml.cost.agmarknet_ingestion import fetch_month
from ml.cost.normalizer import normalize_mandi_record

from backend.app.services.mandi_service import (
    get_latest_mandi_price,
    compare_markets,
    calculate_price_volatility,
    calculate_seasonal_analysis,
)


client = AgmarknetClient()

raw_records = fetch_month(
    client,
    year=2026,
    month=9,
    state_id=34,
    state_name="Uttar Pradesh",
    commodity_id=1,
    commodity_name="Wheat",
)

records = [
    normalize_mandi_record(record)
    for record in raw_records
]

print("RAW RECORDS:", len(raw_records))
print("NORMALIZED RECORDS:", len(records))


latest = get_latest_mandi_price(
    records,
    crop="Wheat",
    state="Uttar Pradesh",
)

print("\nLATEST PRICE")
print(latest)


comparison = compare_markets(
    records,
    crop="Wheat",
    state="Uttar Pradesh",
)

print("\nMARKET COUNT:", len(comparison))

print("\nTOP 5 MARKETS")
for item in comparison[:5]:
    print(item)


volatility = calculate_price_volatility(
    records,
    crop="Wheat",
    state="Uttar Pradesh",
)

print("\nVOLATILITY")
print(volatility)


seasonal = calculate_seasonal_analysis(
    records,
    crop="Wheat",
    state="Uttar Pradesh",
)

print("\nSEASONAL ANALYSIS")
print(seasonal)
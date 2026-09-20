import asyncio
import argparse
import json
import os
import tempfile
from datetime import datetime
from pathlib import Path

from ml.cost.agmarknet_client import AgmarknetClient
from ml.cost.agmarknet_ingestion import fetch_month
from ml.cost.normalizer import normalize_mandi_record

from app.services.mandi_repository import upsert_mandi_records
from app.core.database import (
    connect_to_mongo,
    close_mongo_connection,
    db_manager,
)


DEFAULT_FAILURE_FILE = Path("failed_mandi_combinations.json")
DEFAULT_PROGRESS_FILE = Path("mandi_ingestion_progress.json")


def _failure_key(state_name: str, commodity_name: str) -> str:
    return f"{state_name}\x00{commodity_name}"


def _combination_key(
    state_id: int | str,
    commodity_id: int | str,
    year: int,
    month: int,
) -> str:
    return f"{state_id}:{commodity_id}:{year}:{month}"


def load_failures(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}

    try:
        entries = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Could not read failure file {path}: {exc}") from exc

    if not isinstance(entries, list):
        raise RuntimeError(f"Failure file {path} must contain a JSON list")

    failures = {}
    for entry in entries:
        if isinstance(entry, dict) and entry.get("state_name") and entry.get(
            "commodity_name"
        ):
            key = entry.get("combination_key") or _combination_key(
                entry.get("state_id", entry["state_name"]),
                entry.get("commodity_id", entry["commodity_name"]),
                entry.get("year", 0),
                entry.get("month", 0),
            )
            failures[key] = entry
    return failures


def save_failures(path: Path, failures: dict[str, dict]) -> None:
    temporary_fd, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.",
        suffix=".tmp",
        dir=path.parent,
        text=True,
    )
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(temporary_fd, "w", encoding="utf-8") as temporary_file:
            json.dump(list(failures.values()), temporary_file, indent=2, sort_keys=True)
        try:
            os.replace(temporary_path, path)
        except PermissionError:
            path.write_text(temporary_path.read_text(encoding="utf-8"), encoding="utf-8")
    finally:
        temporary_path.unlink(missing_ok=True)


def load_progress(path: Path) -> set[str]:
    if not path.exists():
        return set()

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Could not read progress file {path}: {exc}") from exc

    completed = payload.get("completed", []) if isinstance(payload, dict) else []
    return {str(key) for key in completed}


def save_progress(path: Path, completed: set[str]) -> None:
    save_json(path, {"completed": sorted(completed)})


def save_json(path: Path, payload: dict) -> None:
    temporary_fd, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.",
        suffix=".tmp",
        dir=path.parent,
        text=True,
    )
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(temporary_fd, "w", encoding="utf-8") as temporary_file:
            json.dump(payload, temporary_file, indent=2, sort_keys=True)
        try:
            os.replace(temporary_path, path)
        except PermissionError:
            path.write_text(temporary_path.read_text(encoding="utf-8"), encoding="utf-8")
    finally:
        temporary_path.unlink(missing_ok=True)


def parse_args():
    parser = argparse.ArgumentParser(description="Ingest AGMARKNET mandi data")
    parser.add_argument(
        "--retry-failed",
        action="store_true",
        help="process only state/crop combinations in the failure file",
    )
    parser.add_argument(
        "--failed-file",
        type=Path,
        default=DEFAULT_FAILURE_FILE,
        help="JSON file used to record exhausted state/crop failures",
    )
    parser.add_argument(
        "--progress-file",
        type=Path,
        default=DEFAULT_PROGRESS_FILE,
        help="JSON file used to resume completed state/commodity combinations",
    )
    parser.add_argument(
        "--year",
        type=int,
        default=datetime.now().year,
        help="AGMARKNET year to ingest",
    )
    parser.add_argument(
        "--month",
        type=int,
        default=datetime.now().month,
        choices=range(1, 13),
        help="AGMARKNET month to ingest",
    )
    parser.add_argument(
        "--commodity",
        action="append",
        dest="commodities",
        help="process only this AGMARKNET commodity name; repeat for batches",
    )
    parser.add_argument(
        "--state",
        action="append",
        dest="states",
        help="process only this state; repeat for multiple states",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=100,
        help="maximum state/commodity combinations to process in this run",
    )
    return parser.parse_args()


def build_maps(filters):
    """Build state and commodity maps from AGMARKNET."""

    data = filters["data"]

    state_map = {
    item["state_name"]: item["state_id"]
    for item in data["state_data"]
    if item.get("state_name") and item.get("state_id") is not None
}

    commodity_map = {
        item["cmdt_name"]: item["cmdt_id"]
        for item in data["cmdt_data"]
        if item.get("cmdt_name") and item.get("cmdt_id") is not None
    }

    return state_map, commodity_map


async def main():
    args = parse_args()
    if args.batch_size <= 0:
        raise ValueError("--batch-size must be greater than zero")

    failures = load_failures(args.failed_file)
    completed = load_progress(args.progress_file)

    print("Connecting to MongoDB...")
    await connect_to_mongo()

    print("CONNECTED:", db_manager.is_connected)
    print("DATABASE:", db_manager.database)

    if not db_manager.is_connected:
        raise RuntimeError("MongoDB connection failed")

    client = AgmarknetClient()

    print("\nGetting AGMARKNET filters...")
    filters = client.get_filters()

    state_map, commodity_map = build_maps(filters)

    print(f"AGMARKNET STATES: {len(state_map)}")
    print(f"AGMARKNET COMMODITIES: {len(commodity_map)}")

    available_commodities = commodity_map
    if args.commodities:
        requested_commodities = {name.casefold() for name in args.commodities}
        available_commodities = {
            name: commodity_id
            for name, commodity_id in commodity_map.items()
            if name.casefold() in requested_commodities
        }

    print(f"AGMARKNET COMMODITIES SELECTED: {len(available_commodities)}")

    total_raw = 0
    total_normalized = 0
    total_saved = 0

    selected_states = state_map
    if args.states:
        requested_states = set(args.states)
        selected_states = {
            state: state_id
            for state, state_id in state_map.items()
            if state in requested_states
        }

    combinations = [
        (state_name, state_id, commodity_name, commodity_id)
        for commodity_name, commodity_id in available_commodities.items()
        for state_name, state_id in selected_states.items()
    ]
    processed = 0

    print(f"COMBINATIONS AVAILABLE: {len(combinations)}")
    print(f"BATCH SIZE: {args.batch_size}")

    for state_name, state_id, commodity_name, commodity_id in combinations:
        combination_key = _combination_key(
            state_id,
            commodity_id,
            args.year,
            args.month,
        )
        if args.retry_failed:
            if combination_key not in failures:
                continue
        elif combination_key in completed:
            continue

        try:
            raw_records = fetch_month(
                client,
                year=args.year,
                month=args.month,
                state_id=state_id,
                state_name=state_name,
                commodity_id=commodity_id,
                commodity_name=commodity_name,
            )

            normalized_records = [
                normalize_mandi_record(record)
                for record in raw_records
            ]
            saved = await upsert_mandi_records(normalized_records)

            total_raw += len(raw_records)
            total_normalized += len(normalized_records)
            total_saved += saved
            completed.add(combination_key)
            failures.pop(combination_key, None)
            save_progress(args.progress_file, completed)
            save_failures(args.failed_file, failures)
            processed += 1

            print(
                f"{commodity_name} / {state_name}: "
                f"{len(raw_records)} records -> {saved} saved"
            )

        except Exception as exc:
            failures[combination_key] = {
                "combination_key": combination_key,
                "state_name": state_name,
                "state_id": state_id,
                "commodity_name": commodity_name,
                "commodity_id": commodity_id,
                "year": args.year,
                "month": args.month,
                "error": f"{type(exc).__name__}: {exc}",
            }
            save_failures(args.failed_file, failures)
            processed += 1
            print(
                f"{commodity_name} / {state_name}: skipped "
                f"({type(exc).__name__}: {exc})"
            )

        if processed >= args.batch_size:
            break

    print("\n========== INGESTION SUMMARY ==========")
    print("TOTAL RAW:", total_raw)
    print("TOTAL NORMALIZED:", total_normalized)
    print("TOTAL SAVED:", total_saved)
    print("FAILED COMBINATIONS:", len(failures))
    print("COMPLETED COMBINATIONS:", len(completed))
    print("PROCESSED THIS RUN:", processed)
    print("FAILURE FILE:", args.failed_file)
    print("PROGRESS FILE:", args.progress_file)

    await close_mongo_connection()

    print("\nMandi ingestion completed.")


if __name__ == "__main__":
    asyncio.run(main())
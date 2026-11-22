from datetime import date
import unittest

from app.services.price_service import build_price_forecast


class PriceForecastTests(unittest.TestCase):
    def test_linear_trend_forecast_uses_observed_median_prices(self):
        records = [
            {
                "date": "01/09/2026",
                "modal_price_inr_per_kg": 20,
                "source": "AGMARKNET",
            },
            {
                "date": "02/09/2026",
                "modal_price_inr_per_kg": 21,
                "source": "AGMARKNET",
            },
            {
                "date": "02/09/2026",
                "modal_price_inr_per_kg": 23,
                "source": "AGMARKNET",
            },
            {
                "date": "03/09/2026",
                "modal_price_inr_per_kg": 22,
                "source": "AGMARKNET",
            },
        ]

        result = build_price_forecast(
            records,
            commodity="Wheat",
            state="Punjab",
            market=None,
            days_ahead=2,
            as_of=date(2026, 9, 3),
        )

        self.assertEqual(result["current_price"], 2200)
        self.assertEqual(result["forecasted_price"], 2433.33)
        self.assertEqual(result["trend"], "upward")
        self.assertEqual(result["observations_used"], 3)
        self.assertEqual(
            result["chart_data"]["dates"],
            ["2026-09-03", "2026-09-04", "2026-09-05"],
        )
        self.assertEqual(
            result["chart_data"]["prices"],
            [2200, 2333.33, 2433.33],
        )
        self.assertEqual(result["source"], "AGMARKNET")

    def test_forecast_rejects_insufficient_distinct_observation_dates(self):
        with self.assertRaisesRegex(ValueError, "At least 3 distinct dates"):
            build_price_forecast(
            [
                {"date": "01/09/2026", "modal_price_inr_per_kg": 20},
                {"date": "01/09/2026", "modal_price_inr_per_kg": 21},
            ],
            commodity="Wheat",
            state="Punjab",
            market=None,
            days_ahead=7,
            as_of=date(2026, 9, 2),
        )

    def test_forecast_marks_old_history_and_does_not_claim_current_prices(self):
        result = build_price_forecast(
            [
                {"date": "01/09/2026", "modal_price_inr_per_kg": 20},
                {"date": "02/09/2026", "modal_price_inr_per_kg": 21},
                {"date": "03/09/2026", "modal_price_inr_per_kg": 22},
            ],
            commodity="Wheat",
            state="Punjab",
            market="Example APMC",
            days_ahead=7,
            as_of=date(2026, 11, 22),
        )

        self.assertTrue(result["is_stale"])
        self.assertEqual(result["data_age_days"], 80)
        self.assertIn("more than 30 days old", result["warning"])


if __name__ == "__main__":
    unittest.main()

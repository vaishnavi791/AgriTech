import unittest

from backend.app.services.apy_recommendation_service import (
    APYRecommendationError,
    historical_crop_candidates,
)


class APYRecommendationServiceTest(unittest.TestCase):

    def test_kanpur_nagar_rabi_returns_historical_candidates(self):
        candidates = historical_crop_candidates("Kanpur Nagar", "Rabi")

        self.assertEqual(13, len(candidates))
        self.assertEqual("Wheat", candidates[0]["crop_name"])
        self.assertEqual(4, candidates[0]["historical_record_count"])
        self.assertEqual("2022-2023", candidates[0]["most_recent_year"])
        self.assertEqual(1, candidates[0]["historical_evidence_rank"])

        self.assertIsNotNone(candidates[0]["average_area"])
        self.assertIsNotNone(candidates[0]["average_production"])
        self.assertIsNotNone(candidates[0]["average_yield"])

    def test_district_and_season_matching_is_case_insensitive(self):
        candidates = historical_crop_candidates(
            " kanpur nagar ",
            "rabi",
        )

        self.assertEqual(13, len(candidates))

    def test_missing_district_is_rejected(self):
        with self.assertRaises(APYRecommendationError):
            historical_crop_candidates("", "Rabi")

    def test_missing_season_is_rejected(self):
        with self.assertRaises(APYRecommendationError):
            historical_crop_candidates("Kanpur Nagar", "")


if __name__ == "__main__":
    unittest.main()

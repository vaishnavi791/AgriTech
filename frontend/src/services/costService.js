import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const costService = {
  async estimateCost(params) {
    const response = await api.post(API_ENDPOINTS.COST.ESTIMATE, params);
    return response.data;
  },

  async getLatestMandiPrice(crop, state, market = null) {
    const params = new URLSearchParams({
      crop,
      state,
    });

    if (market) {
      params.append('market', market);
    }

    const response = await api.get(`/mandi/latest?${params.toString()}`);
    return response.data;
  },

  async getHistoricalPrices(crop, state, market = null) {
    const params = new URLSearchParams({
      crop,
      state,
    });

    if (market) {
      params.append('market', market);
    }

    const response = await api.get(`/mandi/historical?${params.toString()}`);
    return response.data;
  },

  async getMarketComparison(crop, state) {
    const response = await api.get(
      `/mandi/markets?crop=${encodeURIComponent(crop)}&state=${encodeURIComponent(state)}`
    );
    return response.data;
  },

  async getPriceVolatility(crop, state) {
    const response = await api.get(
      `/mandi/volatility?crop=${encodeURIComponent(crop)}&state=${encodeURIComponent(state)}`
    );
    return response.data;
  },

  async getSeasonalAnalysis(crop, state) {
    const response = await api.get(
      `/mandi/seasonal?crop=${encodeURIComponent(crop)}&state=${encodeURIComponent(state)}`
    );
    return response.data;
  },
};

export default costService;
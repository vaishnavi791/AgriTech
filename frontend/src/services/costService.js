import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const costService = {
  async getAvailableCommodities(state = null) {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    const response = await api.get(`/mandi/commodities?${params.toString()}`);
    return response.data;
  },

  async getAvailableStates(crop = null) {
    const params = new URLSearchParams();
    if (crop) params.append('crop', crop);
    const response = await api.get(`/mandi/states?${params.toString()}`);
    return response.data;
  },

  async getAvailableMarkets(crop, state) {
    const params = new URLSearchParams({ crop, state });
    const response = await api.get(`/mandi/available-markets?${params.toString()}`);
    return response.data;
  },

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
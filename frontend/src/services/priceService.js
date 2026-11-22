import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const priceService = {
  async getAvailableCommodities(state = null) {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    const response = await api.get(`/mandi/commodities?${params.toString()}`);
    return response.data;
  },

  async getAvailableStates(commodity) {
    const params = new URLSearchParams({ crop: commodity });
    const response = await api.get(`/mandi/states?${params.toString()}`);
    return response.data;
  },

  async getAvailableMarkets(commodity, state) {
    const params = new URLSearchParams({ crop: commodity, state });
    const response = await api.get(`/mandi/available-markets?${params.toString()}`);
    return response.data;
  },

  /**
   * Fetch market price forecasts for selected commodity, state, and market.
   * @param {Object} params - { commodity, state, market, days_ahead }
   */
  async forecastPrice(params) {
    const response = await api.post(API_ENDPOINTS.PRICE.FORECAST, params);
    return response.data;
  },
};

export default priceService;

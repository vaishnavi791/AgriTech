import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const priceService = {
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


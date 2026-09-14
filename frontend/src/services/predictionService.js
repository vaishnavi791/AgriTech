import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const predictionService = {
  /**
   * Retrieve historical predictions for the authenticated user.
   * @param {Object} [params] - Query parameters
   * @param {string} [params.module] - Optional filter by module ('crop', 'disease', 'cost', 'price')
   * @param {number} [params.limit=50] - Number of records to retrieve
   * @returns {Promise<Object>} { success, total, predictions }
   */
  async getHistory(params = {}) {
    const response = await api.get(API_ENDPOINTS.PREDICTIONS.HISTORY, { params });
    return response.data;
  },
};

export default predictionService;


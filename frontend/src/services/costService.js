import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const costService = {
  /**
   * Calculate cultivation cost estimation.
   * @param {Object} params - { crop_type, land_area, seed_cost, fertilizer_cost, labor_cost, machinery_cost, irrigation_cost }
   */
  async estimateCost(params) {
    const response = await api.post(API_ENDPOINTS.COST.ESTIMATE, params);
    return response.data;
  },
};

export default costService;


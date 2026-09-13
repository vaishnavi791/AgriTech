import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const cropService = {
  /**
   * Request crop recommendation based on environmental and soil parameters.
   * @param {Object} params - { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall, soil_type }
   */
  async getRecommendation(params) {
    const response = await api.post(API_ENDPOINTS.CROP.RECOMMEND, params);
    return response.data;
  },
};

export default cropService;


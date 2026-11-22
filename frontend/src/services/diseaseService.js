import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const diseaseService = {
  /**
   * Upload an image of plant leaf for disease detection.
   * @param {File} imageFile - The leaf image file to diagnose
   */
  async detectDisease(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.post(
      API_ENDPOINTS.DISEASE.PREDICT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};

export default diseaseService;
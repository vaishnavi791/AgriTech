// src/services/apyService.js
import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Retrieves APY candidate crops for a given district and season.
 * @param {{ district: string, season: string }} params
 * @returns {Promise<Array>} Array of candidate objects (as returned in .candidates).
 */
const getCandidates = ({ district, season }) => {
  return api
    .get(API_ENDPOINTS.APY.CANDIDATES, { params: { district, season } })
    .then((res) => res.data?.candidates || []);
};

export default { getCandidates };


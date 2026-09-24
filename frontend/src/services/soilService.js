import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const getModelInputs = ({ latitude, longitude }) => {
  return api
    .post(API_ENDPOINTS.SOIL.MODEL_INPUTS, { latitude, longitude })
    .then((res) => res.data);
};

const getModelInputsByDistrict = ({ state, district }) => {
  return api
    .post(API_ENDPOINTS.SOIL.MODEL_INPUTS_BY_DISTRICT, {
      state,
      district,
    })
    .then((res) => res.data);
};

export default {
  getModelInputs,
  getModelInputsByDistrict,
};
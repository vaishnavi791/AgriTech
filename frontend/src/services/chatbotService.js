import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const chatbotService = {
  async sendMessage(message, sessionId = null) {
    const payload = { message };
    if (sessionId) {
      payload.session_id = sessionId;
    }
    const response = await api.post(API_ENDPOINTS.CHATBOT.CHAT, payload);
    return response.data;
  },
};

export default chatbotService;

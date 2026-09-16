import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const chatbotService = {
  async sendMessage(message, sessionId) {
    const payload = { message, session_id: sessionId };
    const response = await api.post(API_ENDPOINTS.CHATBOT.CHAT, payload);
    return response.data;
  },
};

export default chatbotService;

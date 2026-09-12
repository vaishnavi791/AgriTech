import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const chatbotService = {
  /**
   * Send question or conversation turn to FastAPI AI Chatbot.
   * @param {string} message - User query
   * @param {Array} history - Array of previous messages [{ role: 'user' | 'assistant', content: string }]
   */
  async sendMessage(message, history = []) {
    const response = await api.post(API_ENDPOINTS.CHATBOT.MESSAGE, {
      message,
      history,
    });
    return response.data;
  },
};

export default chatbotService;


export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const STORAGE_KEYS = {
  TOKEN: 'agritech_token',
  USER: 'agritech_user',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  CROP: {
    RECOMMEND: '/crop/predict',
  },
  DISEASE: {
    DETECT: '/disease/detect',
    PREDICT: '/disease/predict',
  },
  COST: {
    ESTIMATE: '/cost/estimate',
  },
  PRICE: {
    FORECAST: '/price/forecast',
  },
  CHATBOT: {
    MESSAGE: '/chatbot/message',
    CHAT: '/chatbot/chat',
  },
  PREDICTIONS: {
    HISTORY: '/predictions/history',
  },
};

export const SOIL_TYPES = [
  'Alluvial Soil',
  'Black Soil (Regur)',
  'Red & Yellow Soil',
  'Laterite Soil',
  'Arid / Desert Soil',
  'Saline & Alkaline Soil',
  'Peaty & Organic Soil',
  'Loamy Soil',
  'Sandy Loam',
  'Clayey Soil',
];

export const STATES_LIST = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export const COMMODITIES_LIST = [
  'Wheat',
  'Rice / Paddy',
  'Maize',
  'Cotton',
  'Soybean',
  'Sugarcane',
  'Potato',
  'Onion',
  'Tomato',
  'Mustard',
  'Gram / Chickpea',
  'Tur / Pigeon Pea',
];

export const PRIORITY_FEATURES = [
  {
    id: 'crop',
    title: 'Crop Recommendation',
    description: 'Find the optimal crop suited for your soil N-P-K levels, pH, rainfall, and climate conditions.',
    path: '/crop-recommendation',
    icon: 'Sprout',
    color: 'bg-agri-50 text-agri-700 border-agri-200',
  },
  {
    id: 'disease',
    title: 'Disease Detection',
    description: 'Upload photos of plant leaves for AI-powered disease identification and treatment remedies.',
    path: '/disease-detection',
    icon: 'ScanLine',
    color: 'bg-harvest-50 text-harvest-600 border-harvest-100',
  },
  {
    id: 'cost',
    title: 'Cost Estimation',
    description: 'Calculate input expenses, labor, machinery, and fertilizer costs to project your net profitability.',
    path: '/cost-estimation',
    icon: 'Calculator',
    color: 'bg-cream-200 text-earth-charcoal border-cream-300',
  },
  {
    id: 'price',
    title: 'Price Forecasting',
    description: 'Forecast APMC mandi commodity prices using historical seasonal trends to plan the best selling time.',
    path: '/price-forecasting',
    icon: 'TrendingUp',
    color: 'bg-sage-100 text-agri-800 border-sage-300',
  },
  {
    id: 'chatbot',
    title: 'AI Agri Chatbot',
    description: 'Ask instant agronomic questions 24/7 in natural language for tailored farming advisory.',
    path: '#chatbot',
    icon: 'Bot',
    color: 'bg-agri-50 text-agri-800 border-agri-200',
  },
];


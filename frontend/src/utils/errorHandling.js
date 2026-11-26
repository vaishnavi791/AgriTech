const DEFAULT_ERROR = 'common.errors.unexpected';

const validationFieldKeys = {
  auth: {
    email: 'auth.emailLabel',
    full_name: 'auth.nameLabel',
    password: 'auth.passwordLabel',
  },
  crop: {
    N: 'cropFields.nitrogen',
    P: 'cropFields.phosphorus',
    K: 'cropFields.potassium',
    temperature: 'cropFields.temperature',
    humidity: 'cropFields.humidity',
    ph: 'cropFields.ph',
    rainfall: 'cropFields.rainfall',
  },
  cost: {
    crop: 'cost.crop',
    state: 'cost.state',
    market: 'cost.market',
    land_size_acres: 'cost.landArea',
    seed_rate_kg_per_acre: 'costFields.seedRate',
    seed_price_inr_per_kg: 'costFields.seedPrice',
    n_rate_kg_per_acre: 'costFields.nitrogen',
    p_rate_kg_per_acre: 'costFields.phosphorus',
    k_rate_kg_per_acre: 'costFields.potassium',
    fertilizer_price_inr_per_kg: 'costFields.fertilizerPrice',
    water_requirement_mm: 'costFields.waterRequirement',
    water_rate_inr_per_mm_per_acre: 'costFields.waterRate',
    water_efficiency_factor: 'costFields.efficiency',
    labor_days_per_acre: 'costFields.laborDays',
    wage_inr_per_day: 'costFields.wage',
    expected_yield_kg_per_acre: 'costFields.expectedYield',
    market_price_inr_per_kg: 'costFields.currentPrice',
    machinery_cost_inr_per_acre: 'costFields.machinery',
    other_input_cost_inr_per_acre: 'costFields.otherInputs',
  },
  price: {
    commodity: 'priceFields.commodity',
    state: 'priceFields.state',
    market: 'priceFields.market',
    days_ahead: 'priceFields.duration',
  },
};

const getRequestPath = (error) => {
  const url = error?.config?.url;
  return typeof url === 'string' ? url.split('?')[0].toLowerCase() : '';
};

const getResponseMessage = (error) => {
  const data = error?.response?.data;
  const message = data?.error?.message || data?.detail || data?.message;
  return typeof message === 'string' ? message.toLowerCase() : '';
};

const getValidationMessage = (error, path) => {
  const data = error?.response?.data;
  const details = data?.error?.details || data?.details || data?.detail;
  if (!Array.isArray(details) || details.length === 0) return null;

  const issue = details[0];
  const location = Array.isArray(issue?.loc) ? issue.loc : [];
  const field = location[location.length - 1];
  const type = typeof issue?.type === 'string' ? issue.type : '';
  const isMissing = type === 'missing' || type.endsWith('_missing');
  const isAuth = path.includes('/auth/login') || path.includes('/auth/register');

  if (isAuth) {
    if (field === 'email') {
      return isMissing ? 'auth.errors.emailRequired' : 'auth.errors.emailInvalid';
    }
    if (field === 'password') {
      if (isMissing) return 'auth.errors.passwordRequired';
      if (path.includes('/auth/register') && type === 'string_too_short') {
        return 'auth.errors.passwordMin';
      }
    }
    if (field === 'full_name' && isMissing) return 'auth.errors.nameRequired';
  }

  const moduleName = path.includes('/crop/')
    ? 'crop'
    : path.includes('/cost/')
      ? 'cost'
      : path.includes('/price/')
        ? 'price'
        : null;
  const fieldKey = moduleName && validationFieldKeys[moduleName][field];

  if (isMissing) {
    return fieldKey
      ? { key: 'common.errors.fieldRequired', params: { field: { key: fieldKey } } }
      : 'common.errors.invalidInput';
  }
  if (!fieldKey) return 'common.errors.invalidInput';

  if (type === 'string_too_long' || type === 'too_long') {
    return { key: 'common.errors.fieldTooLong', params: { field: { key: fieldKey } } };
  }
  if (type.includes('greater_than') || type.includes('less_than')) {
    return { key: 'common.errors.fieldOutOfRange', params: { field: { key: fieldKey } } };
  }
  return { key: 'common.errors.fieldInvalid', params: { field: { key: fieldKey } } };
};

export const getUserFriendlyError = (error, fallback = DEFAULT_ERROR) => {
  const response = error?.response;
  const status = response?.status;
  const path = getRequestPath(error);
  const responseMessage = getResponseMessage(error);

  if (!response) {
    if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
      return 'common.errors.network';
    }
    if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
      return 'common.errors.timeout';
    }
    return fallback;
  }

  if (status === 401) {
    return path.includes('/auth/login')
      ? 'auth.errors.invalidCredentials'
      : 'common.errors.sessionExpired';
  }
  if (status === 409 && path.includes('/auth/register')) {
    return 'auth.errors.emailAlreadyRegistered';
  }
  if (status === 413 || (path.includes('/disease/') && responseMessage.includes('exceeds maximum'))) {
    return 'diseaseFields.fileTooLarge';
  }
  if (status === 429) {
    return path.includes('/chatbot/')
      ? 'chatbot.errors.rateLimit'
      : 'common.errors.rateLimited';
  }
  if (status === 408) return 'common.errors.timeout';

  if ([502, 503, 504].includes(status) && path.includes('/chatbot/')) {
    return 'chatbot.errors.unavailable';
  }
  if (status >= 500) return 'common.errors.serviceUnavailable';

  if (status === 422) {
    if (path.includes('/price/forecast')) {
      if (responseMessage.includes('at least 3 distinct dates')) return 'uiErrors.insufficientPrices';
      if (responseMessage.includes('does not span enough time')) return 'priceFields.historyTooShort';
    }
    return getValidationMessage(error, path) || 'common.errors.invalidInput';
  }

  if (status === 400 && path.includes('/disease/')) {
    if (responseMessage.includes('invalid file type')) return 'diseaseFields.invalidFile';
    if (responseMessage.includes('no file uploaded')) return 'diseaseFields.fileRequired';
    if (responseMessage.includes('empty') || responseMessage.includes('corrupted') || responseMessage.includes('unreadable')) {
      return 'diseaseFields.invalidImage';
    }
  }

  if (status === 404) {
    return fallback === DEFAULT_ERROR ? 'common.errors.notFound' : fallback;
  }
  if (status === 400 || status === 422) return 'common.errors.invalidInput';
  if (status === 403) return 'common.errors.forbidden';

  return fallback;
};

export default getUserFriendlyError;

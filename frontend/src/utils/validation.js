/**
 * Validation utilities for AgriTech forms and inputs.
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  return name.trim().length >= 2;
};

/**
 * Validates login form fields.
 * @param {Object} fields - { email, password }
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Please enter your password.';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates registration form fields.
 * @param {Object} fields - { name, email, password, confirmPassword }
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Please enter your full name.';
  } else if (!isValidName(name)) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Please enter your password.';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const isPositiveNumber = (val) => {
  if (val === '' || val === null || val === undefined) return false;
  const num = Number(val);
  return !isNaN(num) && num >= 0;
};

export const isWithinRange = (val, min, max) => {
  const num = Number(val);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

export const formatCurrency = (amount, currency = 'INR') => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatPercentage = (val) => {
  const num = Number(val);
  if (isNaN(num)) return '0%';
  return `${(num > 1 ? num : num * 100).toFixed(1)}%`;
};

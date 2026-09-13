import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff, ArrowRight, Leaf } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useLanguage from '../hooks/useLanguage';
import ErrorMessage from '../components/ErrorMessage';
import { validateRegisterForm } from '../utils/validation';

export const Register = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (formError) setFormError('');
    if (error) clearError();
  };

  const handleBlur = (field) => {
    const result = validateRegisterForm(formData);
    if (result.errors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: result.errors[field],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setFormError('Please resolve the highlighted validation issues before creating your account.');
      return;
    }

    setFieldErrors({});
    setFormError('');

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/welcome');
    } catch (err) {
      setFormError(err.message || 'Unable to create account at this time.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card border border-cream-300 p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-agri-50 border border-agri-200 rounded-xl text-agri-700 shadow-sm">
            <Leaf className="w-7 h-7 text-agri-600" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-earth-dark tracking-tight">
            {t('auth.createAccountTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
            {t('auth.createAccountSubtitle')}
          </p>
        </div>

        {/* Global Error Notice Banner */}
        {(formError || error) && (
          <ErrorMessage
            message={formError || error}
            onDismiss={() => {
              setFormError('');
              clearError();
            }}
          />
        )}

        {/* Form Controls */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-earth-dark uppercase mb-1.5 tracking-wider"
            >
              {t('auth.nameLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-muted">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                disabled={isLoading}
                placeholder={t('auth.namePlaceholder')}
                autoComplete="name"
                className={`block w-full pl-10 pr-3.5 py-2.5 text-sm bg-cream-50/60 rounded-lg text-earth-dark outline-none transition placeholder:text-earth-subtle disabled:opacity-60 disabled:cursor-not-allowed ${
                  fieldErrors.name
                    ? 'border border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-50/20'
                    : 'border border-cream-300 focus:ring-2 focus:ring-agri-600 focus:border-agri-600'
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email Address Field */}
          <div>
            <label
              htmlFor="register-email"
              className="block text-xs font-semibold text-earth-dark uppercase mb-1.5 tracking-wider"
            >
              {t('auth.emailLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="register-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                disabled={isLoading}
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
                className={`block w-full pl-10 pr-3.5 py-2.5 text-sm bg-cream-50/60 rounded-lg text-earth-dark outline-none transition placeholder:text-earth-subtle disabled:opacity-60 disabled:cursor-not-allowed ${
                  fieldErrors.email
                    ? 'border border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-50/20'
                    : 'border border-cream-300 focus:ring-2 focus:ring-agri-600 focus:border-agri-600'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field with Toggle */}
          <div>
            <label
              htmlFor="register-password"
              className="block text-xs font-semibold text-earth-dark uppercase mb-1.5 tracking-wider"
            >
              {t('auth.passwordLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                disabled={isLoading}
                placeholder={t('auth.passwordPlaceholder')}
                autoComplete="new-password"
                className={`block w-full pl-10 pr-11 py-2.5 text-sm bg-cream-50/60 rounded-lg text-earth-dark outline-none transition placeholder:text-earth-subtle disabled:opacity-60 disabled:cursor-not-allowed ${
                  fieldErrors.password
                    ? 'border border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-50/20'
                    : 'border border-cream-300 focus:ring-2 focus:ring-agri-600 focus:border-agri-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-earth-muted hover:text-earth-dark focus:outline-none transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-agri-700" />
                ) : (
                  <Eye className="w-4 h-4 text-earth-muted" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password Field with Toggle */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs font-semibold text-earth-dark uppercase mb-1.5 tracking-wider"
            >
              {t('auth.confirmPasswordLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                disabled={isLoading}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                autoComplete="new-password"
                className={`block w-full pl-10 pr-11 py-2.5 text-sm bg-cream-50/60 rounded-lg text-earth-dark outline-none transition placeholder:text-earth-subtle disabled:opacity-60 disabled:cursor-not-allowed ${
                  fieldErrors.confirmPassword
                    ? 'border border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-50/20'
                    : 'border border-cream-300 focus:ring-2 focus:ring-agri-600 focus:border-agri-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-earth-muted hover:text-earth-dark focus:outline-none transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-agri-700" />
                ) : (
                  <Eye className="w-4 h-4 text-earth-muted" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg shadow-card text-sm font-semibold text-cream-50 bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                <span>{t('auth.creatingAccount')}</span>
              </div>
            ) : (
              <>
                <span>{t('auth.createAccountBtn')}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center pt-4 border-t border-cream-200">
          <p className="text-xs text-earth-muted">
            {t('auth.haveAccount')}{' '}
            <Link
              to="/login"
              className="font-semibold text-agri-700 hover:text-agri-800 hover:underline transition-colors"
            >
              {t('auth.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

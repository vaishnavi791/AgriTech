import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BarChart3, 
  ArrowRight
} from 'lucide-react';
import priceService from '../../services/priceService';
import usePrediction from '../../hooks/usePrediction';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import PriceChart from './PriceChart';
import PredictionCard from '../../components/PredictionCard';
import { COMMODITIES_LIST, STATES_LIST } from '../../utils/constants';
import { formatCurrency } from '../../utils/validation';

export const PriceForecasting = () => {
  const { priceResult, setPriceResult } = usePrediction();

  const [formData, setFormData] = useState({
    commodity: COMMODITIES_LIST[0],
    state: STATES_LIST[0],
    market: 'Main APMC Mandi',
    days_ahead: '15',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        commodity: formData.commodity,
        state: formData.state,
        market: formData.market,
        days_ahead: parseInt(formData.days_ahead, 10) || 15,
      };

      const result = await priceService.forecastPrice(payload);
      setPriceResult(result);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to fetch price forecast. Please check backend status.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPriceResult(null);
    setErrorMessage(null);
  };

  const currentPrice = priceResult?.current_price || 2350;
  const forecastedPrice = priceResult?.forecasted_price || 2520;
  const priceDiff = forecastedPrice - currentPrice;
  const isBullish = priceDiff > 0;
  const isBearish = priceDiff < 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-sage-100 border border-sage-300 text-agri-800 rounded-xl mb-2">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-earth-dark tracking-tight">
          APMC Mandi Price Forecasting
        </h1>
        <p className="text-xs sm:text-sm text-earth-muted max-w-xl mx-auto leading-relaxed">
          Leverage historical time-series trends and seasonal harvest influx patterns to forecast mandi price movements.
        </p>
      </div>

      <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {/* Result Display or Input Form */}
      {priceResult ? (
        <PredictionCard
          title={`${formData.commodity} Price Forecast (${formData.state})`}
          subtitle={`Forecast horizon: Next ${formData.days_ahead} days at ${formData.market}`}
          badgeText={isBullish ? 'Upward Trend' : isBearish ? 'Downward Trend' : 'Stable Trend'}
          onReset={handleReset}
          resetLabel="Forecast Another Market"
        >
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-cream-50 border border-cream-300 rounded-xl">
                <span className="text-xs font-semibold text-earth-muted uppercase tracking-wider">Current Modal Rate</span>
                <div className="font-serif text-2xl font-bold text-earth-dark mt-0.5">
                  {formatCurrency(currentPrice)}/q
                </div>
                <p className="text-[11px] text-earth-muted">Per Quintal (100 kg)</p>
              </div>

              <div className="p-4 bg-agri-50 border border-agri-200 rounded-xl">
                <span className="text-xs font-semibold text-agri-800 uppercase tracking-wider">Projected Rate</span>
                <div className="font-serif text-2xl font-bold text-agri-900 mt-0.5">
                  {formatCurrency(forecastedPrice)}/q
                </div>
                <div className="flex items-center space-x-1 text-xs font-semibold mt-1">
                  {isBullish ? (
                    <span className="text-agri-700 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-1 text-agri-600" />
                      +{formatCurrency(priceDiff)} (+{((priceDiff / currentPrice) * 100).toFixed(1)}%)
                    </span>
                  ) : isBearish ? (
                    <span className="text-terracotta-600 flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 mr-1" />
                      {formatCurrency(priceDiff)} ({((priceDiff / currentPrice) * 100).toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-earth-muted flex items-center">
                      <Minus className="w-3.5 h-3.5 mr-1" /> Stable
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-cream-200/70 border border-cream-300 rounded-xl">
                <span className="text-xs font-semibold text-earth-charcoal uppercase tracking-wider">Market Recommendation</span>
                <div className="font-serif text-sm font-bold text-earth-dark mt-1">
                  {isBullish ? 'Hold Stock for Higher Rate' : 'Sell Promptly in Mandi'}
                </div>
                <p className="text-[11px] text-earth-muted mt-1 leading-relaxed">
                  {isBullish
                    ? 'Supplies expected to contract in coming weeks.'
                    : 'Upcoming harvest influx may depress mandi spot prices.'}
                </p>
              </div>
            </div>

            {/* Interactive Chart */}
            <div className="p-4 bg-white border border-cream-300 rounded-xl shadow-card">
              <h4 className="font-serif text-sm font-bold text-earth-dark mb-3 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-agri-600" />
                <span>Price Trajectory Curve (₹/Quintal)</span>
              </h4>
              <PriceChart
                forecastData={
                  priceResult.chart_data || {
                    dates: ['Day 1', 'Day 3', 'Day 6', 'Day 9', 'Day 12', 'Day 15'],
                    prices: [2350, 2380, 2420, 2450, 2490, 2520],
                    min_prices: [2290, 2310, 2350, 2390, 2420, 2450],
                  }
                }
                commodity={formData.commodity}
              />
            </div>
          </div>
        </PredictionCard>
      ) : (
        <div className="bg-white rounded-xl shadow-card border border-cream-300 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-cream-200 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                Mandi & Commodity Selection
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Commodity Crop
                </label>
                <select
                  name="commodity"
                  value={formData.commodity}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                >
                  {COMMODITIES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                >
                  {STATES_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Mandi / Local Market
                </label>
                <input
                  type="text"
                  name="market"
                  value={formData.market}
                  onChange={handleChange}
                  placeholder="e.g. Pune APMC Mandi"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Forecast Duration
                </label>
                <select
                  name="days_ahead"
                  value={formData.days_ahead}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                >
                  <option value="7">Next 7 Days</option>
                  <option value="15">Next 15 Days</option>
                  <option value="30">Next 30 Days</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-agri-600 hover:bg-agri-700 text-cream-50 font-semibold rounded-lg shadow-card hover:shadow-card-hover transition disabled:opacity-50"
              >
                {isLoading ? (
                  <Loading message="Forecasting market prices..." size="small" />
                ) : (
                  <>
                    <span>Generate Price Forecast</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PriceForecasting;

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import priceService from '../../services/priceService';
import usePrediction from '../../hooks/usePrediction';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import PriceChart from './PriceChart';
import PredictionCard from '../../components/PredictionCard';
import { formatCurrency } from '../../utils/validation';

const inputClass =
  'w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition';

export const PriceForecasting = () => {
  const { priceResult, setPriceResult } = usePrediction();
  const [formData, setFormData] = useState({
    commodity: '',
    state: '',
    market: '',
    days_ahead: '15',
  });
  const [commodities, setCommodities] = useState([]);
  const [states, setStates] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(false);
  const [marketsLoading, setMarketsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let active = true;
    setPriceResult(null);
    const loadCommodities = async () => {
      try {
        const available = await priceService.getAvailableCommodities();
        if (!active) return;
        setCommodities(available);
        setFormData((current) => ({
          ...current,
          commodity: available[0]?.commodity || '',
        }));
        if (!available.length) {
          setErrorMessage('No mandi commodities with valid prices are available.');
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error.response?.data?.detail ||
              'Could not load commodities from mandi price data.'
          );
        }
      } finally {
        if (active) setMetadataLoading(false);
      }
    };
    loadCommodities();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!formData.commodity) {
      setStates([]);
      setFormData((current) => ({ ...current, state: '', market: '' }));
      return undefined;
    }

    let active = true;
    const loadStates = async () => {
      setStatesLoading(true);
      try {
        const available = await priceService.getAvailableStates(formData.commodity);
        if (!active) return;
        setStates(available);
        setFormData((current) => ({
          ...current,
          state: available.some((item) => item.state === current.state)
            ? current.state
            : available[0]?.state || '',
          market: '',
        }));
      } catch (error) {
        if (!active) return;
        setStates([]);
        setFormData((current) => ({ ...current, state: '', market: '' }));
        setErrorMessage(
          error.response?.data?.detail ||
            `Could not load states for ${formData.commodity}.`
        );
      } finally {
        if (active) setStatesLoading(false);
      }
    };
    loadStates();
    return () => {
      active = false;
    };
  }, [formData.commodity]);

  useEffect(() => {
    if (!formData.commodity || !formData.state) {
      setMarkets([]);
      return undefined;
    }

    let active = true;
    const loadMarkets = async () => {
      setMarketsLoading(true);
      try {
        const available = await priceService.getAvailableMarkets(
          formData.commodity,
          formData.state
        );
        if (!active) return;
        setMarkets(available);
        setFormData((current) => ({
          ...current,
          market: available.some((item) => item.market === current.market)
            ? current.market
            : '',
        }));
      } catch (error) {
        if (!active) return;
        setMarkets([]);
        setFormData((current) => ({ ...current, market: '' }));
        setErrorMessage(
          error.response?.data?.detail ||
            `Could not load markets for ${formData.commodity} in ${formData.state}.`
        );
      } finally {
        if (active) setMarketsLoading(false);
      }
    };
    loadMarkets();
    return () => {
      active = false;
    };
  }, [formData.commodity, formData.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === 'commodity' || name === 'state' ? { market: '' } : {}),
    }));
    setPriceResult(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await priceService.forecastPrice({
        commodity: formData.commodity,
        state: formData.state,
        market: formData.market || null,
        days_ahead: Number(formData.days_ahead),
      });
      setPriceResult(result);
    } catch (error) {
      setPriceResult(null);
      const detail = error.response?.data?.detail;
      setErrorMessage(
        (Array.isArray(detail) ? detail.map((item) => item.msg).join(', ') : detail) ||
          error.message ||
          'Could not generate a mandi price projection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPriceResult(null);
    setErrorMessage(null);
  };

  const currentPrice = priceResult?.current_price;
  const forecastedPrice = priceResult?.forecasted_price;
  const isBullish = priceResult?.trend === 'upward';
  const isBearish = priceResult?.trend === 'downward';
  const trendLabel = isBullish
    ? 'Upward trend'
    : isBearish
      ? 'Downward trend'
      : 'Relatively stable';
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-sage-100 border border-sage-300 text-agri-800 rounded-xl mb-2">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-earth-dark tracking-tight">
          APMC Mandi Price Forecasting
        </h1>
        <p className="text-xs sm:text-sm text-earth-muted max-w-xl mx-auto leading-relaxed">
          Project mandi modal prices from observed AGMARKNET history. Forecasts are
          trend estimates, not guaranteed prices or selling advice.
        </p>
      </div>

      <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {metadataLoading ? (
        <Loading message="Loading commodities with mandi price history..." />
      ) : priceResult ? (
        <PredictionCard
          title={`${priceResult.commodity} Price Projection (${priceResult.state})`}
          subtitle={`${priceResult.days_ahead}-day projection after ${priceResult.last_observed_date} at ${priceResult.market}`}
          badgeText={trendLabel}
          onReset={handleReset}
          resetLabel="Forecast Another Market"
        >
          <div className="space-y-6">
            {priceResult.warning && (
              <div
                role="status"
                className="rounded-lg border-2 border-red-500 bg-red-50 px-4 py-4 text-sm text-red-950"
              >
                <p className="font-bold uppercase tracking-wide">
                  Stale mandi data — do not treat this as a current market outlook
                </p>
                <p className="mt-1">{priceResult.warning}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-cream-50 border border-cream-300 rounded-xl">
                <span className="text-xs font-semibold text-earth-muted uppercase tracking-wider">
                  Latest Observed Modal Rate
                </span>
                <div className="font-serif text-2xl font-bold text-earth-dark mt-0.5">
                  {formatCurrency(currentPrice)}/q
                </div>
                <p className="text-[11px] text-earth-muted">Per Quintal (100 kg)</p>
              </div>

              <div className="p-4 bg-agri-50 border border-agri-200 rounded-xl">
                <span className="text-xs font-semibold text-agri-800 uppercase tracking-wider">
                  Projected Rate
                </span>
                <div className="font-serif text-2xl font-bold text-agri-900 mt-0.5">
                  {formatCurrency(forecastedPrice)}/q
                </div>
                <div className="flex items-center space-x-1 text-xs font-semibold mt-1">
                  {isBullish ? (
                    <TrendingUp className="w-3.5 h-3.5 text-agri-600" />
                  ) : isBearish ? (
                    <TrendingDown className="w-3.5 h-3.5 text-terracotta-600" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-earth-muted" />
                  )}
                  <span>{priceResult.change_percent.toFixed(1)}% over horizon</span>
                </div>
              </div>

              <div className="p-4 bg-cream-200/70 border border-cream-300 rounded-xl">
                <span className="text-xs font-semibold text-earth-charcoal uppercase tracking-wider">
                  Data & Model
                </span>
                <p className="font-serif text-sm font-bold text-earth-dark mt-1">
                  {priceResult.observations_used} observed dates
                </p>
                <p className="text-[11px] text-earth-muted mt-1">
                  {priceResult.model}
                </p>
                <p className="text-[11px] text-earth-muted mt-1">
                  Source: {priceResult.source || 'Mandi records'}
                </p>
                <p className="text-[11px] text-earth-muted mt-1">
                  Price observation date: {priceResult.last_observed_date}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-cream-300 rounded-xl shadow-card">
              <h4 className="font-serif text-sm font-bold text-earth-dark mb-3 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-agri-600" />
                <span>Observed price and projected trend (₹/Quintal)</span>
              </h4>
              <PriceChart forecastData={priceResult.chart_data} />
              <p className="text-[11px] text-earth-muted mt-3">
                Dashed lines show an indicative range based on historical trend-fit
                error; they are not a formal confidence interval.
              </p>
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
                <label
                  htmlFor="forecast-commodity"
                  className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase"
                >
                  Commodity Crop
                </label>
                <select
                  id="forecast-commodity"
                  name="commodity"
                  value={formData.commodity}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  {commodities.map((item) => (
                    <option key={item.commodity} value={item.commodity}>
                      {item.commodity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="forecast-state"
                  className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase"
                >
                  State
                </label>
                <select
                  id="forecast-state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  disabled={statesLoading || !states.length}
                  className={inputClass}
                >
                  {states.map((item) => (
                    <option key={item.state} value={item.state}>
                      {item.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="forecast-market"
                  className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase"
                >
                  Mandi / Local Market
                </label>
                <select
                  id="forecast-market"
                  name="market"
                  value={formData.market}
                  onChange={handleChange}
                  disabled={marketsLoading || !markets.length}
                  className={inputClass}
                >
                  <option value="">All matching markets (daily median)</option>
                  {markets.map((item) => (
                    <option key={item.market} value={item.market}>
                      {item.market}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="forecast-days"
                  className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase"
                >
                  Forecast Duration
                </label>
                <select
                  id="forecast-days"
                  name="days_ahead"
                  value={formData.days_ahead}
                  onChange={handleChange}
                  className={inputClass}
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
                disabled={
                  isLoading ||
                  statesLoading ||
                  marketsLoading ||
                  !formData.commodity ||
                  !formData.state
                }
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

import React, { useEffect, useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import costService from '../../services/costService';
import usePrediction from '../../hooks/usePrediction';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import CostResult from './CostResult';
import useLanguage from '../../hooks/useLanguage';

export const CostEstimation = ({ initialCrop = null }) => {
  const { costResult, setCostResult } = usePrediction();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    crop: '',
    state: '',
    market: '',
    land_size_acres: '2.5',
    seed_rate_kg_per_acre: '',
    seed_price_inr_per_kg: '',
    n_rate_kg_per_acre: '',
    p_rate_kg_per_acre: '',
    k_rate_kg_per_acre: '',
    fertilizer_price_inr_per_kg: '',
    water_requirement_mm: '',
    water_rate_inr_per_mm_per_acre: '',
    water_efficiency_factor: '1',
    labor_days_per_acre: '',
    wage_inr_per_day: '',
    expected_yield_kg_per_acre: '',
    market_price_inr_per_kg: '',
    machinery_cost_inr_per_acre: '0',
    other_input_cost_inr_per_acre: '0',
  });

  const [mandiPrice, setMandiPrice] = useState(null);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [availableCommodities, setAvailableCommodities] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableMarkets, setAvailableMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loadCommodities = async () => {
      try {
        const commodities = await costService.getAvailableCommodities();
        setAvailableCommodities(commodities);
        const preferredCrop = initialCrop && commodities.some(
          (item) => item.commodity === initialCrop
        )
          ? initialCrop
          : commodities[0]?.commodity || '';
        setFormData((current) => ({ ...current, crop: preferredCrop }));
      } catch (err) {
        setErrorMessage(
          err.response?.data?.detail ||
            'costFields.commoditiesError'
        );
      } finally {
        setMetadataLoading(false);
      }
    };

    loadCommodities();
  }, [initialCrop]);

  useEffect(() => {
    if (!formData.crop) return;

    const loadStates = async () => {
      try {
        const states = await costService.getAvailableStates(formData.crop);
        setAvailableStates(states);
        setFormData((current) => ({
          ...current,
          state: states.some((item) => item.state === current.state)
            ? current.state
            : states[0]?.state || '',
          market: '',
        }));
      } catch (err) {
        setAvailableStates([]);
        setErrorMessage(
          err.response?.data?.detail ||
            { key: 'costFields.statesError', params: { crop: formData.crop } }
        );
      }
    };

    loadStates();
  }, [formData.crop]);

  useEffect(() => {
    if (!formData.crop || !formData.state) return;

    const loadMarkets = async () => {
      try {
        const markets = await costService.getAvailableMarkets(
          formData.crop,
          formData.state
        );
        setAvailableMarkets(markets);
      } catch {
        setAvailableMarkets([]);
      }
    };

    loadMarkets();
  }, [formData.crop, formData.state]);

  useEffect(() => {
    if (!formData.state) return;

    const loadCommoditiesForState = async () => {
      try {
        const commodities = await costService.getAvailableCommodities(formData.state);
        setAvailableCommodities(commodities);
        setFormData((current) => ({
          ...current,
          crop: commodities.some((item) => item.commodity === current.crop)
            ? current.crop
            : commodities[0]?.commodity || '',
          market: '',
        }));
      } catch (err) {
        setAvailableCommodities([]);
        setErrorMessage(
          err.response?.data?.detail ||
            { key: 'costFields.stateCommoditiesError', params: { state: formData.state } }
        );
      }
    };

    loadCommoditiesForState();
  }, [formData.state]);

  useEffect(() => {
    const fetchMandiPrice = async () => {
      setMandiLoading(true);
      setErrorMessage(null);

      try {
        if (!formData.crop || !formData.state) return;

        const data = await costService.getLatestMandiPrice(
          formData.crop,
          formData.state,
          formData.market || null
        );

        setMandiPrice(data);

        setFormData((current) => ({
          ...current,
          market_price_inr_per_kg:
            data?.modal_price_inr_per_kg != null
              ? String(data.modal_price_inr_per_kg)
              : '',
        }));
      } catch (err) {
        setMandiPrice(null);
        setFormData((current) => ({
          ...current,
          market_price_inr_per_kg: '',
        }));
        setErrorMessage(
          err.response?.status === 404
            ? { key: 'costFields.priceError', params: { crop: formData.crop, state: formData.state } }
            : err.response?.data?.detail ||
                { key: 'costFields.priceError', params: { crop: formData.crop, state: formData.state } }
        );
      } finally {
        setMandiLoading(false);
      }
    };

    fetchMandiPrice();
  }, [formData.crop, formData.state, formData.market]);

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
        crop: formData.crop,
        land_size_acres: parseFloat(formData.land_size_acres),

        seed_rate_kg_per_acre: parseFloat(formData.seed_rate_kg_per_acre),
        seed_price_inr_per_kg: parseFloat(formData.seed_price_inr_per_kg),

        n_rate_kg_per_acre: parseFloat(formData.n_rate_kg_per_acre),
        p_rate_kg_per_acre: parseFloat(formData.p_rate_kg_per_acre),
        k_rate_kg_per_acre: parseFloat(formData.k_rate_kg_per_acre),

        fertilizer_price_inr_per_kg: parseFloat(
          formData.fertilizer_price_inr_per_kg
        ),

        water_requirement_mm: parseFloat(formData.water_requirement_mm),
        water_rate_inr_per_mm_per_acre: parseFloat(
          formData.water_rate_inr_per_mm_per_acre
        ),
        water_efficiency_factor: parseFloat(
          formData.water_efficiency_factor
        ),

        labor_days_per_acre: parseFloat(formData.labor_days_per_acre),
        wage_inr_per_day: parseFloat(formData.wage_inr_per_day),

        expected_yield_kg_per_acre: parseFloat(
          formData.expected_yield_kg_per_acre
        ),

        market_price_inr_per_kg: parseFloat(
          formData.market_price_inr_per_kg
        ),

        machinery_cost_inr_per_acre: parseFloat(
          formData.machinery_cost_inr_per_acre
        ) || 0,

        other_input_cost_inr_per_acre: parseFloat(
          formData.other_input_cost_inr_per_acre
        ) || 0,
      };

      const result = await costService.estimateCost(payload);
      setCostResult(result);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'costFields.estimateError';

      setErrorMessage(
        Array.isArray(msg)
          ? msg.map((item) => item.msg).join(', ')
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCostResult(null);
    setErrorMessage(null);
  };

  const inputClass =
    'w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition';
  const commodityLabel = (commodity) => {
    const key = `cropResults.cropNames.${commodity.toLowerCase()}`;
    const translated = t(key);
    return translated === key ? commodity : translated;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-cream-200 border border-cream-300 text-agri-800 rounded-xl mb-2">
          <Calculator className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-earth-dark tracking-tight">
          {t('cost.title')}
        </h1>

        <p className="text-xs sm:text-sm text-earth-muted max-w-xl mx-auto leading-relaxed">
          {t('cost.subtitle')}
        </p>
      </div>

      <ErrorMessage
        message={errorMessage}
        onDismiss={() => setErrorMessage(null)}
      />

      {costResult ? (
        <CostResult result={costResult} onReset={handleReset} />
      ) : metadataLoading ? (
        <Loading message="costFields.metadataLoading" />
      ) : (
        <div className="bg-white rounded-xl shadow-card border border-cream-300 p-6 sm:p-8">
          <form
            onSubmit={handleSubmit}
            onInvalidCapture={(event) => event.target.setCustomValidity(t('common.required'))}
            onInputCapture={(event) => event.target.setCustomValidity('')}
            className="space-y-7"
          >

            <div className="border-b border-cream-200 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                1. {t('cost.generalDetails')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('cost.crop')}
                </label>

                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  disabled={!availableCommodities.length}
                  className={inputClass}
                >
                  {!availableCommodities.length && (
                    <option value="">{t('costFields.noCommodities')}</option>
                  )}
                  {availableCommodities.map((item) => (
                    <option key={item.commodity} value={item.commodity}>
                      {commodityLabel(item.commodity)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('cost.state')}
                </label>

                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!availableStates.length}
                  className={inputClass}
                >
                  {!availableStates.length && (
                    <option value="">{t('costFields.noStates')}</option>
                  )}
                  {availableStates.map((item) => (
                    <option key={item.state} value={item.state}>
                      {item.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('cost.market')}
                </label>
                <select
                  name="market"
                  value={formData.market}
                  onChange={handleChange}
                  disabled={!availableMarkets.length}
                  className={inputClass}
                >
                  <option value="">{t('costFields.allMarkets')}</option>
                  {availableMarkets.map((item) => (
                    <option key={item.market} value={item.market}>
                      {item.market}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('cost.landArea')}
                </label>

                <input
                  type="number"
                  name="land_size_acres"
                  value={formData.land_size_acres}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="border-b border-cream-200 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                {t('costFields.seedSection')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.seedRate')}
                </label>
                <input
                  type="number"
                  name="seed_rate_kg_per_acre"
                  value={formData.seed_rate_kg_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.seedPrice')}
                </label>
                <input
                  type="number"
                  name="seed_price_inr_per_kg"
                  value={formData.seed_price_inr_per_kg}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.nitrogen')}
                </label>
                <input
                  type="number"
                  name="n_rate_kg_per_acre"
                  value={formData.n_rate_kg_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.phosphorus')}
                </label>
                <input
                  type="number"
                  name="p_rate_kg_per_acre"
                  value={formData.p_rate_kg_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.potassium')}
                </label>
                <input
                  type="number"
                  name="k_rate_kg_per_acre"
                  value={formData.k_rate_kg_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.fertilizerPrice')}
                </label>
                <input
                  type="number"
                  name="fertilizer_price_inr_per_kg"
                  value={formData.fertilizer_price_inr_per_kg}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="border-b border-cream-200 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                {t('costFields.waterSection')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.waterRequirement')}
                </label>
                <input
                  type="number"
                  name="water_requirement_mm"
                  value={formData.water_requirement_mm}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.waterRate')}
                </label>
                <input
                  type="number"
                  name="water_rate_inr_per_mm_per_acre"
                  value={formData.water_rate_inr_per_mm_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.efficiency')}
                </label>
                <input
                  type="number"
                  name="water_efficiency_factor"
                  value={formData.water_efficiency_factor}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.laborDays')}
                </label>
                <input
                  type="number"
                  name="labor_days_per_acre"
                  value={formData.labor_days_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.wage')}
                </label>
                <input
                  type="number"
                  name="wage_inr_per_day"
                  value={formData.wage_inr_per_day}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="border-b border-cream-200 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                {t('costFields.yieldSection')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.expectedYield')}
                </label>
                <input
                  type="number"
                  name="expected_yield_kg_per_acre"
                  value={formData.expected_yield_kg_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.currentPrice')}
                </label>

                <input
                  type="number"
                  name="market_price_inr_per_kg"
                  value={formData.market_price_inr_per_kg}
                  readOnly
                  className={`${inputClass} bg-cream-100`}
                />

                {mandiLoading && (
                  <p className="text-[11px] text-earth-muted mt-1">
                    {t('costFields.fetchingPrice')}
                  </p>
                )}

                {mandiPrice && (
                  <p className="text-[11px] text-agri-700 mt-1">
                    {mandiPrice.market} • {mandiPrice.date} •{' '}
                    {mandiPrice.source}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.machinery')}
                </label>
                <input
                  type="number"
                  name="machinery_cost_inr_per_acre"
                  value={formData.machinery_cost_inr_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 uppercase">
                  {t('costFields.otherInputs')}
                </label>
                <input
                  type="number"
                  name="other_input_cost_inr_per_acre"
                  value={formData.other_input_cost_inr_per_acre}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || mandiLoading || !formData.market_price_inr_per_kg}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-agri-600 hover:bg-agri-700 text-cream-50 font-semibold rounded-lg shadow-card hover:shadow-card-hover transition disabled:opacity-50"
              >
                {isLoading ? (
                  <Loading message="costFields.calculating" size="small" />
                ) : (
                  <>
                    <span>{t('costFields.calculate')}</span>
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

export default CostEstimation;
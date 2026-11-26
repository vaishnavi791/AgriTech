import React, { useState } from 'react';
import { Sprout, ArrowRight } from 'lucide-react';
import cropService from '../../services/cropService';
import usePrediction from '../../hooks/usePrediction';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import CropResult from './CropResult';
import { SOIL_TYPES, SEASONS, UP_DISTRICTS } from '../../utils/constants';
import soilService from '../../services/soilService';
import apyService from '../../services/apyService';
import useLanguage from '../../hooks/useLanguage';
import { getUserFriendlyError } from '../../utils/errorHandling';

export const CropRecommendation = () => {
  const { cropResult, setCropResult } = usePrediction();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    nitrogen: '90',
    phosphorus: '42',
    potassium: '43',
    temperature: '25.5',
    humidity: '75',
    ph: '6.5',
    rainfall: '200',
    soil_type: SOIL_TYPES[0],
  });

  const [district, setDistrict] = useState('');
  const [season, setSeason] = useState(SEASONS[0]);
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

    let soilData = null;

    // Fetch representative soil values using selected UP district
    if (district) {
      try {
        soilData = await soilService.getModelInputsByDistrict({
          state: 'Uttar Pradesh',
          district,
        });

        // Update displayed soil values with district data
        setFormData((prev) => ({
          ...prev,
          nitrogen: String(soilData.N ?? prev.nitrogen),
          phosphorus: String(soilData.P ?? prev.phosphorus),
          potassium: String(soilData.K ?? prev.potassium),
          ph: soilData.ph != null
              ? Number(soilData.ph).toFixed(1)
              : prev.ph,
        }));
      } catch {
        // Continue with manually entered soil values as fallback
      }
    }

    const payload = {
      N: soilData?.N ?? parseFloat(formData.nitrogen),
      P: soilData?.P ?? parseFloat(formData.phosphorus),
      K: soilData?.K ?? parseFloat(formData.potassium),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: soilData?.ph ?? parseFloat(formData.ph),
      rainfall: parseFloat(formData.rainfall),
    };

    // Fetch APY historical crop candidates
    let apyCandidates = [];

    if (district && season) {
      try {
        const apyResp = await apyService.getCandidates({
          district,
          season,
        });

        apyCandidates = apyResp?.candidates ?? [];
      } catch {
        // Historical candidates are optional; continue with the model recommendation.
      }
    }

    try {
      const result = await cropService.getRecommendation(payload);

      const enrichedResult = {
        ...result,
        apyCandidates,
        district,
        season,
      };

      setCropResult(enrichedResult);
    } catch (err) {
      setErrorMessage(getUserFriendlyError(err, 'uiErrors.cropPrediction'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCropResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-agri-50 border border-agri-200 text-agri-700 rounded-xl mb-2">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-earth-dark tracking-tight">
          {t('modules.cropTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-earth-muted max-w-xl mx-auto leading-relaxed">
          {t('modules.cropSubtitle')}
        </p>
      </div>

      <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {/* Result Display or Input Form */}
      {cropResult ? (
        <CropResult result={cropResult} onReset={handleReset} />
      ) : (
        <div className="bg-white rounded-xl shadow-card border border-cream-300 p-6 sm:p-8">
          <form
            onSubmit={handleSubmit}
            onInvalidCapture={(event) => event.target.setCustomValidity(t('common.required'))}
            onInputCapture={(event) => event.target.setCustomValidity('')}
            className="space-y-6"
          >
            <div className="border-b border-cream-200 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                {t('cropFields.soilSection')}
              </h3>
              <p className="text-xs text-earth-muted mt-0.5">{t('cropFields.soilHelp')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  {t('cropFields.nitrogen')}
                </label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  step="any"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  {t('cropFields.phosphorus')}
                </label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  step="any"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  {t('cropFields.potassium')}
                </label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleChange}
                  min="0"
                  max="300"
                  step="any"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  {t('cropFields.ph')}
                </label>
                <input
                  type="number"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>
              {/* District and Season Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                    {t('cropFields.district')}
                  </label>
                  <select
                    name="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                  >
                    <option value="" disabled>{t('cropFields.selectDistrict')}</option>
                    {UP_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                    {t('cropFields.season')}
                  </label>
                  <select
                    name="season"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                  >
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>{t(s)}</option>
                    ))}
                  </select>
                </div>
              </div>



              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  {t('cropFields.soilType')}
                </label>
                <select
                  name="soil_type"
                  value={formData.soil_type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                >
                  {SOIL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(type)}
                    </option>
                  ))}
                </select>
              </div>
    </div>

            <div className="border-b border-cream-200 pt-3 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                {t('cropFields.weatherSection')}
              </h3>
              <p className="text-xs text-earth-muted mt-0.5">{t('cropFields.weatherHelp')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  {t('cropFields.temperature')}
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  step="0.1"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  {t('cropFields.humidity')}
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="any"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  {t('cropFields.rainfall')}
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-agri-600 hover:bg-agri-700 text-cream-50 font-semibold rounded-lg shadow-card hover:shadow-card-hover transition disabled:opacity-50"
              >
                {isLoading ? (
                  <Loading message="cropFields.loading" size="small" />
                ) : (
                  <>
                    <span>{t('cropFields.generate')}</span>
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

export default CropRecommendation;

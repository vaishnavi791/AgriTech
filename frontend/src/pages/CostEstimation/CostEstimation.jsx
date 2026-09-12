import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import costService from '../../services/costService';
import usePrediction from '../../hooks/usePrediction';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import CostResult from './CostResult';
import { COMMODITIES_LIST } from '../../utils/constants';

export const CostEstimation = () => {
  const { costResult, setCostResult } = usePrediction();

  const [formData, setFormData] = useState({
    crop_type: COMMODITIES_LIST[0],
    land_area: '2.5',
    seed_cost: '5000',
    fertilizer_cost: '12000',
    labor_cost: '10000',
    machinery_cost: '8000',
    irrigation_cost: '4000',
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
        crop_type: formData.crop_type,
        land_area: parseFloat(formData.land_area),
        seed_cost: parseFloat(formData.seed_cost) || 0,
        fertilizer_cost: parseFloat(formData.fertilizer_cost) || 0,
        labor_cost: parseFloat(formData.labor_cost) || 0,
        machinery_cost: parseFloat(formData.machinery_cost) || 0,
        irrigation_cost: parseFloat(formData.irrigation_cost) || 0,
      };

      const result = await costService.estimateCost(payload);
      setCostResult(result);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to calculate cost estimation. Please check backend status.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCostResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-cream-200 border border-cream-300 text-agri-800 rounded-xl mb-2">
          <Calculator className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-earth-dark tracking-tight">
          Cultivation Cost & Profit Estimator
        </h1>
        <p className="text-xs sm:text-sm text-earth-muted max-w-xl mx-auto leading-relaxed">
          Project operational input expenses, machinery allocations, and estimated net profit margins based on your farm acreage.
        </p>
      </div>

      <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {/* Result Display or Input Form */}
      {costResult ? (
        <CostResult result={costResult} onReset={handleReset} />
      ) : (
        <div className="bg-white rounded-xl shadow-card border border-cream-300 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-cream-200 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                1. General Farm Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Crop Cultivated
                </label>
                <select
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                >
                  {COMMODITIES_LIST.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Total Land Area (in Acres)
                </label>
                <input
                  type="number"
                  name="land_area"
                  value={formData.land_area}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>
            </div>

            <div className="border-b border-cream-200 pt-3 pb-3.5">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-agri-800">
                2. Input Expense Projections (₹ INR)
              </h3>
              <p className="text-xs text-earth-muted mt-0.5">Enter estimated expenditures for the full crop duration.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Seed & Sapling Cost (₹)
                </label>
                <input
                  type="number"
                  name="seed_cost"
                  value={formData.seed_cost}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Fertilizer & Nutrition (₹)
                </label>
                <input
                  type="number"
                  name="fertilizer_cost"
                  value={formData.fertilizer_cost}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Labor & Weeding (₹)
                </label>
                <input
                  type="number"
                  name="labor_cost"
                  value={formData.labor_cost}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Machinery & Fuel (₹)
                </label>
                <input
                  type="number"
                  name="machinery_cost"
                  value={formData.machinery_cost}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg text-earth-dark focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-dark mb-1 tracking-wider uppercase">
                  Irrigation & Power (₹)
                </label>
                <input
                  type="number"
                  name="irrigation_cost"
                  value={formData.irrigation_cost}
                  onChange={handleChange}
                  min="0"
                  step="100"
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
                  <Loading message="Calculating budget & margins..." size="small" />
                ) : (
                  <>
                    <span>Calculate Budget & ROI</span>
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

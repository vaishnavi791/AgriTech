import React from 'react';
import { 
  Sprout, 
  Droplets, 
  Compass, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import PredictionCard from '../../components/PredictionCard';

export const CropResult = ({ result, onReset }) => {
  if (!result) return null;

  const cropName = result.crop || result.recommended_crop || result.prediction || 'Recommended Crop';
  const confidence = result.confidence || result.probability || 0.94;
  const description = result.description || `Optimal soil and environmental parameters match high-yield cultivation of ${cropName}.`;
  const seasonalAdvice = result.season || result.season_advice || 'Kharif / Rabi optimal sowing season';
  const waterReq = result.water_requirement || result.irrigation || 'Moderate (450 - 650 mm)';
  const soilSuitability = result.soil_suitability || 'Well-drained loamy or clayey soil with balanced N-P-K';

  return (
    <PredictionCard
      title="Crop Recommendation Result"
      subtitle="Evaluated using multi-variable environmental & soil profile analysis"
      confidence={confidence}
      badgeText="Best Match"
      onReset={onReset}
      resetLabel="Recommend Another Crop"
    >
      <div className="space-y-6">
        {/* Main Crop Hero */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-agri-50 border border-agri-200 rounded-xl">
          <div className="p-3.5 bg-agri-600 text-cream-50 rounded-xl shadow-card">
            <Sprout className="w-9 h-9" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-agri-800">Top Recommended Crop</span>
            <h2 className="font-serif text-3xl font-bold text-earth-dark capitalize">{cropName}</h2>
            <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-cream-300 rounded-xl shadow-card">
            <div className="flex items-center space-x-2 text-agri-700 text-xs font-semibold mb-1">
              <Compass className="w-4 h-4 text-agri-600" />
              <span>Recommended Season</span>
            </div>
            <p className="text-sm font-bold text-earth-dark">{seasonalAdvice}</p>
          </div>

          <div className="p-4 bg-white border border-cream-300 rounded-xl shadow-card">
            <div className="flex items-center space-x-2 text-agri-700 text-xs font-semibold mb-1">
              <Droplets className="w-4 h-4 text-agri-600" />
              <span>Water Requirement</span>
            </div>
            <p className="text-sm font-bold text-earth-dark">{waterReq}</p>
          </div>

          <div className="p-4 bg-white border border-cream-300 rounded-xl shadow-card">
            <div className="flex items-center space-x-2 text-agri-700 text-xs font-semibold mb-1">
              <Layers className="w-4 h-4 text-agri-600" />
              <span>Soil Condition</span>
            </div>
            <p className="text-sm font-bold text-earth-dark">{soilSuitability}</p>
          </div>
        </div>

        {/* Agronomic Recommendations */}
        <div className="bg-cream-200/50 border border-cream-300 rounded-xl p-5 space-y-3">
          <h4 className="font-serif text-sm font-bold text-earth-dark flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-agri-600" />
            <span>Recommended Cultivation Practices</span>
          </h4>
          <ul className="text-xs sm:text-sm text-earth-muted space-y-2 list-disc list-inside leading-relaxed">
            <li>Ensure proper drainage to prevent waterlogging during seedling germination.</li>
            <li>Maintain regular basal fertilizer application in accordance with the measured N-P-K levels.</li>
            <li>Monitor weekly for common regional pests during active flowering.</li>
          </ul>
        </div>
      </div>
    </PredictionCard>
  );
};

export default CropResult;

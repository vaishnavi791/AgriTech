import React from 'react';
import { 
  Sprout, 
  Droplets, 
  Compass, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import PredictionCard from '../../components/PredictionCard';
import useLanguage from '../../hooks/useLanguage';

export const CropResult = ({ result, onReset }) => {
  const { t } = useLanguage();
  if (!result) return null;

  const cropName = result.crop || result.recommended_crop || result.prediction || t('cropResults.defaultCrop');
  const confidence = result.confidence || result.probability || 0.94;
  const description = result.description || t('cropResults.defaultDescription').replace('{crop}', t(cropName));
  const seasonalAdvice = result.season || result.season_advice || t('cropResults.defaultSeason');
  const waterReq = result.water_requirement || result.irrigation || t('cropResults.defaultWater');
  const soilSuitability = result.soil_suitability || t('cropResults.defaultSoil');

  return (
    <PredictionCard
      title={t('cropResults.title')}
      subtitle={t('cropResults.subtitle')}
      confidence={confidence}
      badgeText={t('cropResults.bestMatch')}
      onReset={onReset}
      resetLabel={t('cropResults.reset')}
    >
      <div className="space-y-6">
        {/* Main Crop Hero */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-agri-50 border border-agri-200 rounded-xl">
          <div className="p-3.5 bg-agri-600 text-cream-50 rounded-xl shadow-card">
            <Sprout className="w-9 h-9" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-agri-800">{t('cropResults.recommended')}</span>
            <h2 className="font-serif text-3xl font-bold text-earth-dark capitalize">{t(cropName.toLowerCase())}</h2>
            <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-cream-300 rounded-xl shadow-card">
            <div className="flex items-center space-x-2 text-agri-700 text-xs font-semibold mb-1">
              <Compass className="w-4 h-4 text-agri-600" />
              <span>{t('cropResults.season')}</span>
            </div>
            <p className="text-sm font-bold text-earth-dark">{t(seasonalAdvice)}</p>
          </div>

          <div className="p-4 bg-white border border-cream-300 rounded-xl shadow-card">
            <div className="flex items-center space-x-2 text-agri-700 text-xs font-semibold mb-1">
              <Droplets className="w-4 h-4 text-agri-600" />
              <span>{t('cropResults.water')}</span>
            </div>
            <p className="text-sm font-bold text-earth-dark">{typeof waterReq === 'string' ? t(waterReq) : waterReq}</p>
          </div>

          <div className="p-4 bg-white border border-cream-300 rounded-xl shadow-card">
            <div className="flex items-center space-x-2 text-agri-700 text-xs font-semibold mb-1">
              <Layers className="w-4 h-4 text-agri-600" />
              <span>{t('cropResults.soil')}</span>
            </div>
            <p className="text-sm font-bold text-earth-dark">{typeof soilSuitability === 'string' ? t(soilSuitability) : soilSuitability}</p>
          </div>
        </div>

        {/* Agronomic Recommendations */}
        <div className="bg-cream-200/50 border border-cream-300 rounded-xl p-5 space-y-3">
          <h4 className="font-serif text-sm font-bold text-earth-dark flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-agri-600" />
            <span>{t('cropResults.practices')}</span>
          </h4>
          <ul className="text-xs sm:text-sm text-earth-muted space-y-2 list-disc list-inside leading-relaxed">
            <li>{t('cropResults.practiceDrainage')}</li>
            <li>{t('cropResults.practiceFertilizer')}</li>
            <li>{t('cropResults.practicePests')}</li>
          </ul>
          {/* APY Historical Evidence */}
          {result.apyCandidates && result.apyCandidates.length > 0 && (
            <div className="mt-6">
              <h4 className="font-serif text-sm font-bold text-earth-dark flex items-center space-x-2 mb-2">
                {t('cropResults.apyTitle')}
              </h4>
              <ul className="list-disc list-inside text-xs text-earth-muted space-y-1">
                {result.apyCandidates.map((c, idx) => (
                  <li key={idx}>
                    <strong>{t(c.crop_name.toLowerCase())}</strong> – {t('cropResults.avgYield')}: {c.average_yield} ({t('cropResults.area')}: {c.average_area} ha, {t('cropResults.production')}: {c.average_production} tons) – {t('cropResults.recentYear')}: {c.most_recent_year} – {t('cropResults.evidenceRank')}: {c.historical_evidence_rank}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </PredictionCard>
  );
};

export default CropResult;

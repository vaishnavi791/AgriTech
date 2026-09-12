import React from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Pill, 
  CheckCircle2 
} from 'lucide-react';
import PredictionCard from '../../components/PredictionCard';

export const DiseaseResult = ({ result, imagePreview, onReset }) => {
  if (!result) return null;

  const diseaseName = result.disease || result.prediction || result.class_name || 'Healthy Leaf';
  const confidence = result.confidence || 0.96;
  const isHealthy = diseaseName.toLowerCase().includes('healthy');
  const symptoms = result.symptoms || [
    'Yellowing or chlorotic spotting across foliar tissue',
    'Irregular necrotic lesions on lower surface',
    'Premature senescence and leaf dropping',
  ];
  const treatments = result.treatment || result.remedies || [
    'Apply copper-based organic fungicide at 7-day intervals',
    'Improve inter-crop air circulation by moderate canopy pruning',
    'Avoid overhead sprinkler irrigation to reduce foliage dampness',
  ];
  const preventionTips = result.prevention || [
    'Use certified disease-resistant hybrid seed varieties',
    'Follow a 3-year crop rotation schedule with non-host crops',
    'Deep summer ploughing to eradicate resting fungal spores',
  ];

  return (
    <PredictionCard
      title="Disease Diagnostics Report"
      subtitle="Computer Vision Leaf Pathology Classification"
      confidence={confidence}
      badgeText={isHealthy ? 'Healthy Specimen' : 'Pathogen Detected'}
      onReset={onReset}
      resetLabel="Analyze Another Image"
    >
      <div className="space-y-6">
        {/* Diagnosis Overview Card */}
        <div className="flex flex-col md:flex-row gap-6 items-start p-5 bg-cream-50 border border-cream-300 rounded-xl">
          {imagePreview && (
            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden border border-cream-300 shadow-card flex-shrink-0 bg-cream-200">
              <img
                src={imagePreview}
                alt="Analyzed leaf specimen"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 space-y-2.5">
            <div className="flex items-center space-x-2">
              {isHealthy ? (
                <ShieldCheck className="w-6 h-6 text-agri-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-harvest-600" />
              )}
              <h2 className="font-serif text-2xl font-bold text-earth-dark capitalize">
                {diseaseName}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
              {result.description ||
                (isHealthy
                  ? 'No visible signs of pathogen damage or viral chlorosis found. Leaf tissue displays vigorous physiological health.'
                  : `Visual pattern exhibits symptoms characteristic of ${diseaseName}. Immediate corrective canopy treatment is advised.`)}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isHealthy ? 'bg-sage-100 text-agri-800 border-sage-200' : 'bg-terracotta-50 text-terracotta-700 border-red-200'
              }`}>
                Status: {isHealthy ? 'No Infection' : 'Active Intervention Required'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cream-200 text-earth-dark border border-cream-300">
                Confidence: {(confidence > 1 ? confidence : confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Symptoms & Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-cream-300 rounded-xl p-5 shadow-card space-y-3">
            <h4 className="font-serif text-sm font-bold text-earth-dark flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-harvest-600" />
              <span>Observable Symptoms</span>
            </h4>
            <ul className="text-xs sm:text-sm text-earth-muted space-y-2 list-disc list-inside leading-relaxed">
              {symptoms.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-cream-300 rounded-xl p-5 shadow-card space-y-3">
            <h4 className="font-serif text-sm font-bold text-earth-dark flex items-center space-x-2">
              <Pill className="w-4 h-4 text-agri-600" />
              <span>Prescribed Remedies & Treatment</span>
            </h4>
            <ul className="text-xs sm:text-sm text-earth-muted space-y-2 list-disc list-inside leading-relaxed">
              {treatments.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preventive Measures */}
        <div className="bg-agri-50/70 border border-agri-200 rounded-xl p-5 space-y-3">
          <h4 className="font-serif text-sm font-bold text-agri-900 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-agri-600" />
            <span>Preventive Agronomic Best Practices</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-earth-charcoal">
            {preventionTips.map((tip, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-agri-100 shadow-card">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PredictionCard>
  );
};

export default DiseaseResult;

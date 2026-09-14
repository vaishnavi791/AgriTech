import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Pill,
  CheckCircle2,
} from 'lucide-react';
import PredictionCard from '../../components/PredictionCard';

/**
 * Formats a raw authoritative class label into a human-readable title.
 * e.g., "Apple___Black_rot" -> "Apple — Black Rot"
 * e.g., "Corn_(maize)___healthy" -> "Corn (Maize) — Healthy"
 */
export const formatDiseaseLabel = (rawLabel) => {
  if (!rawLabel || typeof rawLabel !== 'string') return 'Unknown Specimen';

  const parts = rawLabel.split('___');
  const crop = parts[0]
    .replace(/_/g, ' ')
    .replace(/,\s*/g, ', ')
    .trim();

  const titleCase = (str) =>
    str.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1));

  if (parts.length < 2) {
    return titleCase(crop);
  }

  const condition = parts[1]
    .replace(/_/g, ' ')
    .trim();

  return `${titleCase(crop)} — ${titleCase(condition)}`;
};

export const DiseaseResult = ({ result, imagePreview, onReset }) => {
  if (!result) return null;

  const rawLabel = result.prediction || result.disease || result.class_name || '';
  const hasClassIndex = result.predicted_class_index != null;

  const formattedDiseaseName = rawLabel
    ? formatDiseaseLabel(rawLabel)
    : (hasClassIndex
      ? `Class Index #${result.predicted_class_index}`
      : 'Diagnostic Inconclusive');

  const confidence =
    typeof result.confidence === 'number'
      ? result.confidence
      : 0;

  const isHealthy = rawLabel.toLowerCase().includes('healthy');

  const symptoms = result.symptoms || (isHealthy ? [
    'Uniform green pigmentation across the leaf blade.',
    'Intact cellular structure with no necrotic lesions or chlorosis.',
    'Vigorous foliar development without fungal growth or viral mosaic.',
  ] : [
    'Yellowing or chlorotic spotting across foliar tissue.',
    'Irregular necrotic lesions on lower surface.',
    'Premature senescence and leaf dropping.',
  ]);

  const treatments = result.treatment || result.remedies || (isHealthy ? [
    'Maintain standard irrigation and nutrient management schedules.',
    'Continue routine scouting for early pest or disease pressure.',
    'Ensure balanced N-P-K fertilizer application to sustain plant immunity.',
  ] : [
    'Apply targeted organic fungicide or bio-pesticide suited for the identified condition.',
    'Improve inter-crop air circulation by moderate canopy pruning.',
    'Avoid overhead sprinkler irrigation to minimize prolonged foliar wetness.',
  ]);

  const preventionTips = result.prevention || [
    'Use certified disease-resistant hybrid seed varieties.',
    'Follow a crop rotation schedule with non-host crops to interrupt pathogen life cycles.',
    'Maintain adequate plant spacing and field sanitation to optimize airflow.',
  ];

  const badgeText = isHealthy ? 'Healthy Specimen' : 'Pathogen Detected';

  return (
    <PredictionCard
      title="Disease Diagnostics Report"
      subtitle="Computer Vision Leaf Pathology Classification"
      confidence={confidence}
      badgeText={badgeText}
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

              <h2 className="font-serif text-2xl font-bold text-earth-dark">
                {formattedDiseaseName}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
              {result.message ||
                result.description ||
                (isHealthy
                  ? 'No visible signs of pathogen damage were detected. Foliage displays healthy physiological characteristics.'
                  : `Diagnostic pattern indicates symptoms consistent with ${formattedDiseaseName}. Timely corrective agronomic treatment is advised.`)}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  isHealthy
                    ? 'bg-sage-100 text-agri-800 border-sage-200'
                    : 'bg-terracotta-50 text-terracotta-700 border-red-200'
                }`}
              >
                Status: {isHealthy ? 'No Infection' : 'Active Intervention Required'}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cream-200 text-earth-dark border border-cream-300">
                Confidence:{' '}
                {(confidence > 1 ? confidence : confidence * 100).toFixed(1)}%
              </span>

              {hasClassIndex && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-agri-50 text-agri-800 border border-agri-200">
                  Output Index: #{result.predicted_class_index}
                </span>
              )}

              {rawLabel && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cream-100 text-earth-muted border border-cream-300 font-mono">
                  {rawLabel}
                </span>
              )}
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
              {symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-cream-300 rounded-xl p-5 shadow-card space-y-3">
            <h4 className="font-serif text-sm font-bold text-earth-dark flex items-center space-x-2">
              <Pill className="w-4 h-4 text-agri-600" />
              <span>Prescribed Remedies & Treatment</span>
            </h4>

            <ul className="text-xs sm:text-sm text-earth-muted space-y-2 list-disc list-inside leading-relaxed">
              {treatments.map((treatment, index) => (
                <li key={index}>{treatment}</li>
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
            {preventionTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-lg border border-agri-100 shadow-card"
              >
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
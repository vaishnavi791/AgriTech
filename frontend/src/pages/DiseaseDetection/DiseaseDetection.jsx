import React, { useState, useRef } from 'react';
import { ScanLine, UploadCloud, Image as ImageIcon, X, ArrowRight } from 'lucide-react';
import diseaseService from '../../services/diseaseService';
import usePrediction from '../../hooks/usePrediction';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import DiseaseResult from './DiseaseResult';

export const DiseaseDetection = () => {
  const { diseaseResult, setDiseaseResult } = usePrediction();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB. Please choose a smaller image.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please choose or drag an image of a plant leaf first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await diseaseService.detectDisease(selectedFile);
      setDiseaseResult(result);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to analyze leaf image. Please check backend status.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDiseaseResult(null);
    handleClearFile();
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-harvest-50 border border-harvest-100 text-harvest-600 rounded-xl mb-2">
          <ScanLine className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-earth-dark tracking-tight">
          Plant Disease Diagnosis
        </h1>
        <p className="text-xs sm:text-sm text-earth-muted max-w-xl mx-auto leading-relaxed">
          Upload a high-resolution photo of the infected crop leaf to identify pathogenic infections and receive curative action plans.
        </p>
      </div>

      <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {/* Result Display or Upload Form */}
      {diseaseResult ? (
        <DiseaseResult
          result={diseaseResult}
          imagePreview={previewUrl}
          onReset={handleReset}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-card border border-cream-300 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 ${
                selectedFile
                  ? 'border-sage-400 bg-sage-50/50'
                  : 'border-cream-300 hover:border-agri-500 hover:bg-cream-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="max-h-64 rounded-xl shadow-card mx-auto object-contain border border-cream-300"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearFile();
                      }}
                      className="absolute -top-2 -right-2 p-1.5 bg-terracotta-600 text-cream-50 rounded-full shadow hover:bg-terracotta-700 transition"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-earth-muted">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB) - Click to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto w-14 h-14 bg-cream-100 border border-cream-300 text-agri-700 rounded-full flex items-center justify-center">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-earth-dark">
                      Click to upload or drag & drop leaf image
                    </p>
                    <p className="text-xs text-earth-muted">
                      Supports JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction Callout */}
            <div className="p-4 bg-cream-50 rounded-xl border border-cream-300 flex items-start space-x-3 text-xs text-earth-muted">
              <ImageIcon className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-earth-dark">Tips for best diagnostic results:</span>
                <p className="mt-0.5 leading-relaxed">
                  Capture the leaf in clear daylight with both affected symptoms and unaffected green tissue visible. Avoid blurry or shadowy photos.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!selectedFile || isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-agri-600 hover:bg-agri-700 text-cream-50 font-semibold rounded-lg shadow-card hover:shadow-card-hover transition disabled:opacity-50"
              >
                {isLoading ? (
                  <Loading message="Classifying leaf pathology..." size="small" />
                ) : (
                  <>
                    <span>Diagnose Crop Health</span>
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

export default DiseaseDetection;

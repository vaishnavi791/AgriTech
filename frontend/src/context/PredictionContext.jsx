import React, { createContext, useState, useCallback } from 'react';

export const PredictionContext = createContext(null);

export const PredictionProvider = ({ children }) => {
  const [cropResult, setCropResult] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [costResult, setCostResult] = useState(null);
  const [priceResult, setPriceResult] = useState(null);

  const resetPredictions = useCallback(() => {
    setCropResult(null);
    setDiseaseResult(null);
    setCostResult(null);
    setPriceResult(null);
  }, []);

  const value = {
    cropResult,
    setCropResult,
    diseaseResult,
    setDiseaseResult,
    costResult,
    setCostResult,
    priceResult,
    setPriceResult,
    resetPredictions,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};


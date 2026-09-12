import { useContext } from 'react';
import { PredictionContext } from '../context/PredictionContext';

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};

export default usePrediction;


import { useState, useCallback } from 'react';
import type { JobData } from '../types/job';
import { loadState, saveState, clearState } from '../utils/storage';

const FORM_STATE_KEY = 'jobFormState';

export function useFormState(initialState: JobData) {
  // Load initial state only on page load/refresh
  const [formData, setFormData] = useState<JobData>(() => {
    const savedState = loadState(FORM_STATE_KEY, initialState);
    return savedState || initialState;
  });

  const updateFormData = useCallback((
    update: Partial<JobData> | ((prev: JobData) => JobData)
  ) => {
    setFormData(prev => {
      const newState = typeof update === 'function' ? update(prev) : { ...prev, ...update };
      // Always save state regardless of empty values
      saveState(FORM_STATE_KEY, newState);
      return newState;
    });
  }, []);

  const resetFormData = useCallback(() => {
    clearState(FORM_STATE_KEY);
    setFormData(initialState);
  }, [initialState]);

  return {
    formData,
    updateFormData,
    resetFormData
  };
}

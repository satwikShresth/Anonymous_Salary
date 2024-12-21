import { useState, useCallback } from 'react';
import type { JobData } from '../types/job';
import { defaultJobData } from '../types/job';
import { loadState, saveState, clearState } from '../utils/storage';

const FORM_STATE_KEY = 'jobFormState';

export function useFormState(initialState: JobData = defaultJobData) {
  const [formData, setFormData] = useState<JobData>(() =>
    loadState(FORM_STATE_KEY, initialState)
  );

  const updateFormData = useCallback((
    update: Partial<JobData> | ((prev: JobData) => JobData)
  ) => {
    setFormData(prev => {
      const newState = typeof update === 'function' ? update(prev) : { ...prev, ...update };
      saveState(FORM_STATE_KEY, newState);
      return newState;
    });
  }, []);

  const resetFormData = useCallback(() => {
    clearState(FORM_STATE_KEY);
    setFormData(defaultJobData);
  }, []);

  return {
    formData,
    updateFormData,
    resetFormData
  };
}

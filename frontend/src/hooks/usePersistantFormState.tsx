import { useState, useEffect } from 'react';
import type { JobData } from '../types/job';

const FORM_STATE_KEY = 'jobFormState';

export function usePersistedFormState(initialState: JobData) {
  // Try to load saved state from localStorage
  const loadSavedState = (): JobData => {
    const saved = localStorage.getItem(FORM_STATE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialState;
      }
    }
    return initialState;
  };

  const [formData, setFormData] = useState<JobData>(loadSavedState);

  // Save to localStorage whenever form data changes
  useEffect(() => {
    localStorage.setItem(FORM_STATE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Clear saved state when form is submitted
  const clearSavedState = () => {
    localStorage.removeItem(FORM_STATE_KEY);
  };

  return {
    formData,
    setFormData,
    clearSavedState
  };
}

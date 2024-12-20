import { useState, useEffect } from 'react';
import type { JobData } from '../types/job';
import { useFormValidation } from './useFormValidation';

const STEP_KEY = 'jobFormStep';

export function useFormSteps(totalSteps: number) {
  const loadSavedStep = (): number => {
    const saved = localStorage.getItem(STEP_KEY);
    return saved ? parseInt(saved, 10) : 1;
  };

  const [currentStep, setCurrentStep] = useState(loadSavedStep);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { validateStep } = useFormValidation();

  useEffect(() => {
    localStorage.setItem(STEP_KEY, currentStep.toString());
  }, [currentStep]);

  const clearStepState = () => {
    localStorage.removeItem(STEP_KEY);
  };

  const validateAndProceed = (step: number, data: JobData) => {
    if (step === totalSteps) {
      return true;
    }

    const stepErrors = validateStep(step, data);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const goToStep = (step: number, data: JobData) => {
    if (step < currentStep) {
      setCurrentStep(step);
      setErrors({});
      return true;
    }

    for (let i = currentStep; i < step; i++) {
      if (!validateAndProceed(i, data)) {
        return false;
      }
    }

    setCurrentStep(step);
    return true;
  };

  const goToNextStep = (data: JobData) => {
    if (currentStep < totalSteps && validateAndProceed(currentStep, data)) {
      setCurrentStep(step => step + 1);
      return true;
    }
    return false;
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(step => step - 1);
      setErrors({});
      return true;
    }
    return false;
  };

  return {
    currentStep,
    totalSteps,
    errors,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    clearStepState
  };
}

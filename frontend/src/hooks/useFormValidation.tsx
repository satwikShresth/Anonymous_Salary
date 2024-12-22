import type { JobData } from '../types/job';

export function useFormValidation() {
  const validateCompanySection = (data: JobData) => {
    const errors: Record<string, string> = {};

    if (!data.companyName) {
      errors.companyName = 'Company name is required';
    }

    if (!data.position) {
      errors.position = 'Position is required';
    }

    if (!data.location) {
      errors.location = 'Location is required';
    }

    if (!data.workHours || data.workHours < 20 || data.workHours > 80) {
      errors.workHours = 'Work hours must be between 20 and 80';
    }

    return errors;
  };

  const validateCompensationSection = (data: JobData) => {
    const errors: Record<string, string> = {};

    if (!data.salaryNA && (!data.salary || data.salary <= 0)) {
      errors.salary = 'Please enter a valid salary or mark as N/A';
    }

    data.compensations.forEach((comp, index) => {
      if (!comp.isNotApplicable && (!comp.amount || comp.amount <= 0)) {
        errors[`compensation_${index}`] = 'Please enter a valid amount or mark as N/A';
      }
    });

    return errors;
  };

  const validateProgramSection = (data: JobData) => {
    const errors: Record<string, string> = {};

    if (!data.majors.length) {
      errors.majors = 'At least one major is required';
    }

    if (!data.level) {
      errors.level = 'Level is required';
    }

    if (!data.source) {
      errors.source = 'Source is required';
    }

    if (!data.coopYear) {
      errors.coopYear = 'Co-op year is required';
    }

    if (!data.coopCycle) {
      errors.coopCycle = 'Co-op cycle is required';
    }

    return errors;
  };

  const validateDecisionSection = () => ({});

  const validateStep = (step: number, data: JobData) => {
    switch (step) {
      case 1:
        return validateCompanySection(data);
      case 2:
        return validateCompensationSection(data);
      case 3:
        return validateDecisionSection();
      case 4:
        return validateProgramSection(data);
      default:
        return {};
    }
  };

  return { validateStep };
}

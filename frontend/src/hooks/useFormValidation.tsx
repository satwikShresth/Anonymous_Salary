import { companies } from '../data/companies';
import { locations } from '../data/locations';
import { positions } from '../data/positions';
import type { JobData } from '../types/job';

export function useFormValidation() {
  const validateCompanySection = (data: JobData) => {
    const errors: Record<string, string> = {};

    if (!data.companyName) {
      errors.companyName = 'Company name is required';
    } else if (!companies.includes(data.companyName)) {
      errors.companyName = 'Please select a company from the list';
    }

    if (!data.position) {
      errors.position = 'Position is required';
    } else if (!positions.includes(data.position)) {
      errors.position = 'Please select a position from the list';
    }

    if (!data.location) {
      errors.location = 'Location is required';
    } else if (!locations.includes(data.location)) {
      errors.location = 'Please select a location from the list';
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

  // Decision and Program sections are now optional, so they always validate successfully
  const validateDecisionSection = () => ({});
  const validateProgramSection = () => ({});

  const validateStep = (step: number, data: JobData) => {
    switch (step) {
      case 1:
        return validateCompanySection(data);
      case 2:
        return validateCompensationSection(data);
      case 3:
        return validateDecisionSection();
      case 4:
        return validateProgramSection();
      default:
        return {};
    }
  };

  return { validateStep };
}

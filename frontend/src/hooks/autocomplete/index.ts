import { useData } from './useData';
import { companies } from '../../data/companies';
import { positions } from '../../data/positions';
import { locations } from '../../data/locations';
import { majors } from '../../data/majors';
import { minors } from '../../data/minors';

// Create specific hooks using the generic useData hook
export const useCompanies = () => useData(() => companies, 'Failed to fetch companies');
export const usePositions = () => useData(() => positions, 'Failed to fetch positions');
export const useLocations = () => useData(() => locations, 'Failed to fetch locations');
export const useMajors = () => useData(() => majors, 'Failed to fetch majors');
export const useMinors = () => useData(() => minors, 'Failed to fetch minors');

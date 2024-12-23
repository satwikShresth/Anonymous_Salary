import axios from 'axios';
import { useState, useEffect } from 'react';

const useCallback = (path: string) => {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoopCycles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/${path}`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchCoopCycles();
  }, []);

  return { data, error, loading };
};

export const useCoopCycles = () => useCallback('coop/cycles')
export const useCoopYears = () => useCallback('coop/years')
export const useSource = () => useCallback('source')
export const useProgram = () => useCallback('program')
export const useDecision = () => useCallback('decision')
export const useOffer = () => useCallback('offer')

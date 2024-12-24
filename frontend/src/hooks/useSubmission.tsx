import { useState } from 'react';
import axios from 'axios';

export const useCompanies = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]); // Added options state

  const fetchOptions = async (query: string): Promise<string[]> => {
    setLoading(true);
    try {

      const { data } = await axios.get(
        `http://localhost:3000/submissions/companies?q=${encodeURIComponent(query)}`
      );
      setOptions(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    setData,
    fetchOptions,
    options: options || [], // Include options in the return value
  };
};


export const usePositions = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]); // Added options state

  const fetchOptions = async (query: string): Promise<string[]> => {
    setLoading(true);
    try {

      const { data } = await axios.get(
        `http://localhost:3000/submissions/positions?q=${encodeURIComponent(query)}`
      );
      setOptions(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    setData,
    fetchOptions,
    options: options || [], // Include options in the return value
  };
};

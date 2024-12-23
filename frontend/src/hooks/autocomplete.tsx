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
        `http://localhost:3000/companies?q=${encodeURIComponent(query)}`
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

  const fetchOptions = async (company: string, query: string): Promise<string[]> => {
    setLoading(true);
    try {

      const { data } = await axios.get(
        `http://localhost:3000/positions?c=${encodeURIComponent(company)}&q=${encodeURIComponent(query)}`
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


export const useLocations = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]); // Added options state

  const fetchOptions = async (query: string): Promise<string[]> => {
    setLoading(true);
    try {

      const { data } = await axios.get(
        `http://localhost:3000/locations?q=${encodeURIComponent(query)}`
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
    options: options || [],
  };
};

export const useMajors = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]); // Added options state

  const fetchOptions = async (level: string, query: string): Promise<string[]> => {
    setLoading(true);
    try {

      const { data } = await axios.get(
        `http://localhost:3000/majors?c=${encodeURIComponent(level)}&q=${encodeURIComponent(query)}`
      );
      setOptions(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    setData,
    loading,
    fetchOptions,
    options: options || [], // Include options in the return value
  };
};


export const useMinors = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]); // Added options state

  const fetchOptions = async (level: string, query: string): Promise<string[]> => {
    setLoading(true);
    try {

      const { data } = await axios.get(
        `http://localhost:3000/minors?c=${encodeURIComponent(level)}&q=${encodeURIComponent(query)}`
      );
      setOptions(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    setData,
    loading,
    fetchOptions,
    options: options || [], // Include options in the return value
  };
};

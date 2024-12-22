import { useData } from './useData';
import { majors } from '../../data/majors';
import { minors } from '../../data/minors';
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
      console.log(`http://localhost:3000/positions?c=${encodeURIComponent(company)}&q=${encodeURIComponent(query)}`)
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
      options: options || [], // Include options in the return value
   };
};

export const useMajors = () => {
   const [majorData, setMajorData] = useState<typeof majors>([]);
   return useData(() => majors, 'Failed to fetch majors', {
      initialData: majorData,
      externalSetData: setMajorData
   });
};

export const useMinors = () => {
   const [minorData, setMinorData] = useState<typeof minors>([]);
   return useData(() => minors, 'Failed to fetch minors', {
      initialData: minorData,
      externalSetData: setMinorData
   });
};


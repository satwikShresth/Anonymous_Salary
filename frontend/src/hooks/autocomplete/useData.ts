import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface UseDataOptions<T> {
   initialData?: T[];
   externalSetData?: Dispatch<SetStateAction<T[]>>;
}

export function useData<T>(
   fetchFn: () => Promise<T[]> | T[],
   errorMessage: string = 'Failed to fetch data',
   options: UseDataOptions<T> = {}
) {
   const { initialData = [], externalSetData } = options;

   const [internalData, setInternalData] = useState<T[]>(initialData);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);

   const setData = externalSetData || setInternalData;
   const data = externalSetData ? initialData : internalData;

   useEffect(() => {
      const fetchData = async () => {
         try {
            const result = await fetchFn();
            setData(result);
         } catch (err) {
            setError(err instanceof Error ? err : new Error(errorMessage));
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [fetchFn, errorMessage, setData]);

   return { data, loading, error, setData };
}

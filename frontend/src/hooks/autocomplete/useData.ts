import { useState, useEffect } from 'react';

export function useData<T>(
   fetchFn: () => Promise<T[]> | T[],
   errorMessage: string = 'Failed to fetch data'
) {
   const [data, setData] = useState<T[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);

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
   }, [fetchFn, errorMessage]);

   return { data, loading, error };
}

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { JobData } from '../types/job';
import type { FilterOptions } from '../types/filters';

interface PaginationInfo {
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

interface JobsResponse {
  data: JobData[];
  pagination: PaginationInfo;
}

interface UseJobsResult {
  jobs: JobData[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useJobs(filters: FilterOptions, initialLimit: number = 10): UseJobsResult {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchJobs = useCallback(async (cursor: string | null = null, append: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare query parameters
      const queryParams = new URLSearchParams();

      // Add pagination parameters
      queryParams.append('limit', initialLimit.toString());
      if (cursor) {
        queryParams.append('cursor', cursor);
      }

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get<JobsResponse>(`http://localhost:3000/submissions?${queryParams.toString()}`);

      setJobs(prevJobs => append ? [...prevJobs, ...response.data.data] : response.data.data);
      setNextCursor(response.data.pagination.nextCursor);
      setHasMore(response.data.pagination.hasMore);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, initialLimit]);

  // Initial load
  useEffect(() => {
    setJobs([]); // Clear existing jobs when filters change
    setNextCursor(null);
    fetchJobs();
  }, [fetchJobs]);

  // Load more function for infinite scroll/pagination
  const loadMore = async () => {
    if (!isLoading && hasMore && nextCursor) {
      await fetchJobs(nextCursor, true);
    }
  };

  // Refresh function to reload from the beginning
  const refresh = async () => {
    setJobs([]);
    setNextCursor(null);
    await fetchJobs();
  };

  return {
    jobs,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

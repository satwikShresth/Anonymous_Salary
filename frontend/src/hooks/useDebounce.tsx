// hooks/useDebounce.ts
export function createDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debouncedFunction = (...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Create new timeout
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = undefined;
    }, delay);
  };

  // Add cancel method
  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debouncedFunction;
}

// For React components, we can create a custom hook
import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  // Use ref to store the timeout ID and callback
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);

  // Update the callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create new timeout
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]); // Only recreate if delay changes
}

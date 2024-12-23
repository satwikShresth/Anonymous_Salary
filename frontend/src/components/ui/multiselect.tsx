import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface MultiSelectProps {
  label: string;
  icon: React.ReactNode;
  values: string[];
  onChange: (values: string[]) => void;
  fetchOptions: (search: string) => Promise<string[]>;
  maxItems?: number;
  required?: boolean;
  placeholder?: string;
  debounceMs?: number;
}

export function MultiSelect({
  label,
  icon,
  values,
  onChange,
  fetchOptions,
  maxItems = 5,
  required = false,
  placeholder = 'Select...',
  debounceMs = 300
}: MultiSelectProps) {
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Create debounced fetch function
  const handleSearch = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      const fetchedOptions = await fetchOptions(searchTerm);
      setOptions(fetchedOptions.filter(option => !values.includes(option)));
    } catch (error) {
      console.error('Error fetching options:', error);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, debounceMs);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch options when search changes
  useEffect(() => {
    if (search.trim()) {
      debouncedSearch(search);
    } else {
      setOptions([]);
    }
  }, [search, debouncedSearch]);

  const handleAdd = (option: string) => {
    if (values.length < maxItems) {
      onChange([...values, option]);
      setSearch('');
      setShowOptions(false);
      setOptions([]);
    }
  };

  const handleRemove = (option: string) => {
    onChange(values.filter(v => v !== option));
  };

  const canAddMore = values.length < maxItems;

  return (
    <div ref={wrapperRef} className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex items-center gap-2">
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </div>
      </label>

      {/* Selected Items */}
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm"
          >
            {value}
            <button
              type="button"
              onClick={() => handleRemove(value)}
              className="p-0.5 hover:bg-blue-200 rounded-full transition-colors duration-150"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Input Field */}
      {canAddMore && (
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowOptions(true);
              }}
              onFocus={() => setShowOptions(true)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
              placeholder={placeholder}
            />
            {isLoading ? (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={20} />
            ) : (
              <Plus className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            )}
          </div>

          {/* Dropdown */}
          {showOptions && (search.trim() || options.length > 0) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isLoading && search.trim() ? (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
              ) : options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors duration-150"
                    onClick={() => handleAdd(option)}
                  >
                    {option}
                  </button>
                ))
              ) : search.trim() ? (
                <div className="px-4 py-2 text-gray-500">No results found</div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-sm text-gray-500 flex items-center justify-between">
        <span>{values.length} of {maxItems} selected</span>
        {required && values.length === 0 && (
          <span className="text-red-500">At least one selection required</span>
        )}
      </p>
    </div>
  );
}

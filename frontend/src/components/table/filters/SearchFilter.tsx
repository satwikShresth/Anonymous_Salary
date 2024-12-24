import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X, Loader2, Plus } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';

interface SearchFilterProps {
  label: string;
  options?: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  fetchOptions?: (query: string) => Promise<string[]>;
  loading?: boolean;
  minCharsBeforeSearch?: number;
  maxItems?: number;
  required?: boolean;
  placeholder?: string;
  allowSuggestions?: boolean;
  onSuggestion?: (value: string) => void;
}

export function SearchFilter({
  label,
  options = [],
  selected,
  onChange,
  fetchOptions,
  loading = false,
  minCharsBeforeSearch = 2,
  maxItems = 5,
  required = false,
  placeholder = 'Search...',
  allowSuggestions = false,
  onSuggestion
}: SearchFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showAddOption, setShowAddOption] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<string[]>(options);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (query.length >= minCharsBeforeSearch && fetchOptions) {
      setShowAddOption(false);
      setIsSearching(true);
      try {
        const results = await fetchOptions(query);
        setAvailableOptions(results.filter(option => !selected.includes(option)));
        setTimeout(() => setShowAddOption(true), 500);
      } finally {
        setIsSearching(false);
      }
    }
  }, [fetchOptions, minCharsBeforeSearch, selected]);

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInputValue('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!inputValue) {
      setShowAddOption(false);
      setAvailableOptions(options.filter(option => !selected.includes(option)));
    }
  }, [inputValue, options, selected]);

  const handleAdd = (value: string) => {
    if (selected.length < maxItems) {
      onChange([...selected, value]);
      setInputValue('');
      setAvailableOptions(options.filter(option => !selected.includes(option) && option !== value));
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(v => v !== value));
    setAvailableOptions([...availableOptions, value]);
  };

  const handleSuggestionClick = () => {
    if (inputValue && onSuggestion) {
      onSuggestion(inputValue);
      setInputValue('');
      setShowAddOption(false);
    }
  };

  const canAddMore = selected.length < maxItems;

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {/* Selected Items Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map((value) => (
          <span
            key={value}
            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-blue-100 text-blue-800"
          >
            {value}
            <button
              type="button"
              onClick={() => handleRemove(value)}
              className="ml-1.5 hover:text-blue-600"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>

      {/* Search Input */}
      {canAddMore && (
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                debouncedSearch(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={placeholder}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {(isSearching || loading) && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="px-4 py-2 text-gray-500">Searching...</div>
              ) : availableOptions.length > 0 ? (
                <>
                  {availableOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors duration-150"
                      onClick={() => handleAdd(option)}
                    >
                      {option}
                    </button>
                  ))}
                  {inputValue && allowSuggestions && showAddOption && !availableOptions.includes(inputValue) && (
                    <button
                      type="button"
                      onClick={handleSuggestionClick}
                      className="w-full px-4 py-3 text-left border-t border-gray-100"
                    >
                      <div className="flex items-center gap-2 text-blue-600">
                        <Plus className="w-4 h-4" />
                        <span>Add "{inputValue}"</span>
                      </div>
                    </button>
                  )}
                </>
              ) : (
                <div className="px-4 py-2 text-gray-500">No results found</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
        <span>{selected.length} of {maxItems} selected</span>
        {required && selected.length === 0 && (
          <span className="text-red-500">Required</span>
        )}
      </div>
    </div>
  );
}

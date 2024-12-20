import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Search, Loader2 } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  icon: React.ReactNode;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  maxItems?: number;
  required?: boolean;
  placeholder?: string;
  loading?: boolean;
}

export function MultiSelect({
  label,
  icon,
  options,
  values,
  onChange,
  maxItems = 5,
  required = false,
  placeholder = 'Select...',
  loading = false
}: MultiSelectProps) {
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    option =>
      !values.includes(option) &&
      option.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = (option: string) => {
    if (values.length < maxItems) {
      onChange([...values, option]);
      setSearch('');
      setShowOptions(false);
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
              disabled={loading}
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
              placeholder={loading ? 'Loading...' : placeholder}
              disabled={loading}
            />
            {loading ? (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={20} />
            ) : (
              <Plus className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            )}
          </div>

          {/* Dropdown */}
          {showOptions && !loading && filteredOptions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors duration-150"
                  onClick={() => handleAdd(option)}
                >
                  {option}
                </button>
              ))}
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

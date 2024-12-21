import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Plus, Search } from 'lucide-react';

interface AutocompleteInputProps {
  config: { title: string, icon: any, type: any, allowSuggestions: boolean };
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onSuggestion?: (value: string) => void;
  loading?: boolean;
}

export function AutocompleteInput({
  config,
  value,
  onChange,
  options,
  onSuggestion,
  loading = false
}: AutocompleteInputProps) {
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const Icon = config.icon;

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes((search || '').toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false);
        if (!value) {
          setSearch('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    setShowOptions(true);

    if (!newValue) {
      onChange('');
    }
  };

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setSearch('');
    setShowOptions(false);
  };

  const handleSuggestion = () => {
    if (config.allowSuggestions && onSuggestion && search) {
      onSuggestion(search);
      setSearch('');
      setShowOptions(false);
    }
  };

  const displayValue = search || value;

  return (
    <div ref={wrapperRef} className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {config.title}
      </label>
      <div className="relative">
        <input
          type="text"
          required
          placeholder={loading ? 'Loading...' : `Select ${config.type}...`}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(true)}
          disabled={loading}
        />
        {loading ? (
          <Loader2 className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        ) : config.allowSuggestions && search && !filteredOptions.length ? (
          <button
            type="button"
            onClick={handleSuggestion}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        )}
        {showOptions && !loading && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

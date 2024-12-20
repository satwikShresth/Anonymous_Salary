import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}

export function AutocompleteInput({
  value,
  onChange,
  options,
  label,
  icon,
  placeholder
}: AutocompleteInputProps) {
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes((search || value).toLowerCase())
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

  return (
    <div ref={wrapperRef} className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          required
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
          value={search || value}
          onChange={e => {
            setSearch(e.target.value);
            setShowOptions(true);
          }}
          onFocus={() => setShowOptions(true)}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        {showOptions && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                onClick={() => {
                  onChange(option);
                  setSearch(option);
                  setShowOptions(false);
                }}
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

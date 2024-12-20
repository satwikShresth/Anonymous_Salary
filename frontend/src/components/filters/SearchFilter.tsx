import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  label: string;
  options: string[];
  selected: string | null;
  onChange: (value: string | null) => void;
}

export function SearchFilter({ label, options, selected, onChange }: SearchFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${
          selected
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {label}
        {selected ? (
          <X
            className="w-4 h-4 ml-1 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              setSearch('');
            }}
          />
        ) : (
          <Search className="w-4 h-4 ml-1" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  selected === option ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
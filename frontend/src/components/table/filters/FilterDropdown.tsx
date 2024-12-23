import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string | null;
  onChange: (value: string | null) => void;
}

export function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
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
            }}
          />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48">
          {options.map((option) => (
            <button
              key={option}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                selected === option ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
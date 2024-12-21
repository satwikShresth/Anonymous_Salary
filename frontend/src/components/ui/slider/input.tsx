import { useState } from 'react';

interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
}

export function SliderInput({
  value,
  onChange,
  min,
  max,
  step,
  disabled = false,
  prefix = '',
  suffix = ''
}: SliderInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex items-center space-x-1">
      {prefix && (
        <span className={`
          text-sm font-medium select-none
          ${disabled ? 'text-gray-400' : isFocused ? 'text-blue-600' : 'text-gray-600'}
        `}>
          {prefix}
        </span>
      )}
      <div className="relative inline-flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              const clampedValue = Math.min(Math.max(newValue, min), max);
              onChange(clampedValue);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            w-20 py-1.5 px-2 rounded-md text-sm text-right
            transition-all duration-200
            ${disabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : isFocused
                ? 'bg-blue-50 text-blue-600 border border-blue-500 ring-1 ring-blue-500'
                : 'bg-transparent text-gray-900 hover:bg-gray-50'
            }
          `}
        />
      </div>
      {suffix && (
        <span className={`
          text-sm font-medium select-none
          ${disabled ? 'text-gray-400' : isFocused ? 'text-blue-600' : 'text-gray-600'}
        `}>
          {suffix}
        </span>
      )}
    </div>
  );
}

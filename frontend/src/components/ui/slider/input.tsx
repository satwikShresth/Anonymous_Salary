import { useState, useEffect } from 'react';

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
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(Number(newValue));
  };

  const handleBlur = () => {
    setIsFocused(false);

    // Clamp and update the parent value
    if (!isNaN(localValue)) {
      const clampedValue = Math.min(Math.max(localValue, min), max);
      setLocalValue(clampedValue);
      if (clampedValue !== value) {
        onChange(clampedValue);
      }
    } else {
      // Reset to the last valid value if input is invalid
      setLocalValue(value);
    }
  };

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
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            w-22 py-1.5 px-2 rounded-md text-sm text-right
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

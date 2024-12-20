import { useState, ChangeEvent } from 'react';

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
  prefix,
  suffix
}: SliderInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());

  // Update local value when prop value changes
  if (value.toString() !== localValue && !isFocused) {
    setLocalValue(value.toString());
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);

    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      const stepAlignedValue = Math.round(numValue / step) * step;
      const clampedValue = Math.min(Math.max(stepAlignedValue, min), max);
      onChange(clampedValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    // Ensure the display value is valid on blur
    const numValue = parseFloat(localValue);
    if (isNaN(numValue)) {
      setLocalValue(value.toString());
    } else {
      const stepAlignedValue = Math.round(numValue / step) * step;
      const clampedValue = Math.min(Math.max(stepAlignedValue, min), max);
      setLocalValue(clampedValue.toString());
      onChange(clampedValue);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {prefix && (
        <span className="text-sm font-medium text-gray-600">{prefix}</span>
      )}
      <div className="relative inline-flex items-center">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-14 py-1.5 pl-2 pr-7 rounded-md text-sm text-right
            transition-all duration-200
            ${disabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : isFocused
                ? 'bg-blue-50 text-blue-600 border border-blue-500 ring-1 ring-blue-500'
                : 'bg-transparent text-gray-900 hover:bg-gray-50'
            }
          `}
        />
        {suffix && (
          <span className={`
            absolute right-1
            text-sm font-medium select-none
            ${disabled ? 'text-gray-400' : isFocused ? 'text-blue-600' : 'text-gray-600'}
          `}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

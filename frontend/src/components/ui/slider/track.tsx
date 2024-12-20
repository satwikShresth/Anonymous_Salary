import React from 'react';

interface SliderTrackProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  step: number;
  disabled?: boolean;
}

export function SliderTrack({
  value,
  min,
  max,
  onChange,
  step,
  disabled = false
}: SliderTrackProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-6 flex items-center">
      <div className="absolute w-full h-2 bg-gray-200 rounded-full">
        <div
          className={`absolute h-full rounded-full ${disabled ? 'bg-gray-400' : 'bg-blue-600'
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={`
          absolute w-full h-2 appearance-none bg-transparent cursor-pointer
          range-slider
        `}
        style={{
          '--range-color': disabled ? '#9CA3AF' : '#2563EB'
        } as React.CSSProperties}
      />
    </div>
  );
}

import { SliderTrack } from './track';
import { SliderInput } from './input';
import { SliderMarks } from './marks';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  unit?: string;
  displaySuffix?: string;
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  unit = '',
  displaySuffix = ''
}: SliderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <SliderTrack
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
          <SliderMarks
            min={min}
            max={max}
            step={step}
            unit={unit}
          />
        </div>
        <div className="-mt-6 -mt-6 -ml-2">
          <SliderInput
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            suffix={unit}
            prefix={displaySuffix}
          />
        </div>
      </div>
    </div>
  );
}

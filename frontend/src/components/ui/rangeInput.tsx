import { DollarSign, Clock } from 'lucide-react';
import { Slider } from './slider';

interface RangeInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  icon?: 'dollar' | 'clock';
  step?: number;
}

export const RangeInput = ({
  label,
  value,
  min,
  max,
  onChange,
  icon,
  step = 1
}: RangeInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon === 'dollar' && <DollarSign className="w-4 h-4 text-gray-500" />}
        {icon === 'clock' && <Clock className="w-4 h-4 text-gray-500" />}
        {label}
      </label>
      <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        unit={icon === 'dollar' ? '$' : 'hrs'}
        displaySuffix={icon === 'dollar' ? '/hr' : ''}
      />
    </div>
  );
}

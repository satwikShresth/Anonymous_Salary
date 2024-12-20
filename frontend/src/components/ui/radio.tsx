import { Calendar, GraduationCap, BookOpen, Globe } from 'lucide-react';

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  type?: 'year' | 'cycle' | 'level' | 'source';
}

export function RadioGroup({ label, options, value, onChange, type }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {type === 'year' && <GraduationCap className="w-4 h-4 text-gray-500" />}
        {type === 'cycle' && <Calendar className="w-4 h-4 text-gray-500" />}
        {type === 'level' && <BookOpen className="w-4 h-4 text-gray-500" />}
        {type === 'source' && <Globe className="w-4 h-4 text-gray-500" />}
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`
              flex items-center justify-center px-6 py-3 rounded-lg cursor-pointer text-base
              transition-colors duration-200 ease-in-out
              ${value === option
                ? 'bg-blue-600 text-white font-medium shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <input
              type="radio"
              className="hidden"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

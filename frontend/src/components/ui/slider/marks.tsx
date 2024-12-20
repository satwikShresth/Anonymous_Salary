interface SliderMarksProps {
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export function SliderMarks({ min, max, step, unit = '' }: SliderMarksProps) {
  const marks = [];
  const totalSteps = (max - min) / step;
  const interval = Math.ceil(totalSteps / 4); // Show 5 marks including min and max

  for (let i = 0; i <= totalSteps; i += interval) {
    const value = min + (i * step);
    if (value <= max) {
      marks.push(value);
    }
  }
  if (marks[marks.length - 1] !== max) {
    marks.push(max);
  }

  return (
    <div className="relative w-full h-6 mt-1">
      <div className="absolute w-full flex justify-between px-1">
        {marks.map((mark) => (
          <div key={mark} className="flex flex-col items-center">
            <div className="h-2 w-0.5 bg-gray-300" />
            <span className="text-xs text-gray-500 mt-1">
              {mark}{unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

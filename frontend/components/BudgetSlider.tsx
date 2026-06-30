"use client";

interface BudgetSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function BudgetSlider({ value, min, max, step, onChange }: BudgetSliderProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted">Budget up to</span>
        <span className="text-lg font-bold text-ink">₹{value.toLocaleString("en-IN")}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(to right, oklch(0.50 0.19 235) ${progress}%, oklch(0.18 0.02 235 / 0.1) ${progress}%)`,
        }}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full accent-primary [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-110"
        aria-label="Maximum budget in rupees"
      />
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>₹{min.toLocaleString("en-IN")}</span>
        <span>₹{max.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

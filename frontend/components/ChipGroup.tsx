"use client";

interface ChipGroupProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
}

export function ChipGroup({ options, selected, onChange, multiSelect = false }: ChipGroupProps) {
  function toggle(option: string) {
    if (multiSelect) {
      onChange(
        selected.includes(option)
          ? selected.filter((item) => item !== option)
          : [...selected, option]
      );
    } else {
      onChange([option]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(option)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 ease-out active:scale-[0.97] ${
              isSelected
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "border border-ink/15 text-ink hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

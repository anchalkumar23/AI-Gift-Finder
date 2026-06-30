import { Tone } from "@/lib/types";

const TONES: { value: Tone; label: string }[] = [
  { value: "personal", label: "More personal" },
  { value: "practical", label: "More practical" },
  { value: "premium", label: "More premium" },
];

export function ToneToggle({ value, onChange }: { value: Tone; onChange: (tone: Tone) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Adjust idea tone">
      {TONES.map((tone) => (
        <button
          key={tone.value}
          type="button"
          aria-pressed={value === tone.value}
          onClick={() => onChange(tone.value)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-150 ease-out active:scale-[0.97] ${
            value === tone.value ? "bg-primary text-white" : "border border-ink/20 text-ink"
          }`}
        >
          {tone.label}
        </button>
      ))}
    </div>
  );
}

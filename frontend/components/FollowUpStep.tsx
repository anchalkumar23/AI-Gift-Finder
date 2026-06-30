import { FollowUp } from "@/lib/types";
import { ChipGroup } from "./ChipGroup";

interface FollowUpStepProps {
  followup: FollowUp;
  onSelect: (category: string) => void;
}

export function FollowUpStep({ followup, onSelect }: FollowUpStepProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-ink">{followup.question}</h2>
      <p className="mt-1 text-muted">Pick the closest fit, we&apos;ll take it from there.</p>
      <div className="mt-6">
        <ChipGroup
          options={followup.options}
          selected={[]}
          onChange={([choice]) => onSelect(choice)}
        />
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";

import { filterIdeasByBudget } from "@/lib/budgetFilter";
import { GiftRequest, GiftResponse, Tone } from "@/lib/types";
import { AvoidStrip } from "./AvoidStrip";
import { BudgetSlider } from "./BudgetSlider";
import { HighlightCard } from "./HighlightCard";
import { ResultsGrid } from "./ResultsGrid";
import { ShareButton } from "./ShareButton";
import { ToneToggle } from "./ToneToggle";

interface ResultsPageProps {
  response: GiftResponse;
  onRegenerate: (overrides?: Partial<GiftRequest>) => void;
}

export function ResultsPage({ response, onRegenerate }: ResultsPageProps) {
  const maxPrice = Math.max(...response.ideas.map((idea) => idea.price_max), 1000);
  const [budgetFilter, setBudgetFilter] = useState<number>(maxPrice);

  const highlights = response.ideas.filter((idea) => idea.highlight !== null);
  const rest = response.ideas.filter((idea) => idea.highlight === null);
  const visibleRest = useMemo(
    () => filterIdeasByBudget(rest, budgetFilter),
    [rest, budgetFilter]
  );

  function handleTone(tone: Tone) {
    onRegenerate({ tone });
  }

  return (
    <section>
      <h2 className="text-3xl font-extrabold tracking-tight text-ink">
        Here&apos;s what we&apos;d get them
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {highlights.map((idea) => (
          <HighlightCard key={idea.name} idea={idea} />
        ))}
      </div>

      <AvoidStrip items={response.avoid} />

      <div className="mt-8">
        <p className="text-sm font-semibold text-ink">Want different ideas?</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <ToneToggle value="balanced" onChange={handleTone} />
          <button
            type="button"
            onClick={() => onRegenerate()}
            className="rounded-card bg-accent px-5 py-3 font-bold text-white transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Regenerate
          </button>
        </div>
      </div>

      <div className="mt-6 max-w-xs">
        <p className="text-sm font-semibold text-ink">Filter by budget</p>
        <p className="text-xs text-muted">Updates instantly below — no need to regenerate.</p>
        <div className="mt-2">
          <BudgetSlider value={budgetFilter} min={500} max={maxPrice} step={500} onChange={setBudgetFilter} />
        </div>
      </div>

      <ResultsGrid ideas={visibleRest} />

      {visibleRest.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          Nothing fits that budget yet —{" "}
          <button
            type="button"
            className="font-semibold text-primary underline"
            onClick={() => onRegenerate()}
          >
            regenerate for this range
          </button>
          .
        </p>
      )}

      <div className="mt-8">
        <ShareButton message={response.whatsapp_message} />
      </div>
    </section>
  );
}

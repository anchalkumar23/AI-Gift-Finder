"use client";

import { GiftRequest, GiftResponse, Tone } from "@/lib/types";
import { AvoidStrip } from "./AvoidStrip";
import { HighlightCard } from "./HighlightCard";
import { ResultsGrid } from "./ResultsGrid";
import { ShareButton } from "./ShareButton";
import { ToneToggle } from "./ToneToggle";

interface ResultsPageProps {
  response: GiftResponse;
  recipient: string;
  onRegenerate: (overrides?: Partial<GiftRequest>) => void;
  onStartOver: () => void;
}

export function ResultsPage({ response, recipient, onRegenerate, onStartOver }: ResultsPageProps) {
  const highlights = response.ideas.filter((idea) => idea.highlight !== null);
  const rest = response.ideas.filter((idea) => idea.highlight === null);

  function handleTone(tone: Tone) {
    onRegenerate({ tone });
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Here&apos;s what we&apos;d get them
        </h2>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-card border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.97]"
        >
          Find a gift for someone else
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {highlights.map((idea) => (
          <HighlightCard key={idea.name} idea={idea} recipient={recipient} />
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

      <div className="mt-10 border-t border-ink/10 pt-8">
        <h3 className="text-lg font-bold text-ink">More ideas</h3>
        <ResultsGrid ideas={rest} recipient={recipient} />
      </div>

      <div className="mt-8">
        <ShareButton message={response.whatsapp_message} />
      </div>
    </section>
  );
}

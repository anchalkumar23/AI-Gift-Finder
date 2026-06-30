"use client";

import { useEffect, useState } from "react";

import { fetchGiftIdeas } from "@/lib/api";
import { GiftRequest, GiftResponse } from "@/lib/types";
import { FollowUpStep } from "@/components/FollowUpStep";
import { LoadingState } from "@/components/LoadingState";
import { ResultsPage } from "@/components/ResultsPage";
import { WizardForm } from "@/components/WizardForm";

type Stage = "form" | "followup" | "loading" | "results" | "error";

const DEFAULT_REQUEST: GiftRequest = {
  recipient: "",
  age: 25,
  relationship: "",
  occasion: "",
  budget_min: 0,
  budget_max: 3000,
  interests: [],
  dislikes: "",
  location: "",
  tone: "balanced",
  exclude_names: [],
};

const STORAGE_KEY = "gift-finder-state";

export default function Home() {
  const [stage, setStage] = useState<Stage>("form");
  const [request, setRequest] = useState<GiftRequest>(DEFAULT_REQUEST);
  const [response, setResponse] = useState<GiftResponse | null>(null);

  // Restore persisted state once on mount (client-only).
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setStage(parsed.stage === "loading" ? "form" : parsed.stage);
      setRequest(parsed.request ?? DEFAULT_REQUEST);
      setResponse(parsed.response ?? null);
    } catch {
      // Malformed/stale data: ignore and keep default empty-form state.
    }
  }, []);

  // Persist state on every change (client-only).
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, request, response }));
  }, [stage, request, response]);

  async function submit(nextRequest: GiftRequest) {
    setRequest(nextRequest);
    setStage("loading");
    try {
      const result = await fetchGiftIdeas(nextRequest);
      setResponse(result);
      setStage(result.needs_followup ? "followup" : "results");
    } catch {
      setStage("error");
    }
  }

  function submitFollowUp(category: string) {
    submit({ ...request, interests: [category] });
  }

  function regenerate(overrides: Partial<GiftRequest> = {}) {
    const excludeNames = response?.ideas.map((idea) => idea.name) ?? [];
    submit({ ...request, ...overrides, exclude_names: excludeNames });
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="w-full border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <span className="text-lg font-extrabold tracking-tight text-ink">
            🎁 AI Gift Finder
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {stage === "form" && <WizardForm initialRequest={request} onSubmit={submit} />}
        {stage === "followup" && response?.followup && (
          <FollowUpStep followup={response.followup} onSelect={submitFollowUp} />
        )}
        {stage === "loading" && <LoadingState />}
        {stage === "results" && response && (
          <ResultsPage response={response} onRegenerate={regenerate} />
        )}
        {stage === "error" && (
          <div className="text-center">
            <p className="text-lg font-semibold text-ink">Couldn&apos;t generate ideas. Try again?</p>
            <button
              type="button"
              onClick={() => setStage("form")}
              className="mt-4 rounded-card bg-primary px-6 py-3 font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              Back to form
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

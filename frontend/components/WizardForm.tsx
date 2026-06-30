"use client";

import { useState } from "react";

import { GiftRequest } from "@/lib/types";
import { BudgetSlider } from "./BudgetSlider";
import { ChipGroup } from "./ChipGroup";

const RELATIONSHIPS = ["Sister", "Brother", "Partner", "Parent", "Friend", "Colleague", "Boss"];
const OCCASIONS = ["Birthday", "Anniversary", "Wedding", "Just because", "Festival"];
const INTERESTS = [
  "Food/cafes", "Fitness", "Beauty", "Tech",
  "Books", "Home decor", "Fashion", "Travel", "Not sure",
];

interface WizardFormProps {
  initialRequest: GiftRequest;
  onSubmit: (request: GiftRequest) => void;
}

export function WizardForm({ initialRequest, onSubmit }: WizardFormProps) {
  const [form, setForm] = useState<GiftRequest>(initialRequest);

  function update<K extends keyof GiftRequest>(key: K, value: GiftRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(form);
  }

  const canSubmit = form.recipient.trim().length > 0 && form.relationship.length > 0 && form.occasion.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          Find them something they&apos;ll actually love
        </h1>
        <p className="mt-1 text-muted">A few quick questions, then we&apos;ll do the thinking.</p>
      </header>

      <div>
        <label htmlFor="recipient" className="text-sm font-semibold text-ink">
          Who&apos;s this for?
        </label>
        <input
          id="recipient"
          value={form.recipient}
          onChange={(event) => update("recipient", event.target.value)}
          placeholder="e.g. Sister, best friend, my manager"
          className="mt-2 w-full rounded-card border border-ink/20 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
        />
      </div>

      <div>
        <label htmlFor="age" className="text-sm font-semibold text-ink">
          Their age
        </label>
        <input
          id="age"
          type="number"
          min={1}
          max={120}
          value={form.age}
          onChange={(event) => update("age", Number(event.target.value))}
          className="mt-2 w-28 rounded-card border border-ink/20 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Your relationship to them</p>
        <div className="mt-2">
          <ChipGroup
            options={RELATIONSHIPS}
            selected={[form.relationship]}
            onChange={([value]) => update("relationship", value)}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Occasion</p>
        <div className="mt-2">
          <ChipGroup
            options={OCCASIONS}
            selected={[form.occasion]}
            onChange={([value]) => update("occasion", value)}
          />
        </div>
      </div>

      <BudgetSlider
        value={form.budget_max}
        min={500}
        max={20000}
        step={500}
        onChange={(value) => update("budget_max", value)}
      />

      <div>
        <p className="text-sm font-semibold text-ink">What are they into?</p>
        <p className="text-xs text-muted">Pick a few, or choose &quot;Not sure&quot; if you don&apos;t know.</p>
        <div className="mt-2">
          <ChipGroup
            options={INTERESTS}
            selected={form.interests}
            onChange={(value) => update("interests", value)}
            multiSelect
          />
        </div>
      </div>

      <div>
        <label htmlFor="dislikes" className="text-sm font-semibold text-ink">
          Anything they dislike or already have?
        </label>
        <textarea
          id="dislikes"
          value={form.dislikes}
          onChange={(event) => update("dislikes", event.target.value)}
          placeholder="e.g. perfume, already has a coffee machine"
          className="mt-2 w-full rounded-card border border-ink/20 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={2}
        />
      </div>

      <div>
        <label htmlFor="location" className="text-sm font-semibold text-ink">
          City (optional)
        </label>
        <input
          id="location"
          value={form.location}
          onChange={(event) => update("location", event.target.value)}
          placeholder="e.g. Mumbai"
          className="mt-2 w-full rounded-card border border-ink/20 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-card bg-primary px-6 py-4 text-lg font-bold text-white transition-transform duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Find gifts ✨
      </button>
    </form>
  );
}

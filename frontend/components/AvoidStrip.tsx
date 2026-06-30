"use client";

import { useState } from "react";

export function AvoidStrip({ items }: { items: string[] }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || items.length === 0) return null;

  return (
    <div className="mt-6 flex items-start justify-between gap-4 rounded-card bg-ink/5 p-4 text-sm text-ink">
      <div>
        <p className="font-semibold">Avoid these</p>
        <ul className="mt-1 list-disc pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss avoid list"
        className="text-muted hover:text-ink"
      >
        ✕
      </button>
    </div>
  );
}

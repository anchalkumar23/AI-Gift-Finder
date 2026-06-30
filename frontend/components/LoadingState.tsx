"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading between the lines of what they actually like...",
  "Ruling out the generic stuff...",
  "Matching their interests to something they'll actually use...",
  "Double-checking this isn't another mug...",
];

export function LoadingState() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((current) => (current + 1) % MESSAGES.length);
        setVisible(true);
      }, 350);
      return () => clearTimeout(swap);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div
        className="text-5xl motion-safe:animate-gentle-pulse"
        aria-hidden="true"
      >
        🎁
      </div>

      <p
        className="mt-6 min-h-[3.5rem] text-lg font-medium text-ink transition-opacity duration-300 ease-in-out"
        style={{ opacity: visible ? 1 : 0 }}
        role="status"
      >
        {MESSAGES[index]}
      </p>

      <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-primary/15">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary via-accent to-primary motion-safe:animate-progress-sweep motion-reduce:w-full motion-reduce:animate-none" />
      </div>
    </div>
  );
}

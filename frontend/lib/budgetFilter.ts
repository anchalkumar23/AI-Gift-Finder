import { GiftIdea } from "./types";

export function filterIdeasByBudget(ideas: GiftIdea[], maxBudget: number): GiftIdea[] {
  return ideas.filter((idea) => idea.price_min <= maxBudget);
}

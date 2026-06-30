import { describe, expect, it } from "vitest";
import { filterIdeasByBudget } from "../budgetFilter";
import { GiftIdea } from "../types";

const idea = (name: string, price_min: number): GiftIdea => ({
  name,
  category: "Test",
  why: "",
  price_min,
  price_max: price_min + 500,
  where_to_look: [],
  links: [],
  highlight: null,
  image_url: null,
  is_combo: false,
});

describe("filterIdeasByBudget", () => {
  it("keeps ideas at or below the budget", () => {
    const ideas = [idea("Cheap", 500), idea("Expensive", 5000)];
    expect(filterIdeasByBudget(ideas, 1000)).toEqual([ideas[0]]);
  });

  it("returns an empty array when nothing fits", () => {
    const ideas = [idea("Expensive", 5000)];
    expect(filterIdeasByBudget(ideas, 1000)).toEqual([]);
  });
});

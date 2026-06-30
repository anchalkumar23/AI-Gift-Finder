import { GiftRequest, GiftResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function fetchGiftIdeas(request: GiftRequest): Promise<GiftResponse> {
  const response = await fetch(`${API_URL}/api/gift-ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error("Couldn't generate ideas, please try again.");
  }
  return response.json();
}

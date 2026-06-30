export type Tone = "balanced" | "personal" | "practical" | "premium";
export type Highlight = "safe" | "thoughtful" | "fun";

export interface GiftRequest {
  recipient: string;
  age: number;
  relationship: string;
  occasion: string;
  budget_min: number;
  budget_max: number;
  interests: string[];
  dislikes: string;
  location: string;
  tone: Tone;
  exclude_names: string[];
}

export interface FollowUp {
  question: string;
  options: string[];
}

export interface GiftIdea {
  name: string;
  category: string;
  why: string;
  price_min: number;
  price_max: number;
  where_to_look: string[];
  links: { platform: string; url: string }[];
  highlight: Highlight | null;
  image_url: string | null;
  is_combo: boolean;
}

export interface GiftResponse {
  needs_followup: boolean;
  followup: FollowUp | null;
  ideas: GiftIdea[];
  avoid: string[];
  whatsapp_message: string;
}

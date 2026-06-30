import json
import os
from concurrent.futures import ThreadPoolExecutor

import httpx
from openai import OpenAI

from images import fetch_image_url
from links import platform_search_url
from models import FollowUp, GiftIdea, GiftRequest, GiftResponse

_NOT_SURE = "Not sure"
_BANNED_DEFAULTS = "watches, perfume, flowers, books, mugs"

_TONE_INSTRUCTIONS = {
    "balanced": "Balance personal sentiment with practicality.",
    "personal": "Lean toward emotionally meaningful, sentimental ideas.",
    "practical": "Lean toward useful, everyday-practical ideas.",
    "premium": "Lean toward higher-end, premium-feeling ideas within the budget.",
}


def _normalize_highlights(ideas: list[dict]) -> list[dict]:
    seen: set[str] = set()
    for idea in ideas:
        label = idea.get("highlight")
        if label and label not in seen:
            seen.add(label)
        elif label:
            idea["highlight"] = None
    for label in ("safe", "thoughtful", "fun"):
        if label in seen:
            continue
        for idea in ideas:
            if idea["highlight"] is None:
                idea["highlight"] = label
                seen.add(label)
                break
    return ideas


def needs_followup(request: GiftRequest) -> FollowUp | None:
    if not request.interests or _NOT_SURE in request.interests:
        return FollowUp(
            question="What are they into?",
            options=[
                "Food/cafes", "Fitness", "Beauty", "Tech",
                "Books", "Home decor", "Fashion", "Travel",
            ],
        )
    return None


def build_system_prompt(tone: str) -> str:
    return (
        "You are a gift recommendation expert for Indian gift-givers. "
        f"Never suggest {_BANNED_DEFAULTS} unless hyper-specialized to a stated interest "
        "(e.g. not 'mug' but 'a handmade ceramic coffee mug from a local studio + a coffee "
        "sampler' for someone into coffee and home decor). "
        "Every idea's 'why' must reference at least one concrete input (an interest, the "
        "dislikes, age, relationship, or location) — no generic justifications. "
        "Prices are in INR. Prefer Indian platforms, store types, or city-specific options "
        "where relevant. Return exactly 8 to 10 ideas. Tag EXACTLY one idea 'safe', EXACTLY one idea 'thoughtful', "
        "and EXACTLY one idea 'fun' in the highlight field — never reuse a label on more than one "
        "idea, and every other idea's highlight field must be null. "
        "The 'avoid' list must be reasoned specifically for this person — e.g. their stated "
        "dislikes verbatim with a short reason, or a category that clashes with their stated "
        "interests or relationship — never a generic list of commonly-disliked gift types "
        "unless one of those specific items was actually mentioned as a dislike. "
        "For each idea's 'platforms' field, list 2-4 real places to look for it: always include "
        "'Amazon' and 'Flipkart' as reliable fallbacks, plus 1-2 more specific platforms genuinely "
        "relevant to the item (e.g. Myntra or Ajio for fashion, Nykaa for beauty, Blue Tokai or Third "
        "Wave Coffee for coffee gear, Urban Company for service experiences, FabIndia or Chumbak for "
        "home decor/handicrafts, Decathlon for fitness gear, Pepperfry or Urban Ladder for furniture). "
        "Never invent a platform name that does not exist. "
        "At least 2 of the 8 to 10 ideas must be genuine combo/bundle ideas: two or more "
        "complementary items packaged together under one name, joined with ' + ' (e.g. 'Coffee "
        "sampler + ceramic mug'), with a single combined price range and a single combined 'why'. "
        "Mark those ideas' 'is_combo' field true; mark all single-item ideas false. "
        f"{_TONE_INSTRUCTIONS[tone]}"
    )


def build_user_prompt(request: GiftRequest) -> str:
    lines = [
        f"Recipient: {request.recipient}, age {request.age}",
        f"Relationship: {request.relationship}",
        f"Occasion: {request.occasion}",
        f"Budget: ₹{request.budget_min}-₹{request.budget_max}",
        f"Interests: {', '.join(request.interests) or 'unknown'}",
        f"Dislikes / already has: {request.dislikes or 'none stated'}",
        f"Location: {request.location or 'not specified'}",
    ]
    if request.exclude_names:
        lines.append(
            f"Do not repeat these previously suggested ideas: {', '.join(request.exclude_names)}"
        )
    return "\n".join(lines)


_RESPONSE_SCHEMA = {
    "name": "gift_ideas",
    "schema": {
        "type": "object",
        "properties": {
            "ideas": {
                "type": "array",
                "minItems": 8,
                "maxItems": 10,
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "category": {"type": "string"},
                        "why": {"type": "string"},
                        "price_min": {"type": "integer"},
                        "price_max": {"type": "integer"},
                        "where_to_look": {"type": "array", "items": {"type": "string"}},
                        "platforms": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 2,
                            "maxItems": 4,
                        },
                        "highlight": {
                            "type": ["string", "null"],
                            "enum": ["safe", "thoughtful", "fun", None],
                        },
                        "is_combo": {"type": "boolean"},
                    },
                    "required": [
                        "name", "category", "why", "price_min",
                        "price_max", "where_to_look", "platforms", "highlight",
                        "is_combo",
                    ],
                    "additionalProperties": False,
                },
            },
            "avoid": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["ideas", "avoid"],
        "additionalProperties": False,
    },
    "strict": True,
}


def _build_whatsapp_message(request: GiftRequest, ideas: list[GiftIdea]) -> str:
    lines = [f"🎁 Gift ideas for {request.recipient}'s {request.occasion}:"]
    for idea in ideas:
        marker = "⭐ " if idea.highlight else "• "
        lines.append(f"{marker}{idea.name} (₹{idea.price_min:,}-₹{idea.price_max:,})")
    lines.append("")
    lines.append("Found with AI Gift Finder")
    return "\n".join(lines)


def _default_client() -> OpenAI:
    return OpenAI(api_key=os.environ["OPENAI_API_KEY"])


def generate_ideas(request: GiftRequest, client: OpenAI | None = None) -> GiftResponse:
    client = client or _default_client()
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": build_system_prompt(request.tone)},
            {"role": "user", "content": build_user_prompt(request)},
        ],
        response_format={"type": "json_schema", "json_schema": _RESPONSE_SCHEMA},
    )
    data = json.loads(completion.choices[0].message.content)
    data["ideas"] = _normalize_highlights(data["ideas"])

    with httpx.Client(timeout=3.0) as image_client, ThreadPoolExecutor(max_workers=8) as pool:
        image_urls = list(
            pool.map(
                lambda idea: fetch_image_url(idea["name"], client=image_client),
                data["ideas"],
            )
        )

    ideas = []
    for idea, image_url in zip(data["ideas"], image_urls):
        platforms = idea.pop("platforms")
        links = [
            {"platform": p, "url": platform_search_url(p, idea["name"])}
            for p in platforms
        ]
        ideas.append(GiftIdea(**idea, links=links, image_url=image_url))
    return GiftResponse(
        needs_followup=False,
        ideas=ideas,
        avoid=data["avoid"],
        whatsapp_message=_build_whatsapp_message(request, ideas),
    )

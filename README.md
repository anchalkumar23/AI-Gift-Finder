# AI Gift Finder

An AI tool that turns a few answers about a gift recipient into 8-10 specific, non-generic gift ideas — built for the AI Gift Finder competition brief (`AGENT.md`).

## Tools used

- **Next.js 14** (TypeScript, App Router, Tailwind CSS) — frontend
- **FastAPI** (Python) — backend
- **OpenAI GPT-4o-mini**, structured JSON output — gift idea generation
- **21st.dev Magic MCP** — component visual refinement and brand icons during the frontend build (the component-refiner calls hit transient "high load" errors during this build, so manual styling was used as the fallback for chip/slider/highlight-card polish, while `logo_search` successfully provided the WhatsApp icon — Amazon/Flipkart icons were hand-built since no suitable match existed in that tool's database)
- Deploy target: **Vercel** (frontend) + **Render** (backend) — see follow-up deployment plan

## How the AI generates output

See [docs/diagrams.md](docs/diagrams.md) for the full request flow. In short: the backend builds a system prompt that bans generic defaults (watches, perfume, flowers, mugs, books) unless hyper-specialized to a stated interest, requires every idea's reasoning to reference a concrete input from the form, and forces INR pricing with Indian platforms/store types. OpenAI returns strictly schema-validated JSON: 8-10 ideas, exactly one each tagged `safe`/`thoughtful`/`fun`, a reasoned avoid-list, and a WhatsApp-ready summary. The backend then attaches real Amazon.in/Flipkart search-result links (not fabricated product links) to each idea.

## What's hardcoded vs dynamic

**Hardcoded:** the wizard's input option lists (relationships, occasions, interest categories), the banned-gift-defaults instruction, the JSON schema shape, the search-URL templates, the tone-instruction phrasing.

**Dynamic, generated per request:** every gift idea, its category, price range, reasoning, the avoid-list entries, and the WhatsApp message — all produced by the model from the actual inputs, including how tone (personal/practical/premium) and regeneration (excluding prior suggestions) change the output.

## What happens with very little information

If interests are missing or "Not sure" is selected, the backend short-circuits *before* calling OpenAI and returns a follow-up question using the brief's own numbered category list. The frontend renders it inline as selectable chips; only the follow-up answer triggers the real generation call.

## What I'd improve in v2

- Real product-listing data (via an affiliate or scraping API) instead of search-result links, once there's affiliate access.
- Persisted history so a user can revisit or compare past gift lists.
- A/B-testing different prompt strategies against a judged "specificity" score.
- Multi-currency / non-Indian market support.

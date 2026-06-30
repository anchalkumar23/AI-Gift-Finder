from models import GiftRequest
from gift_generator import build_system_prompt, build_user_prompt, needs_followup


def test_needs_followup_when_no_interests():
    req = GiftRequest(
        recipient="Friend", age=25, relationship="Friend",
        occasion="Birthday", budget_min=500, budget_max=2000,
    )
    followup = needs_followup(req)
    assert followup is not None
    assert followup.question == "What are they into?"
    assert "Fitness" in followup.options


def test_needs_followup_when_not_sure_selected():
    req = GiftRequest(
        recipient="Friend", age=25, relationship="Friend",
        occasion="Birthday", budget_min=500, budget_max=2000,
        interests=["Not sure"],
    )
    assert needs_followup(req) is not None


def test_no_followup_when_interests_given():
    req = GiftRequest(
        recipient="Friend", age=25, relationship="Friend",
        occasion="Birthday", budget_min=500, budget_max=2000,
        interests=["Coffee"],
    )
    assert needs_followup(req) is None


def test_system_prompt_bans_generic_defaults_and_states_count():
    prompt = build_system_prompt("balanced")
    assert "perfume" in prompt.lower()
    assert "8 to 10" in prompt


def test_user_prompt_includes_exclusions():
    req = GiftRequest(
        recipient="Friend", age=25, relationship="Friend",
        occasion="Birthday", budget_min=500, budget_max=2000,
        exclude_names=["Candle set"],
    )
    prompt = build_user_prompt(req)
    assert "Candle set" in prompt


import json

from gift_generator import generate_ideas, _normalize_highlights


class _FakeMessage:
    def __init__(self, content):
        self.content = content


class _FakeChoice:
    def __init__(self, content):
        self.message = _FakeMessage(content)


class _FakeCompletion:
    def __init__(self, content):
        self.choices = [_FakeChoice(content)]


class _FakeCompletions:
    def __init__(self, payload):
        self._payload = payload

    def create(self, **kwargs):
        return _FakeCompletion(json.dumps(self._payload))


class _FakeChat:
    def __init__(self, payload):
        self.completions = _FakeCompletions(payload)


class _FakeClient:
    def __init__(self, payload):
        self.chat = _FakeChat(payload)


def test_generate_ideas_builds_links_from_openai_payload(monkeypatch):
    monkeypatch.delenv("PEXELS_API_KEY", raising=False)
    payload = {
        "ideas": [{
            "name": "Ceramic coffee mug set",
            "category": "Coffee & Home",
            "why": "She loves coffee and home decor.",
            "price_min": 1500,
            "price_max": 3000,
            "where_to_look": ["Blue Tokai", "local ceramic studios"],
            "platforms": ["Amazon", "Flipkart", "Blue Tokai"],
            "highlight": "safe",
            "is_combo": False,
        }],
        "avoid": ["Perfume (explicitly disliked)"],
    }
    req = GiftRequest(
        recipient="Sister", age=27, relationship="Very close",
        occasion="Birthday", budget_min=1000, budget_max=5000,
        interests=["Coffee"],
    )
    result = generate_ideas(req, client=_FakeClient(payload))

    assert result.needs_followup is False
    assert len(result.ideas) == 1
    links = result.ideas[0].links
    assert len(links) == 3
    assert all(set(dict(link)) == {"platform", "url"} for link in links)
    assert any(
        link.url.startswith("https://www.amazon.in/s?k=") for link in links
    )
    assert result.avoid == ["Perfume (explicitly disliked)"]
    assert result.ideas[0].image_url is None


def test_generate_ideas_preserves_is_combo_flag(monkeypatch):
    monkeypatch.delenv("PEXELS_API_KEY", raising=False)
    payload = {
        "ideas": [{
            "name": "Coffee sampler + ceramic mug",
            "category": "Coffee & Home",
            "why": "Combines her two favorite things.",
            "price_min": 1500,
            "price_max": 3000,
            "where_to_look": ["Blue Tokai"],
            "highlight": None,
            "platforms": ["Amazon", "Flipkart"],
            "is_combo": True,
        }],
        "avoid": [],
    }
    req = GiftRequest(recipient="Sister", age=27, relationship="Very close",
                       occasion="Birthday", budget_min=1000, budget_max=5000,
                       interests=["Coffee"])
    result = generate_ideas(req, client=_FakeClient(payload))
    assert result.ideas[0].is_combo is True


def test_generate_ideas_builds_whatsapp_message_from_all_ideas(monkeypatch):
    monkeypatch.delenv("PEXELS_API_KEY", raising=False)
    payload = {
        "ideas": [
            {"name": "Coffee mug", "category": "Coffee", "why": "x", "price_min": 500, "price_max": 800,
             "where_to_look": [], "highlight": "safe", "platforms": ["Amazon", "Flipkart"], "is_combo": False},
            {"name": "Yoga mat", "category": "Fitness", "why": "y", "price_min": 1000, "price_max": 1500,
             "where_to_look": [], "highlight": None, "platforms": ["Decathlon", "Amazon"], "is_combo": False},
        ],
        "avoid": [],
    }
    req = GiftRequest(recipient="Sister", age=27, relationship="Very close",
                       occasion="Birthday", budget_min=500, budget_max=2000,
                       interests=["Coffee"])
    result = generate_ideas(req, client=_FakeClient(payload))
    assert "Coffee mug" in result.whatsapp_message
    assert "Yoga mat" in result.whatsapp_message
    assert "⭐" in result.whatsapp_message
    assert "Sister" in result.whatsapp_message


def test_normalize_highlights_demotes_duplicate_labels():
    ideas = [
        {"highlight": "thoughtful"},
        {"highlight": "thoughtful"},
        {"highlight": "safe"},
        {"highlight": None},
    ]
    result = _normalize_highlights(ideas)
    labels = [idea["highlight"] for idea in result]
    assert labels.count("thoughtful") == 1
    assert labels.count("safe") == 1


def test_normalize_highlights_backfills_missing_label():
    ideas = [
        {"highlight": "safe"},
        {"highlight": None},
        {"highlight": None},
    ]
    result = _normalize_highlights(ideas)
    labels = {idea["highlight"] for idea in result}
    assert labels == {"safe", "thoughtful", "fun"}

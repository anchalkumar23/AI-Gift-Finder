from fastapi.testclient import TestClient

import main
from models import GiftResponse

client = TestClient(main.app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_missing_interests_returns_followup_without_calling_openai(monkeypatch):
    def _boom(*args, **kwargs):
        raise AssertionError("generate_ideas should not be called")

    monkeypatch.setattr(main, "generate_ideas", _boom)

    response = client.post("/api/gift-ideas", json={
        "recipient": "Friend", "age": 25, "relationship": "Friend",
        "occasion": "Birthday", "budget_min": 500, "budget_max": 2000,
    })
    assert response.status_code == 200
    body = response.json()
    assert body["needs_followup"] is True
    assert body["followup"]["question"] == "What are they into?"


def test_full_request_returns_ideas(monkeypatch):
    fake_response = GiftResponse(needs_followup=False, ideas=[], avoid=[], whatsapp_message="hi")
    monkeypatch.setattr(main, "generate_ideas", lambda req: fake_response)

    response = client.post("/api/gift-ideas", json={
        "recipient": "Sister", "age": 27, "relationship": "Very close",
        "occasion": "Birthday", "budget_min": 1000, "budget_max": 5000,
        "interests": ["Coffee"],
    })
    assert response.status_code == 200
    assert response.json()["needs_followup"] is False


def test_invalid_budget_returns_422():
    response = client.post("/api/gift-ideas", json={
        "recipient": "Friend", "age": 25, "relationship": "Friend",
        "occasion": "Birthday", "budget_min": 5000, "budget_max": 1000,
    })
    assert response.status_code == 422

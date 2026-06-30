import pytest
from pydantic import ValidationError

from models import GiftRequest


def test_valid_request_parses():
    req = GiftRequest(
        recipient="Sister", age=27, relationship="Very close",
        occasion="Birthday", budget_min=1000, budget_max=5000,
        interests=["Coffee", "Pilates"], dislikes="Perfume", location="Mumbai",
    )
    assert req.tone == "balanced"
    assert req.exclude_names == []


def test_budget_max_below_min_rejected():
    with pytest.raises(ValidationError):
        GiftRequest(
            recipient="Friend", age=25, relationship="Friend",
            occasion="Birthday", budget_min=5000, budget_max=1000,
        )


def test_age_out_of_range_rejected():
    with pytest.raises(ValidationError):
        GiftRequest(
            recipient="Friend", age=0, relationship="Friend",
            occasion="Birthday", budget_min=100, budget_max=200,
        )

from typing import Literal

from pydantic import BaseModel, Field, model_validator

Tone = Literal["balanced", "personal", "practical", "premium"]
Highlight = Literal["safe", "thoughtful", "fun"]


class GiftRequest(BaseModel):
    recipient: str = Field(min_length=1, max_length=50)
    age: int = Field(ge=1, le=120)
    relationship: str = Field(min_length=1, max_length=50)
    occasion: str = Field(min_length=1, max_length=50)
    budget_min: int = Field(ge=0)
    budget_max: int = Field(gt=0)
    interests: list[str] = Field(default_factory=list, max_length=10)
    dislikes: str = Field(default="", max_length=300)
    location: str = Field(default="")
    tone: Tone = "balanced"
    exclude_names: list[str] = Field(default_factory=list, max_length=20)

    @model_validator(mode="after")
    def check_budget_range(self) -> "GiftRequest":
        if self.budget_max < self.budget_min:
            raise ValueError("budget_max must be >= budget_min")
        return self


class FollowUp(BaseModel):
    question: str
    options: list[str]


class PlatformLink(BaseModel):
    platform: str
    url: str


class GiftIdea(BaseModel):
    name: str
    category: str
    why: str
    price_min: int
    price_max: int
    where_to_look: list[str]
    links: list[PlatformLink]
    highlight: Highlight | None = None
    image_url: str | None = None
    is_combo: bool = False


class GiftResponse(BaseModel):
    needs_followup: bool
    followup: FollowUp | None = None
    ideas: list[GiftIdea] = Field(default_factory=list)
    avoid: list[str] = Field(default_factory=list)
    whatsapp_message: str = ""

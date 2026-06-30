import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import APIError

from gift_generator import generate_ideas, needs_followup
from models import GiftRequest, GiftResponse

app = FastAPI(title="AI Gift Finder API")

_allowed_origins = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/gift-ideas", response_model=GiftResponse)
def gift_ideas(request: GiftRequest) -> GiftResponse:
    followup = needs_followup(request)
    if followup is not None:
        return GiftResponse(needs_followup=True, followup=followup)
    try:
        return generate_ideas(request)
    except APIError as exc:
        raise HTTPException(
            status_code=502, detail="Couldn't generate ideas, please try again."
        ) from exc

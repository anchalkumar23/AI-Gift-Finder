import os

import httpx

PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"


def fetch_image_url(query: str, client: httpx.Client | None = None) -> str | None:
    api_key = os.environ.get("PEXELS_API_KEY")
    if not api_key or api_key == "your-pexels-key-here":
        return None
    owns_client = client is None
    client = client or httpx.Client(timeout=3.0)
    try:
        response = client.get(
            PEXELS_SEARCH_URL,
            params={"query": query, "per_page": 1, "orientation": "square"},
            headers={"Authorization": api_key},
        )
        response.raise_for_status()
        photos = response.json().get("photos", [])
        if not photos:
            return None
        return photos[0]["src"]["medium"]
    except (httpx.HTTPError, KeyError, ValueError):
        return None
    finally:
        if owns_client:
            client.close()

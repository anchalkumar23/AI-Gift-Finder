from urllib.parse import quote_plus


def _query(name: str, category: str) -> str:
    return f"{name} {category}".strip()


def amazon_search_url(name: str, category: str) -> str:
    return f"https://www.amazon.in/s?k={quote_plus(_query(name, category))}"


def flipkart_search_url(name: str, category: str) -> str:
    return f"https://www.flipkart.com/search?q={quote_plus(_query(name, category))}"


PLATFORM_DOMAINS = {
    "myntra": "myntra.com",
    "ajio": "ajio.com",
    "nykaa": "nykaa.com",
    "tata cliq": "tatacliq.com",
    "tatacliq": "tatacliq.com",
    "urban company": "urbancompany.com",
    "decathlon": "decathlon.in",
    "fabindia": "fabindia.com",
    "chumbak": "chumbak.com",
    "blue tokai": "bluetokaicoffee.com",
    "third wave coffee": "thirdwavecoffee.in",
    "the body shop": "thebodyshop.in",
    "lenskart": "lenskart.com",
    "crossword": "crossword.in",
    "westside": "westside.com",
    "pepperfry": "pepperfry.com",
    "urban ladder": "urbanladder.com",
    "igp": "igp.com",
    "ferns n petals": "fnp.com",
}


def platform_search_url(platform: str, query: str) -> str:
    key = platform.strip().lower()
    if key == "amazon":
        return amazon_search_url(query, "")
    if key == "flipkart":
        return flipkart_search_url(query, "")
    domain = PLATFORM_DOMAINS.get(key)
    if domain:
        return f"https://www.google.com/search?q={quote_plus(query)}+site%3A{domain}"
    return f"https://www.google.com/search?q={quote_plus(query + ' ' + platform + ' India')}"

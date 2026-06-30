from links import amazon_search_url, flipkart_search_url, platform_search_url


def test_amazon_search_url_encodes_spaces():
    url = amazon_search_url("Ceramic coffee mug", "Home")
    assert url == "https://www.amazon.in/s?k=Ceramic+coffee+mug+Home"


def test_flipkart_search_url_encodes_spaces():
    url = flipkart_search_url("Pilates grip socks", "Fitness")
    assert url == "https://www.flipkart.com/search?q=Pilates+grip+socks+Fitness"


def test_amazon_search_url_encodes_special_characters():
    url = amazon_search_url("Mom & Me tote", "Fashion")
    assert "%26" in url


def test_platform_search_url_amazon():
    url = platform_search_url("Amazon", "ceramic mug")
    assert url.startswith("https://www.amazon.in/s?k=")


def test_platform_search_url_flipkart():
    url = platform_search_url("Flipkart", "ceramic mug")
    assert url.startswith("https://www.flipkart.com/search?q=")


def test_platform_search_url_known_domain_uses_site_search():
    url = platform_search_url("Myntra", "silk scarf")
    assert url.startswith("https://www.google.com/search?q=")
    assert "site%3Amyntra.com" in url


def test_platform_search_url_unknown_platform_falls_back_to_generic_search():
    url = platform_search_url("Some Random Store", "wooden tray")
    assert url.startswith("https://www.google.com/search?q=")
    assert "site%3A" not in url

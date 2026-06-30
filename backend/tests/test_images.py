import httpx

from images import fetch_image_url


class _FakeResponse:
    def __init__(self, payload, status_code=200):
        self._payload = payload
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            raise httpx.HTTPStatusError("error", request=None, response=self)

    def json(self):
        return self._payload


class _FakeClient:
    def __init__(self, payload):
        self._payload = payload

    def get(self, url, params=None, headers=None):
        return _FakeResponse(self._payload)


def test_returns_none_when_api_key_missing(monkeypatch):
    monkeypatch.delenv("PEXELS_API_KEY", raising=False)
    assert fetch_image_url("yoga mat") is None


def test_returns_image_url_on_success(monkeypatch):
    monkeypatch.setenv("PEXELS_API_KEY", "fake-key")
    payload = {"photos": [{"src": {"medium": "https://images.pexels.com/photos/123/yoga.jpeg"}}]}
    result = fetch_image_url("yoga mat", client=_FakeClient(payload))
    assert result == "https://images.pexels.com/photos/123/yoga.jpeg"


def test_returns_none_when_no_photos_found(monkeypatch):
    monkeypatch.setenv("PEXELS_API_KEY", "fake-key")
    result = fetch_image_url("xyzzy nonsense", client=_FakeClient({"photos": []}))
    assert result is None

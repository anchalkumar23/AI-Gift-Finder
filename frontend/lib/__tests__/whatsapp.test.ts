import { describe, expect, it } from "vitest";
import { buildWhatsAppShareUrl } from "../whatsapp";

describe("buildWhatsAppShareUrl", () => {
  it("url-encodes the message", () => {
    const url = buildWhatsAppShareUrl("Top picks: A & B");
    expect(url).toBe("https://wa.me/?text=Top%20picks%3A%20A%20%26%20B");
  });
});

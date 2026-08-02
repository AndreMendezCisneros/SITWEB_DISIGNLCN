import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contactSchema } from "../src/lib/validators/contact";

describe("contactSchema", () => {
  it("accepts valid payload", () => {
    const parsed = contactSchema.safeParse({
      name: "Ana Pérez",
      company: "LCS",
      email: "ana@example.com",
      phone: "999",
      message: "Necesito una cotización de obra.",
      website: "",
      startedAt: Date.now() - 2000,
    });
    assert.equal(parsed.success, true);
  });

  it("rejects short message", () => {
    const parsed = contactSchema.safeParse({
      name: "Ana",
      email: "ana@example.com",
      message: "Hola",
      startedAt: Date.now(),
    });
    assert.equal(parsed.success, false);
  });

  it("accepts filled honeypot so API can discard silently", () => {
    const parsed = contactSchema.safeParse({
      name: "Bot",
      email: "bot@example.com",
      message: "Spam message long enough",
      website: "https://spam.example",
      startedAt: Date.now() - 5000,
    });
    assert.equal(parsed.success, true);
  });
});

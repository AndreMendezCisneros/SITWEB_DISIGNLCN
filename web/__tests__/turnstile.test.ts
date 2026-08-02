import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { verifyTurnstileToken } from "../src/lib/security/turnstile";

const originalFetch = globalThis.fetch;
const originalSecret = process.env.TURNSTILE_SECRET_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalSecret === undefined) {
    delete process.env.TURNSTILE_SECRET_KEY;
  } else {
    process.env.TURNSTILE_SECRET_KEY = originalSecret;
  }
});

describe("verifyTurnstileToken", () => {
  it("returns ok when Cloudflare siteverify succeeds", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })) as typeof fetch;

    const result = await verifyTurnstileToken("valid-token", "1.2.3.4");
    assert.equal(result.ok, true);
    assert.equal(result.skipped, undefined);
  });

  it("returns failure with error codes when siteverify fails", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          success: false,
          "error-codes": ["invalid-input-response"],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )) as typeof fetch;

    const result = await verifyTurnstileToken("bad-token");
    assert.equal(result.ok, false);
    assert.deepEqual(result.errorCodes, ["invalid-input-response"]);
  });

  it("rejects empty token when secret is configured", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    const result = await verifyTurnstileToken("");
    assert.equal(result.ok, false);
    assert.ok(result.errorCodes?.includes("missing-input-response"));
  });

  it("skips verification without secret outside production builds", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    // NODE_ENV en tests suele ser undefined/"test" (≠ production) → skip permitido
    const result = await verifyTurnstileToken("");
    assert.equal(result.ok, true);
    assert.equal(result.skipped, true);
  });
});

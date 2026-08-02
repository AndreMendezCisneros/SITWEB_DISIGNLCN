import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { enforceRateLimit } from "../src/lib/security/rate-limit";

describe("enforceRateLimit (memory fallback)", () => {
  it("allows under the limit and blocks after", async () => {
    const key = `test:${Date.now()}:${Math.random()}`;
    const first = await enforceRateLimit({ key, limit: 2, windowSec: 60 });
    const second = await enforceRateLimit({ key, limit: 2, windowSec: 60 });
    const third = await enforceRateLimit({ key, limit: 2, windowSec: 60 });
    assert.equal(first.allowed, true);
    assert.equal(second.allowed, true);
    assert.equal(third.allowed, false);
    assert.ok(third.retryAfter >= 1);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import { optimizeUpload } from "../src/lib/media/optimize-image";

describe("optimizeUpload", () => {
  it("converts a large PNG to smaller WebP", async () => {
    const png = await sharp({
      create: {
        width: 2400,
        height: 1600,
        channels: 3,
        background: { r: 20, g: 40, b: 80 },
      },
    })
      .png()
      .toBuffer();

    const result = await optimizeUpload(png, "image/png", "hero-banner.png");

    assert.equal(result.mimeType, "image/webp");
    assert.equal(result.extension, "webp");
    assert.equal(result.optimized, true);
    assert.ok((result.width ?? 0) <= 1920);
    assert.ok((result.height ?? 0) <= 1920);
    assert.ok(result.optimizedBytes < result.originalBytes);
    assert.equal(result.displayName, "hero-banner.webp");
  });

  it("leaves PDF untouched", async () => {
    const pdf = Buffer.from("%PDF-1.4 fake");
    const result = await optimizeUpload(pdf, "application/pdf", "doc.pdf");
    assert.equal(result.optimized, false);
    assert.equal(result.mimeType, "application/pdf");
    assert.equal(result.optimizedBytes, pdf.byteLength);
  });
});

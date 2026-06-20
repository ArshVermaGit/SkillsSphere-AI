import assert from "node:assert/strict";
import test from "node:test";

test("parseResume throws for unsupported file extension .xyz", async () => {
  const { parseResume } = await import("../parseResume.js");

  await assert.rejects(
    () => parseResume("/tmp/resume.xyz"),
    /Only PDF, DOCX, and TXT parsing is supported/,
  );
});

test("parseResume throws for unsupported file extension .rtf", async () => {
  const { parseResume } = await import("../parseResume.js");

  await assert.rejects(
    () => parseResume("/tmp/resume.rtf"),
    /Only PDF, DOCX, and TXT parsing is supported/,
  );
});

test("parseResume throws for empty string file path", async () => {
  const { parseResume } = await import("../parseResume.js");

  await assert.rejects(
    () => parseResume(""),
    /Only PDF, DOCX, and TXT parsing is supported/,
  );
});

test("parseResume throws for .jpg extension", async () => {
  const { parseResume } = await import("../parseResume.js");

  await assert.rejects(
    () => parseResume("/tmp/photo.jpg"),
    /Only PDF, DOCX, and TXT parsing is supported/,
  );
});

test("parseResume handles .txt extension case-insensitively", async () => {
  const { parseResume } = await import("../parseResume.js");

  // .TXT should also be supported (will fail due to missing file, not unsupported format)
  try {
    await parseResume("/tmp/resume.TXT");
    assert.fail("Should have thrown an error");
  } catch (err) {
    assert.ok(
      !/Only PDF, DOCX, and TXT parsing is supported/.test(err.message),
      "Extension .TXT should be recognized as a valid format",
    );
  }
});

test("parseResume handles .PDF extension case-insensitively", async () => {
  const { parseResume } = await import("../parseResume.js");

  // .PDF should also be supported (will throw "Unable to extract text" not "Only PDF...")
  try {
    await parseResume("/tmp/resume.PDF");
  } catch (err) {
    // Should not throw "Only PDF, DOCX, and TXT parsing is supported"
    assert.ok(!/Only PDF, DOCX, and TXT parsing is supported/.test(err.message));
  }
});

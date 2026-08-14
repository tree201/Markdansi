import { describe, expect, it } from "vitest";
import {
  bumpVersion,
  porcelainPaths,
  releaseChangelog,
  releaseInput,
  resolveVersion,
  unexpectedReleasePaths,
} from "../scripts/release.mjs";

describe("release helpers", () => {
  it("bumps semantic versions", () => {
    expect(bumpVersion("1.2.3", "patch")).toBe("1.2.4");
    expect(bumpVersion("1.2.3", "minor")).toBe("1.3.0");
    expect(bumpVersion("1.2.3", "major")).toBe("2.0.0");
  });

  it("accepts pnpm and direct release arguments", () => {
    expect(releaseInput(["node", "release.mjs", "--", "patch"])).toBe("patch");
    expect(releaseInput(["node", "release.mjs", "minor"])).toBe("minor");
  });

  it("extracts paths from git porcelain status entries", () => {
    expect(porcelainPaths(" M CHANGELOG.md\n?? scripts/release.mjs\n")).toEqual([
      "CHANGELOG.md",
      "scripts/release.mjs",
    ]);
  });

  it("allows release formatting to update only generated release files", () => {
    expect(unexpectedReleasePaths(["package.json", "CHANGELOG.md", "dist/index.js"])).toEqual([]);
    expect(unexpectedReleasePaths(["src/parser.ts", "test/render.test.ts"])).toEqual([
      "src/parser.ts",
      "test/render.test.ts",
    ]);
  });

  it("accepts explicit stable and prerelease versions", () => {
    expect(resolveVersion("0.4.2", "0.5.0")).toBe("0.5.0");
    expect(resolveVersion("0.4.2", "v0.5.0-beta.1")).toBe("0.5.0-beta.1");
  });

  it("rejects invalid and duplicate versions", () => {
    expect(() => resolveVersion("0.4.2", "next")).toThrow("invalid release version");
    expect(() => resolveVersion("0.4.2", "0.4.2")).toThrow("already current");
  });

  it("moves Unreleased entries into the requested release", () => {
    const source =
      "# Changelog\n\n## Unreleased\n\n- Add math.\n- Fix publishing.\n\n## 0.4.2 (2026-08-14)\n";
    expect(releaseChangelog(source, "0.4.3", "2026-08-14")).toBe(
      "# Changelog\n\n## Unreleased\n\n## 0.4.3 (2026-08-14)\n\n- Add math.\n- Fix publishing.\n\n## 0.4.2 (2026-08-14)\n",
    );
  });

  it("requires at least one Unreleased changelog entry", () => {
    expect(() => releaseChangelog("# Changelog\n\n## Unreleased\n", "0.4.3", "2026-08-14")).toThrow(
      "needs at least one Unreleased entry",
    );
  });
});

import sliceAnsi from "slice-ansi";
import stringWidth from "string-width";
import stripAnsi from "strip-ansi";

/**
 * Visible width of a string, ignoring ANSI escape codes.
 */
export function visibleWidth(text: string): number {
  return stringWidth(stripAnsi(text));
}

function foldLongToken(text: string, width: number): string[] {
  const parts: string[] = [];
  let remaining = text;
  while (visibleWidth(remaining) > width) {
    let part = sliceAnsi(remaining, 0, width);
    if (part === "") part = sliceAnsi(remaining, 0, width + 1);
    if (part === "") break;
    parts.push(part);
    remaining = sliceAnsi(remaining, visibleWidth(part));
  }
  if (remaining !== "") parts.push(remaining);
  return parts.length > 0 ? parts : [text];
}

/**
 * Wrap a single paragraph string into lines respecting visible width.
 * Prefers whitespace boundaries and safely folds longer tokens by terminal cells.
 */
export function wrapText(text: string, width: number, wrap: boolean): string[] {
  if (!wrap || width <= 0) return [text];
  const words = text.split(/(\s+)/).filter((w) => w.length > 0);
  const lines: string[] = [];
  let current = "";
  let currentWidth = 0;

  const trimEndSpaces = (s: string) => s.replace(/\s+$/, "");
  const replaceCurrent = (value: string) => {
    const parts = foldLongToken(value, width);
    lines.push(...parts.slice(0, -1));
    current = parts.at(-1) ?? "";
    currentWidth = visibleWidth(current);
  };

  const orphanPhraseTail = (s: string): string | null => {
    const trimmed = trimEndSpaces(s);
    const phrase = trimmed.match(/\b(with|in|on|of|to|for)\s+(a|an|the)$/i);
    if (phrase) {
      const preposition = phrase[1];
      const article = phrase[2];
      if (preposition && article) return `${preposition} ${article}`;
    }

    const single = trimmed.match(/\b(a|an|the|to|of|with|and|or|in|on|for)$/i);
    return single?.[1] ?? null;
  };

  for (const word of words) {
    const w = visibleWidth(word);
    if (current !== "" && currentWidth + w > width && !/^\s+$/.test(word)) {
      const nextWord = word.replace(/^\s+/, "");
      const currentNoTrail = trimEndSpaces(current);
      const tail = orphanPhraseTail(currentNoTrail);
      if (tail && currentNoTrail.length > tail.length) {
        const base = trimEndSpaces(currentNoTrail.slice(0, currentNoTrail.length - tail.length));
        if (base !== "") {
          lines.push(base);
          replaceCurrent(`${tail} ${nextWord}`);
          continue;
        }
      }

      lines.push(currentNoTrail);
      replaceCurrent(nextWord);
      continue;
    }
    current += word;
    currentWidth = visibleWidth(current);
    if (currentWidth > width && !/^\s+$/.test(word)) replaceCurrent(current);
  }

  if (current !== "") lines.push(trimEndSpaces(current));
  if (lines.length === 0) lines.push("");
  return lines;
}

export function wrapWithPrefix(text: string, width: number, wrap: boolean, prefix = ""): string[] {
  if (!wrap) return text.split("\n").map((line) => prefix + line);
  const out: string[] = [];
  const w = Math.max(1, width - visibleWidth(prefix));
  for (const line of text.split("\n")) {
    const parts = wrapText(line, w, wrap);
    for (const p of parts) out.push(prefix + p);
  }
  return out;
}

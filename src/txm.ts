import { createRequire } from "node:module";

import { convertLatexToUnicode } from "./latex.js";

type Txm = {
  render_latex(latex: string): string;
};

const require = createRequire(import.meta.url);
const txm = require("./txm-wasm/txm.js") as Txm;

export function renderDisplayLatex(latex: string): string {
  try {
    return txm
      .render_latex(latex)
      .trimEnd()
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");
  } catch {
    return convertLatexToUnicode(latex);
  }
}

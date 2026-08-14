import { createRequire } from "node:module";
import { convertLatexToUnicode } from "./latex.js";
const require = createRequire(import.meta.url);
const txm = require("./txm-wasm/txm.js");
export function renderDisplayLatex(latex) {
    try {
        return txm
            .render_latex(latex)
            .trimEnd()
            .split("\n")
            .map((line) => line.trimEnd())
            .join("\n");
    }
    catch {
        return convertLatexToUnicode(latex);
    }
}

const GREEK: Record<string, string> = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  varepsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  vartheta: "ϑ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  pi: "π",
  varpi: "ϖ",
  rho: "ρ",
  varrho: "ϱ",
  sigma: "σ",
  varsigma: "ς",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  varphi: "ϕ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  Gamma: "Γ",
  Delta: "Δ",
  Theta: "Θ",
  Lambda: "Λ",
  Xi: "Ξ",
  Pi: "Π",
  Sigma: "Σ",
  Upsilon: "Υ",
  Phi: "Φ",
  Psi: "Ψ",
  Omega: "Ω",
};

const SYMBOLS: Record<string, string> = {
  to: "→",
  rightarrow: "→",
  leftarrow: "←",
  leftrightarrow: "↔",
  mapsto: "↦",
  hookrightarrow: "↪",
  hookleftarrow: "↩",
  Rightarrow: "⇒",
  Leftarrow: "⇐",
  Leftrightarrow: "⇔",
  uparrow: "↑",
  downarrow: "↓",
  Updownarrow: "↕",
  times: "×",
  cdot: "·",
  circ: "∘",
  div: "÷",
  pm: "±",
  mp: "∓",
  cap: "∩",
  cup: "∪",
  wedge: "∧",
  vee: "∨",
  otimes: "⊗",
  oplus: "⊕",
  setminus: "\\",
  sqcap: "⊓",
  sqcup: "⊔",
  le: "≤",
  leq: "≤",
  ge: "≥",
  geq: "≥",
  ne: "≠",
  neq: "≠",
  equiv: "≡",
  approx: "≈",
  cong: "≅",
  sim: "∼",
  simeq: "≃",
  in: "∈",
  notin: "∉",
  ni: "∋",
  subset: "⊂",
  subseteq: "⊆",
  supset: "⊃",
  supseteq: "⊇",
  propto: "∝",
  perp: "⊥",
  parallel: "∥",
  ldots: "…",
  cdots: "⋯",
  vdots: "⋮",
  ddots: "⋱",
  square: "□",
  forall: "∀",
  exists: "∃",
  neg: "¬",
  emptyset: "∅",
  varnothing: "∅",
  aleph: "ℵ",
  hbar: "ℏ",
  ell: "ℓ",
  Re: "ℜ",
  Im: "ℑ",
  partial: "∂",
  nabla: "∇",
  infty: "∞",
  sum: "∑",
  prod: "∏",
  int: "∫",
  oint: "∮",
  bigcup: "⋃",
  bigcap: "⋂",
  bigoplus: "⨁",
  bigotimes: "⨂",
  coloneqq: "≔",
  coloneq: "≔",
  colonapprox: "∺",
  triangle: "△",
  triangleleft: "◁",
  triangleright: "▷",
  angle: "∠",
  measuredangle: "∡",
  sphericalangle: "∢",
  star: "⋆",
  ast: "∗",
  dagger: "†",
  ddagger: "‡",
  bullet: "•",
  diamond: "⋄",
  implies: "⟹",
  iff: "⟺",
  gets: "←",
  prime: "′",
  backprime: "‵",
  flat: "♭",
  natural: "♮",
  sharp: "♯",
  check: "✓",
  cross: "✗",
};

const MATHBB: Record<string, string> = {
  N: "ℕ",
  Z: "ℤ",
  Q: "ℚ",
  R: "ℝ",
  C: "ℂ",
  H: "ℍ",
  P: "ℙ",
};

const SUBSCRIPTS: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "₊",
  "-": "₋",
  "=": "₌",
  "(": "₍",
  ")": "₎",
  a: "ₐ",
  e: "ₑ",
  h: "ₕ",
  i: "ᵢ",
  j: "ⱼ",
  k: "ₖ",
  l: "ₗ",
  m: "ₘ",
  n: "ₙ",
  o: "ₒ",
  p: "ₚ",
  r: "ᵣ",
  s: "ₛ",
  t: "ₜ",
  u: "ᵤ",
  v: "ᵥ",
  x: "ₓ",
};

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
  n: "ⁿ",
  i: "ⁱ",
};

function convertGroupToSubscript(content: string): string {
  const chars = [...content];
  if (chars.every((c) => c in SUBSCRIPTS)) {
    return chars.map((c) => SUBSCRIPTS[c]).join("");
  }
  return `(${content})`;
}

function convertGroupToSuperscript(content: string): string {
  const chars = [...content];
  if (chars.every((c) => c in SUPERSCRIPTS)) {
    return chars.map((c) => SUPERSCRIPTS[c]).join("");
  }
  return `(${content})`;
}

export function convertLatexToUnicode(latex: string): string {
  let s = latex;

  s = s.replace(/\\tag\{([^}]*)\}/g, (_m, tag: string) => `    (${tag})`);
  s = s.replace(/\\begin\{aligned\}/g, "");
  s = s.replace(/\\end\{aligned\}/g, "");
  s = s.replace(/\\begin\{cases\}/g, "");
  s = s.replace(/\\end\{cases\}/g, "");

  s = s.replace(/\\mathrm\{([^}]*)\}/g, "$1");
  s = s.replace(/\\mathit\{([^}]*)\}/g, "$1");
  s = s.replace(/\\mathbf\{([^}]*)\}/g, "$1");
  s = s.replace(/\\mathsf\{([^}]*)\}/g, "$1");
  s = s.replace(/\\mathtt\{([^}]*)\}/g, "$1");
  s = s.replace(/\\operatorname\{([^}]*)\}/g, "$1");
  s = s.replace(/\\text\{([^}]*)\}/g, "$1");
  s = s.replace(/\\textbf\{([^}]*)\}/g, "$1");
  s = s.replace(/\\textit\{([^}]*)\}/g, "$1");
  s = s.replace(/\\mathbb\{([^}]*)\}/g, (_m, c: string) => MATHBB[c] ?? c);

  s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_m, a: string, b: string) => `${a}/${b}`);
  s = s.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, (_m, a: string, b: string) => `${a}/${b}`);
  s = s.replace(/\\tfrac\{([^{}]*)\}\{([^{}]*)\}/g, (_m, a: string, b: string) => `${a}/${b}`);
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, (_m, c: string) => `√${c}`);
  s = s.replace(/\\overline\{([^{}]*)\}/g, (_m, c: string) => `${c}‾`);

  s = s.replace(/_\{([^{}]*)\}/g, (_m, c: string) => convertGroupToSubscript(c));
  s = s.replace(/_([a-zA-Z0-9])/g, (_m, c: string) => SUBSCRIPTS[c] ?? `_${c}`);
  s = s.replace(/\^\{([^{}]*)\}/g, (_m, c: string) => convertGroupToSuperscript(c));
  s = s.replace(/\^([a-zA-Z0-9])/g, (_m, c: string) => SUPERSCRIPTS[c] ?? `^${c}`);

  s = s.replace(/\\([a-zA-Z]+)/g, (full, name: string) => {
    if (name in GREEK) return GREEK[name] ?? full;
    if (name in SYMBOLS) return SYMBOLS[name] ?? full;
    return full;
  });

  s = s.replace(/\\\\/g, "\n");
  s = s.replace(/\\,/g, " ");
  s = s.replace(/\\;/g, " ");
  s = s.replace(/\\!/g, "");
  s = s.replace(/\\ /g, " ");
  s = s.replace(/\\quad/g, "  ");
  s = s.replace(/\\qquad/g, "    ");
  s = s.replace(/\\:/g, " ");
  s = s.replace(/\\left\(/g, "(");
  s = s.replace(/\\right\)/g, ")");
  s = s.replace(/\\left\[/g, "[");
  s = s.replace(/\\right\]/g, "]");
  s = s.replace(/\\left\{/g, "{");
  s = s.replace(/\\right\}/g, "}");
  s = s.replace(/\\left\|/g, "|");
  s = s.replace(/\\right\|/g, "|");
  s = s.replace(/\\bigl\(/g, "(");
  s = s.replace(/\\bigr\)/g, ")");
  s = s.replace(/\\Bigl\(/g, "(");
  s = s.replace(/\\Bigr\)/g, ")");
  s = s.replace(/\\bigl\[/g, "[");
  s = s.replace(/\\bigr\]/g, "]");
  s = s.replace(/\\big\b/g, "");
  s = s.replace(/\\Big\b/g, "");
  s = s.replace(/\\displaystyle/g, "");
  s = s.replace(/\\limits/g, "");
  s = s.replace(/\\textstyle/g, "");
  s = s.replace(/\\scriptstyle/g, "");
  s = s.replace(/\\\{/g, "{");
  s = s.replace(/\\\}/g, "}");
  s = s.replace(/\\%/g, "%");
  s = s.replace(/\\&/g, "&");
  s = s.replace(/\\#/g, "#");
  s = s.replace(/\\_/g, "_");

  return s.trim();
}

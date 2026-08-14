import { Chalk } from "chalk";
const base = {
    heading: { color: "yellow", bold: true },
    strong: { bold: true },
    emph: { italic: true },
    inlineCode: { color: "cyan" },
    blockCode: { color: "green" },
    link: { color: "blue", underline: true },
    quote: { dim: true },
    hr: { dim: true },
    listMarker: { color: "cyan" },
    tableHeader: { bold: true, color: "yellow" },
    tableCell: {},
    math: { color: "green" },
};
const dim = {
    ...base,
    heading: { color: "white", bold: true, dim: true },
    link: { color: "blue", underline: true, dim: true },
};
const bright = {
    ...base,
    heading: { color: "magenta", bold: true },
    link: { color: "cyan", underline: true },
    inlineCode: { color: "green" },
    blockCode: { color: "green" },
};
const solarized = {
    heading: { color: "yellow", bold: true },
    strong: { bold: true },
    emph: { italic: true },
    inlineCode: { color: "cyan" },
    blockCode: { color: "#2aa198" },
    link: { color: "blue", underline: true },
    quote: { color: "white", dim: true },
    hr: { color: "white", dim: true },
    listMarker: { color: "cyan" },
    tableHeader: { color: "yellow", bold: true },
};
const monochrome = {
    heading: { bold: true },
    strong: { bold: true },
    emph: { italic: true },
    inlineCode: { dim: true },
    blockCode: { dim: true },
    link: { underline: true },
    quote: { dim: true },
    hr: { dim: true },
    listMarker: { dim: true },
    tableHeader: { bold: true },
};
const contrast = {
    heading: { color: "magenta", bold: true },
    strong: { color: "white", bold: true },
    emph: { color: "white", italic: true },
    inlineCode: { color: "cyan", bold: true },
    blockCode: { color: "green", bold: true },
    link: { color: "blue", underline: true },
    quote: { color: "white", dim: true },
    hr: { color: "white", dim: true },
    listMarker: { color: "yellow", bold: true },
    tableHeader: { color: "yellow", bold: true },
    tableCell: { color: "white" },
};
export const themes = {
    default: Object.freeze(base),
    dim: Object.freeze(dim),
    bright: Object.freeze(bright),
    solarized: Object.freeze(solarized),
    monochrome: Object.freeze(monochrome),
    contrast: Object.freeze(contrast),
};
function applyColor(fn, color, background = false) {
    if (color.startsWith("#"))
        return background ? fn.bgHex(color) : fn.hex(color);
    if (/^\d+$/.test(color)) {
        const index = Number(color);
        if (index <= 255)
            return background ? fn.bgAnsi256(index) : fn.ansi256(index);
        return fn;
    }
    const name = background && !color.startsWith("bg") ? `bg${color[0]?.toUpperCase()}${color.slice(1)}` : color;
    const indexed = fn;
    return indexed[name] ?? fn;
}
/**
 * Create a Chalk-based styling helper that applies StyleIntent safely.
 */
export function createStyler({ color }) {
    const level = color ? 3 : 0;
    const chalk = new Chalk({ level });
    const apply = (text, style = {}) => {
        if (!color)
            return text;
        let fn = chalk;
        if (style.color)
            fn = applyColor(fn, style.color);
        if (style.bgColor)
            fn = applyColor(fn, style.bgColor, true);
        if (style.bold)
            fn = fn.bold;
        if (style.italic)
            fn = fn.italic;
        if (style.underline)
            fn = fn.underline;
        if (style.dim)
            fn = fn.dim;
        if (style.strike)
            fn = fn.strikethrough;
        return fn(text);
    };
    return apply;
}

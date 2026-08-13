import type { StyleIntent, Theme, ThemeName } from "./types.js";
export type Themes = Record<ThemeName, Theme> & Record<string, Theme>;
export declare const themes: Themes;
export type Styler = (text: string, style?: StyleIntent) => string;
/**
 * Create a Chalk-based styling helper that applies StyleIntent safely.
 */
export declare function createStyler({ color }: {
    color: boolean;
}): Styler;

/**
 * Visible width of a string, ignoring ANSI escape codes.
 */
export declare function visibleWidth(text: string): number;
/**
 * Wrap a single paragraph string into lines respecting visible width.
 * Prefers whitespace boundaries and safely folds longer tokens by terminal cells.
 */
export declare function wrapText(text: string, width: number, wrap: boolean): string[];
export declare function wrapWithPrefix(text: string, width: number, wrap: boolean, prefix?: string): string[];

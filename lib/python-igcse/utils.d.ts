import { ParserState } from './types';
/**
 * Converts Python comparison and logical operators to IGCSE pseudocode equivalents.
 * @param condition The Python condition string.
 * @returns The condition string with pseudocode operators.
 */
export declare const convertConditionOperators: (condition: string) => string;
/**
 * Gets the current indentation level based on the parser's state.
 * @param state The current parser state.
 * @returns A string of spaces for the current indentation.
 */
export declare const getCurrentIndentation: (state: ParserState) => string;
/**
 * Calculates the indentation level of a given line.
 * @param line The code line.
 * @returns The number of leading spaces.
 */
export declare function getLineIndentationLevel(line: string): number;
/**
 * Extracts the leading whitespace from a line.
 * @param line The code line.
 * @returns The leading whitespace string.
 */
export declare const getLeadingWhitespace: (line: string) => string;
/**
 * Converts range end value for IGCSE pseudocode (subtracts 1 from numeric values).
 * @param value The range end value.
 * @returns The adjusted value for pseudocode.
 */
export declare const convertRangeEnd: (value: string) => string;

import { OPERATORS, INDENT_SIZE } from './constants';
import { ParserState } from './types';

/**
 * Converts Python comparison and logical operators to pseudocode equivalents.
 * @param condition The Python condition string.
 * @returns The condition string with pseudocode operators.
 */
export const convertConditionOperators = (condition: string): string => {
  if (!condition) return '';
  let result = condition;
  result = result.replace(/==/g, ` ${OPERATORS.EQ} `);
  result = result.replace(/!=/g, ` ${OPERATORS.NE} `);
  result = result.replace(/<=/g, ` ${OPERATORS.LE} `);
  result = result.replace(/>=/g, ` ${OPERATORS.GE} `);
  // Ensure that logical operators are surrounded by spaces to avoid conflicts with variable names
  result = result.replace(/\band\b/g, ` ${OPERATORS.AND} `);
  result = result.replace(/\bor\b/g, ` ${OPERATORS.OR} `);
  result = result.replace(/\bnot\b/g, ` ${OPERATORS.NOT} `);
  result = result.replace(/\/\//g, ` ${OPERATORS.DIV} `); // Python integer division
  result = result.replace(/%/g, ` ${OPERATORS.MOD} `);      // Python modulo
  // Replace multiple spaces with a single space and then trim
  return result.replace(/\s+/g, ' ').trim();
};

/**
 * Gets the current indentation level based on the parser's state.
 * @param state The current parser state.
 * @returns A string of spaces for the current indentation.
 */
export const getCurrentIndentation = (state: ParserState): string => {
  return ' '.repeat((state.indentationLevels.length - 1) * INDENT_SIZE);
};

/**
 * Calculates the indentation level of a given line.
 * @param line The code line.
 * @returns The number of leading spaces.
 */
export const getLineIndentationLevel = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
};

/**
 * Extracts the leading whitespace from a line.
 * @param line The code line.
 * @returns The leading whitespace string.
 */
export const getLeadingWhitespace = (line: string): string => {
  const match = line.match(/^(\s*)/);
  return match ? match[1] : '';
};
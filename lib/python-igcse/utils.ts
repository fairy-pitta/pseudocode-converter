import { OPERATORS, INDENT_SIZE } from './constants';
import { ParserState } from './types';

/**
 * Converts Python comparison and logical operators to IGCSE pseudocode equivalents.
 * @param condition The Python condition string.
 * @returns The condition string with pseudocode operators.
 */
export const convertConditionOperators = (condition: string): string => {
  let result = condition;
  
  // Replace comparison operators
  result = result.replace(/==/g, ` ${OPERATORS.EQ} `);
  result = result.replace(/!=/g, ` ${OPERATORS.NE} `);
  result = result.replace(/<=/g, ` ${OPERATORS.LE} `);
  result = result.replace(/>=/g, ` ${OPERATORS.GE} `);
  result = result.replace(/\band\b/gi, ` ${OPERATORS.AND} `);
  result = result.replace(/\bor\b/gi, ` ${OPERATORS.OR} `);
  result = result.replace(/\bnot\b/gi, ` ${OPERATORS.NOT} `);
  
  // Replace Boolean values
  result = result.replace(/\bTrue\b/g, 'TRUE');
  result = result.replace(/\bFalse\b/g, 'FALSE');
  
  // Replace arithmetic operators
  result = result.replace(/\*\*/g, ` ${OPERATORS.POW} `);
  result = result.replace(/\/\//g, ` ${OPERATORS.DIV} `);
  result = result.replace(/%/g, ` ${OPERATORS.MOD} `);
  
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

/**
 * Converts range end value for IGCSE pseudocode (subtracts 1 from numeric values).
 * @param value The range end value.
 * @returns The adjusted value for pseudocode.
 */
export const convertRangeEnd = (value: string): string => {
  const num = Number(value);
  return Number.isFinite(num) ? String(num - 1) : `${value} - 1`;
};
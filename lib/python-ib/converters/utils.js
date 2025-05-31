"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadingWhitespace = exports.getLineIndentationLevel = exports.getCurrentIndentation = exports.convertConditionOperators = void 0;
const constants_1 = require("./constants");
/**
 * Converts Python comparison and logical operators to pseudocode equivalents.
 * @param condition The Python condition string.
 * @returns The condition string with pseudocode operators.
 */
const convertConditionOperators = (condition) => {
    if (!condition)
        return '';
    let result = condition;
    result = result.replace(/==/g, ` ${constants_1.OPERATORS.EQ} `);
    result = result.replace(/!=/g, ` ${constants_1.OPERATORS.NE} `);
    result = result.replace(/<=/g, ` ${constants_1.OPERATORS.LE} `);
    result = result.replace(/>=/g, ` ${constants_1.OPERATORS.GE} `);
    // Ensure that logical operators are surrounded by spaces to avoid conflicts with variable names
    result = result.replace(/\band\b/g, ` ${constants_1.OPERATORS.AND} `);
    result = result.replace(/\bor\b/g, ` ${constants_1.OPERATORS.OR} `);
    result = result.replace(/\bnot\b/g, ` ${constants_1.OPERATORS.NOT} `);
    result = result.replace(/\/\//g, ` ${constants_1.OPERATORS.DIV} `); // Python integer division
    result = result.replace(/%/g, ` ${constants_1.OPERATORS.MOD} `); // Python modulo
    // Replace multiple spaces with a single space and then trim
    return result.replace(/\s+/g, ' ').trim();
};
exports.convertConditionOperators = convertConditionOperators;
/**
 * Gets the current indentation level based on the parser's state.
 * @param state The current parser state.
 * @returns A string of spaces for the current indentation.
 */
const getCurrentIndentation = (state) => {
    return ' '.repeat((state.indentationLevels.length - 1) * constants_1.INDENT_SIZE);
};
exports.getCurrentIndentation = getCurrentIndentation;
/**
 * Calculates the indentation level of a given line.
 * @param line The code line.
 * @returns The number of leading spaces.
 */
const getLineIndentationLevel = (line) => {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
};
exports.getLineIndentationLevel = getLineIndentationLevel;
/**
 * Extracts the leading whitespace from a line.
 * @param line The code line.
 * @returns The leading whitespace string.
 */
const getLeadingWhitespace = (line) => {
    const match = line.match(/^(\s*)/);
    return match ? match[1] : '';
};
exports.getLeadingWhitespace = getLeadingWhitespace;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertRangeEnd = exports.getLeadingWhitespace = exports.getCurrentIndentation = exports.convertConditionOperators = void 0;
exports.getLineIndentationLevel = getLineIndentationLevel;
const constants_1 = require("./constants");
/**
 * Converts Python comparison and logical operators to IGCSE pseudocode equivalents.
 * @param condition The Python condition string.
 * @returns The condition string with pseudocode operators.
 */
const convertConditionOperators = (condition) => {
    let result = condition;
    // Replace comparison operators
    result = result.replace(/==/g, ` ${constants_1.OPERATORS.EQ} `);
    result = result.replace(/!=/g, ` ${constants_1.OPERATORS.NE} `);
    result = result.replace(/<=/g, ` ${constants_1.OPERATORS.LE} `);
    result = result.replace(/>=/g, ` ${constants_1.OPERATORS.GE} `);
    result = result.replace(/\band\b/gi, ` ${constants_1.OPERATORS.AND} `);
    result = result.replace(/\bor\b/gi, ` ${constants_1.OPERATORS.OR} `);
    result = result.replace(/\bnot\b/gi, ` ${constants_1.OPERATORS.NOT} `);
    // Replace Boolean values
    result = result.replace(/\bTrue\b/g, 'TRUE');
    result = result.replace(/\bFalse\b/g, 'FALSE');
    // Replace arithmetic operators
    result = result.replace(/\*\*/g, ` ${constants_1.OPERATORS.POW} `);
    result = result.replace(/\/\//g, ` ${constants_1.OPERATORS.DIV} `);
    result = result.replace(/%/g, ` ${constants_1.OPERATORS.MOD} `);
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
function getLineIndentationLevel(line) {
    const match = line.match(/^(\s*)/);
    if (match) {
        return match[1].length / constants_1.PYTHON_INDENT_SIZE;
    }
    return 0;
}
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
/**
 * Converts range end value for IGCSE pseudocode (subtracts 1 from numeric values).
 * @param value The range end value.
 * @returns The adjusted value for pseudocode.
 */
const convertRangeEnd = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? String(num - 1) : `${value} - 1`;
};
exports.convertRangeEnd = convertRangeEnd;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertRangeEnd = exports.getLeadingWhitespace = exports.getLineIndentationLevel = exports.getCurrentIndentation = exports.convertConditionOperators = void 0;
var constants_1 = require("./constants");
/**
 * Converts Python comparison and logical operators to IGCSE pseudocode equivalents.
 * @param condition The Python condition string.
 * @returns The condition string with pseudocode operators.
 */
var convertConditionOperators = function (condition) {
    var result = condition;
    // Replace comparison operators
    result = result.replace(/==/g, " ".concat(constants_1.OPERATORS.EQ, " "));
    result = result.replace(/!=/g, " ".concat(constants_1.OPERATORS.NE, " "));
    result = result.replace(/<=/g, " ".concat(constants_1.OPERATORS.LE, " "));
    result = result.replace(/>=/g, " ".concat(constants_1.OPERATORS.GE, " "));
    result = result.replace(/\band\b/gi, " ".concat(constants_1.OPERATORS.AND, " "));
    result = result.replace(/\bor\b/gi, " ".concat(constants_1.OPERATORS.OR, " "));
    result = result.replace(/\bnot\b/gi, " ".concat(constants_1.OPERATORS.NOT, " "));
    // Replace Boolean values
    result = result.replace(/\bTrue\b/g, 'TRUE');
    result = result.replace(/\bFalse\b/g, 'FALSE');
    // Replace arithmetic operators
    result = result.replace(/\*\*/g, " ".concat(constants_1.OPERATORS.POW, " "));
    result = result.replace(/\/\//g, " ".concat(constants_1.OPERATORS.DIV, " "));
    result = result.replace(/%/g, " ".concat(constants_1.OPERATORS.MOD, " "));
    // Replace multiple spaces with a single space and then trim
    return result.replace(/\s+/g, ' ').trim();
};
exports.convertConditionOperators = convertConditionOperators;
/**
 * Gets the current indentation level based on the parser's state.
 * @param state The current parser state.
 * @returns A string of spaces for the current indentation.
 */
var getCurrentIndentation = function (state) {
    return ' '.repeat((state.indentationLevels.length - 1) * constants_1.INDENT_SIZE);
};
exports.getCurrentIndentation = getCurrentIndentation;
/**
 * Calculates the indentation level of a given line.
 * @param line The code line.
 * @returns The number of leading spaces.
 */
var getLineIndentationLevel = function (line) {
    var match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
};
exports.getLineIndentationLevel = getLineIndentationLevel;
/**
 * Extracts the leading whitespace from a line.
 * @param line The code line.
 * @returns The leading whitespace string.
 */
var getLeadingWhitespace = function (line) {
    var match = line.match(/^(\s*)/);
    return match ? match[1] : '';
};
exports.getLeadingWhitespace = getLeadingWhitespace;
/**
 * Converts range end value for IGCSE pseudocode (subtracts 1 from numeric values).
 * @param value The range end value.
 * @returns The adjusted value for pseudocode.
 */
var convertRangeEnd = function (value) {
    var num = Number(value);
    return Number.isFinite(num) ? String(num - 1) : "".concat(value, " - 1");
};
exports.convertRangeEnd = convertRangeEnd;

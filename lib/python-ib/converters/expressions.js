"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionConverters = exports.convertStandaloneExpression = exports.convertReturn = exports.convertPrint = exports.convertCompoundAssignment = exports.convertAssignment = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const convertAssignment = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1].trim();
    let value = match[2].trim();
    // Handle input separately if it's part of the assignment
    const inputMatch = value.match(/^input(?:\((?:\"(.*)\"|'(.*)')?\))?/);
    if (inputMatch) {
        return { convertedLine: `${indentation}${constants_1.KEYWORDS.INPUT} ${variable}`, blockType: null };
    }
    value = (0, utils_1.convertConditionOperators)(value);
    return { convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${value}`, blockType: null };
};
exports.convertAssignment = convertAssignment;
const convertCompoundAssignment = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.COMPOUND_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1].trim();
    const operator = match[2];
    let value = match[3].trim();
    value = (0, utils_1.convertConditionOperators)(value); // Apply operator conversion to the value
    const opMapping = constants_1.COMPOUND_ASSIGNMENT_OPERATORS.find(op => op.python === operator);
    if (opMapping) {
        return { convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${variable} ${opMapping.pseudocode} ${value}`, blockType: null };
    }
    // Fallback if operator not in map (should not happen with current regex)
    // Ensure the fallback still uses the assignment operator for pseudocode consistency
    return { convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${variable} ${operator} ${value}`, blockType: null };
};
exports.convertCompoundAssignment = convertCompoundAssignment;
const convertPrint = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.PRINT);
    if (!match)
        return { convertedLine: line, blockType: null };
    let content = match[1].trim();
    // Check if the content is an f-string
    const fStringMatch = content.match(/^f(['"])(.*)\1$/);
    if (fStringMatch) {
        const innerContent = fStringMatch[2];
        // Split by {variable} syntax, keeping the delimiters
        const parts = innerContent.split(/({[^}]+})/g);
        let newContent = '';
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part.startsWith('{') && part.endsWith('}')) {
                const variableName = part.substring(1, part.length - 1);
                if (newContent)
                    newContent += ` ${constants_1.OPERATORS.CONCAT} `;
                newContent += variableName;
            }
            else if (part) { // Non-empty string part
                if (newContent)
                    newContent += ` ${constants_1.OPERATORS.CONCAT} `;
                // Ensure all string parts are correctly quoted
                newContent += `"${part.replace(/"/g, '\"')}"`;
            }
        }
        content = newContent;
    }
    else {
        // For non-f-strings, apply existing operator conversion
        content = (0, utils_1.convertConditionOperators)(content);
    }
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.OUTPUT} ${content}`, blockType: null };
};
exports.convertPrint = convertPrint;
const convertReturn = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.RETURN);
    if (!match)
        return { convertedLine: line, blockType: null };
    const value = match[1] ? (0, utils_1.convertConditionOperators)(match[1].trim()) : '';
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.RETURN}${value ? ' ' + value : ''}`, blockType: null };
};
exports.convertReturn = convertReturn;
const convertStandaloneExpression = (line, indentation, state) => {
    // This is a simple pass-through for now, assuming it's a procedure call.
    // More sophisticated handling might be needed for other standalone expressions.
    if (patterns_1.PATTERNS.STANDALONE_EXPRESSION.test(line.trim())) {
        return { convertedLine: `${indentation}${line.trim()}`, blockType: null };
    }
    return { convertedLine: line, blockType: null };
};
exports.convertStandaloneExpression = convertStandaloneExpression;
exports.expressionConverters = {
    convertAssignment: exports.convertAssignment,
    convertCompoundAssignment: exports.convertCompoundAssignment,
    convertPrint: exports.convertPrint,
    convertReturn: exports.convertReturn,
    convertStandaloneExpression: exports.convertStandaloneExpression,
};

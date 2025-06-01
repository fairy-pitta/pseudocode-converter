"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertListAssignment = exports.convertListAccess = exports.convertListDeclaration = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
// Handle list declarations like: numbers = [1, 2, 3, 4, 5]
const convertListDeclaration = (line, indentation, state) => {
    const match = line.match(/^([A-Za-z_]\w*)\s*=\s*\[(.*)\]$/);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1].trim();
    const content = match[2].trim();
    // Handle empty list - return null to skip output
    if (!content) {
        return null;
    }
    // Parse list elements
    const elements = content.split(',').map(elem => elem.trim());
    const result = [];
    // Convert each element to array assignment
    elements.forEach((element, index) => {
        let convertedElement = element;
        // Convert Python boolean values
        if (element === 'True') {
            convertedElement = 'TRUE';
        }
        else if (element === 'False') {
            convertedElement = 'FALSE';
        }
        else if (!isNaN(Number(element)) && !element.includes('"') && !element.includes("'")) {
            // Keep numbers as numbers for IGCSE
            convertedElement = element;
        }
        convertedElement = (0, utils_1.convertConditionOperators)(convertedElement);
        result.push(`${indentation}${variable}[${index}] ${constants_1.OPERATORS.ASSIGN} ${convertedElement}`);
    });
    // Track variable for potential future use
    if (!state.declarations.has(variable)) {
        state.declarations.add(variable);
    }
    return {
        convertedLine: result.join('\n'),
        blockType: null
    };
};
exports.convertListDeclaration = convertListDeclaration;
// Handle list access like: first = numbers[0]
const convertListAccess = (line, indentation, state) => {
    const match = line.match(/^([A-Za-z_]\w*)\s*=\s*([A-Za-z_]\w*)\[(\d+)\]\s*$/);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1].trim();
    const arrayName = match[2].trim();
    const index = match[3].trim();
    // Track variable for potential future use
    if (!state.declarations.has(variable)) {
        state.declarations.add(variable);
    }
    return {
        convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${arrayName}[${index}]`,
        blockType: null
    };
};
exports.convertListAccess = convertListAccess;
// Handle list assignment like: numbers[1] = 10
const convertListAssignment = (line, indentation, state) => {
    const match = line.match(/^([A-Za-z_]\w*)\[(\d+)\]\s*=\s*(.+)$/);
    if (!match)
        return { convertedLine: line, blockType: null };
    const arrayName = match[1].trim();
    const index = match[2].trim();
    let value = match[3].trim();
    value = (0, utils_1.convertConditionOperators)(value);
    return {
        convertedLine: `${indentation}${arrayName}[${index}] ${constants_1.OPERATORS.ASSIGN} ${value}`,
        blockType: null
    };
};
exports.convertListAssignment = convertListAssignment;

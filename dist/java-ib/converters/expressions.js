"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSystemOutPrintln = convertSystemOutPrintln;
exports.convertLogicalOperation = convertLogicalOperation;
exports.convertStringAssignment = convertStringAssignment;
exports.convertIncrement = convertIncrement;
exports.convertDecrement = convertDecrement;
const patterns_1 = require("../patterns");
const utils_1 = require("../utils");
function convertSystemOutPrintln(line) {
    const match = line.match(patterns_1.SYSTEM_OUT_PRINTLN);
    if (!match)
        return null;
    const content = match[1].trim();
    return `output ${(0, utils_1.toIBPseudocode)(content)}`;
}
function convertLogicalOperation(line) {
    // Try binary operation first
    const binaryMatch = line.match(patterns_1.LOGICAL_OPERATION_BINARY);
    if (binaryMatch) {
        const variableName = binaryMatch[1].trim();
        const leftOperand = binaryMatch[2].trim();
        const operator = binaryMatch[3].trim();
        const rightOperand = binaryMatch[4].trim();
        const ibOperator = operator === '&&' ? 'AND' : 'OR';
        return `${variableName.toUpperCase()} ← ${(0, utils_1.toIBPseudocode)(leftOperand)} ${ibOperator} ${(0, utils_1.toIBPseudocode)(rightOperand)}`;
    }
    // Then try unary NOT
    const unaryMatch = line.match(patterns_1.LOGICAL_OPERATION_UNARY_NOT);
    if (unaryMatch) {
        const variableName = unaryMatch[1].trim();
        const operand = unaryMatch[2].trim();
        return `${variableName.toUpperCase()} ← NOT ${(0, utils_1.toIBPseudocode)(operand)}`;
    }
    return null;
}
function convertStringAssignment(line) {
    const match = line.match(patterns_1.STRING_ASSIGNMENT);
    if (!match)
        return null;
    const variableName = match[1].trim();
    const value = match[2].trim();
    return `${variableName.toUpperCase()} ← ${(0, utils_1.toIBPseudocode)(value)}`;
}
function convertIncrement(line) {
    const match = line.match(patterns_1.INCREMENT);
    if (!match)
        return null;
    const variableName = match[1].trim();
    return `${variableName.toUpperCase()} ← ${variableName.toUpperCase()} + 1`;
}
function convertDecrement(line) {
    const match = line.match(patterns_1.DECREMENT);
    if (!match)
        return null;
    const variableName = match[1].trim();
    return `${variableName.toUpperCase()} ← ${variableName.toUpperCase()} - 1`;
}

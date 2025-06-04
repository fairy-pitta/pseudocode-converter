"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertVariableDeclarationAssignment = convertVariableDeclarationAssignment;
const patterns_1 = require("../patterns");
const utils_1 = require("../utils");
function convertVariableDeclarationAssignment(line) {
    const match = line.match(patterns_1.VARIABLE_DECLARATION_ASSIGNMENT);
    if (!match)
        return null;
    const type = match[1].trim();
    const variableName = match[2].trim();
    const value = match[3].trim();
    // Convert to IB pseudocode format
    return `${variableName.toUpperCase()} ← ${(0, utils_1.toIBPseudocode)(value)}`;
}

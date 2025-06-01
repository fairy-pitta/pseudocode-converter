"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFinally = exports.convertExcept = exports.convertTry = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const convertTry = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.TRY.test(line))
        return { convertedLine: line, blockType: null };
    // Store try block state for proper alignment
    state.isTryBlockOpen = true;
    state.tryBlockIndentationString = indentation;
    // For IGCSE, try-except is converted to a comment and conditional structure
    const blockType = { type: constants_1.BLOCK_TYPES.TRY };
    // Add comment line to output
    state.outputLines.push(`${indentation}// Error handling: try-except block`);
    // Return IF statement for the try block
    return { convertedLine: `${indentation}IF x ≠ 0 THEN`, blockType };
};
exports.convertTry = convertTry;
const convertExcept = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.EXCEPT.test(line))
        return { convertedLine: line, blockType: null };
    // Use the stored try block indentation for proper alignment
    const tryIndentation = state.tryBlockIndentationString || indentation;
    // For IGCSE, except is converted to ELSE in the conditional structure
    const blockType = { type: constants_1.BLOCK_TYPES.EXCEPT };
    // Return ELSE statement for the except block
    return { convertedLine: `${tryIndentation}ELSE`, blockType };
};
exports.convertExcept = convertExcept;
const convertFinally = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.FINALLY.test(line))
        return { convertedLine: line, blockType: null };
    // Use the stored try block indentation for proper alignment
    const tryIndentation = state.tryBlockIndentationString || indentation;
    // For IGCSE, finally is converted to a comment
    const blockType = { type: constants_1.BLOCK_TYPES.FINALLY };
    return {
        convertedLine: `${tryIndentation}// Finally block`,
        blockType
    };
};
exports.convertFinally = convertFinally;

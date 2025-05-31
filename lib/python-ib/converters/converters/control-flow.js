"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlFlowConverters = exports.convertFinally = exports.convertExcept = exports.convertTry = exports.convertRepeat = exports.convertWhile = exports.convertForCollection = exports.convertForRange = exports.convertElse = exports.convertElif = exports.convertIf = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const convertIf = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.IF);
    if (!match)
        return { convertedLine: line, blockType: null };
    const condition = (0, utils_1.convertConditionOperators)(match[1].trim()); // Ensure condition itself is trimmed before use
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.IF} ${condition} ${constants_1.KEYWORDS.THEN}`, blockType: constants_1.BLOCK_TYPES.IF };
};
exports.convertIf = convertIf;
const convertElif = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.ELIF);
    if (!match)
        return { convertedLine: line, blockType: null };
    const condition = (0, utils_1.convertConditionOperators)(match[1]);
    // ELIF needs to correctly close the previous IF/ELIF before opening a new one at the same indent level.
    // This is handled by the main parser logic by comparing current indentation with the stack.
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.ELSE_IF} ${condition} ${constants_1.KEYWORDS.THEN}`, blockType: constants_1.BLOCK_TYPES.ELIF };
};
exports.convertElif = convertElif;
const convertElse = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.ELSE.test(line))
        return { convertedLine: line, blockType: null };
    // ELSE needs to correctly close the previous IF/ELIF before opening at the same indent level.
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.ELSE}`, blockType: constants_1.BLOCK_TYPES.ELSE };
};
exports.convertElse = convertElse;
const convertForRange = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.FOR_RANGE);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1];
    const rangeArgs = match[2].split(',').map(arg => arg.trim());
    let start = '0';
    let end;
    // let step = '1'; // Step is not directly supported in IB 'loop from to' syntax
    if (rangeArgs.length === 1) {
        end = `${parseInt(rangeArgs[0]) - 1}`;
    }
    else if (rangeArgs.length >= 2) {
        start = rangeArgs[0];
        end = `${parseInt(rangeArgs[1]) - 1}`;
        // if (rangeArgs.length === 3) step = rangeArgs[2];
    }
    if (end === undefined)
        return { convertedLine: line, blockType: null }; // Invalid range
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.FOR} ${variable} ${constants_1.KEYWORDS.FROM} ${start} ${constants_1.KEYWORDS.TO} ${end}`, blockType: constants_1.BLOCK_TYPES.FOR };
};
exports.convertForRange = convertForRange;
const convertForCollection = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.FOR_COLLECTION);
    if (!match)
        return { convertedLine: line, blockType: null };
    const itemVariable = match[1];
    const collectionVariable = match[2];
    const resetLine = `${indentation}${collectionVariable}${constants_1.KEYWORDS.RESET_NEXT}`;
    const loopLine = `${indentation}${constants_1.KEYWORDS.FOR} ${constants_1.KEYWORDS.WHILE} ${collectionVariable}${constants_1.KEYWORDS.HAS_NEXT}`;
    const getNextLine = `${indentation}    ${itemVariable} ${constants_1.OPERATORS.ASSIGN} ${collectionVariable}${constants_1.KEYWORDS.GET_NEXT}`;
    // Add these lines directly to output and then return an empty line to signify the block start
    state.outputLines.push(resetLine);
    state.outputLines.push(loopLine);
    state.outputLines.push(getNextLine);
    return { convertedLine: "", blockType: constants_1.BLOCK_TYPES.FOR, skipClose: false }; // skipClose is false as the main loop will handle it.
};
exports.convertForCollection = convertForCollection;
const convertWhile = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.WHILE);
    if (!match)
        return { convertedLine: line, blockType: null };
    const condition = (0, utils_1.convertConditionOperators)(match[1]);
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.WHILE} ${condition} ${constants_1.KEYWORDS.DO}`, blockType: constants_1.BLOCK_TYPES.WHILE };
};
exports.convertWhile = convertWhile;
const convertRepeat = (line, indentation, state) => {
    // This converter looks for 'while True:' combined with a '# repeat' comment
    const isWhileTrue = patterns_1.PATTERNS.WHILE.test(line) && line.includes('True');
    const hasRepeatComment = patterns_1.PATTERNS.REPEAT_COMMENT.test(line);
    if (isWhileTrue && hasRepeatComment) {
        return { convertedLine: `${indentation}${constants_1.KEYWORDS.REPEAT}`, blockType: constants_1.BLOCK_TYPES.REPEAT };
    }
    return { convertedLine: line, blockType: null };
};
exports.convertRepeat = convertRepeat;
const convertTry = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.TRY.test(line))
        return { convertedLine: line, blockType: null };
    state.isTryBlockOpen = true;
    state.tryBlockIndentationString = indentation; // Store indentation of TRY block
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.TRY}`, blockType: constants_1.BLOCK_TYPES.TRY };
};
exports.convertTry = convertTry;
const convertExcept = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.EXCEPT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const exceptionType = match[1] ? ` ${match[1].trim()}` : '';
    // Use the stored try block indentation for proper alignment
    const tryIndentation = state.tryBlockIndentationString || '';
    return { convertedLine: `${tryIndentation}${constants_1.KEYWORDS.CATCH}${exceptionType}`, blockType: constants_1.BLOCK_TYPES.CATCH };
};
exports.convertExcept = convertExcept;
const convertFinally = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.FINALLY.test(line))
        return { convertedLine: line, blockType: null };
    // Use the stored try block indentation for proper alignment
    const tryIndentation = state.tryBlockIndentationString || '';
    return { convertedLine: `${tryIndentation}${constants_1.KEYWORDS.FINALLY}`, blockType: constants_1.BLOCK_TYPES.FINALLY };
};
exports.convertFinally = convertFinally;
exports.controlFlowConverters = {
    convertIf: exports.convertIf,
    convertElif: exports.convertElif,
    convertElse: exports.convertElse,
    convertForRange: exports.convertForRange,
    convertForCollection: exports.convertForCollection,
    convertWhile: exports.convertWhile,
    convertRepeat: exports.convertRepeat,
    convertTry: exports.convertTry,
    convertExcept: exports.convertExcept,
    convertFinally: exports.convertFinally,
};

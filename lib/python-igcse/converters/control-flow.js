"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlFlowConverters = exports.convertContinue = exports.convertBreak = exports.convertWhile = exports.convertForCollection = exports.convertForRange = exports.convertElse = exports.convertElif = exports.convertIf = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const convertIf = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.IF);
    if (!match)
        return { convertedLine: line, blockType: null };
    const condition = (0, utils_1.convertConditionOperators)(match[1].trim());
    const blockType = { type: constants_1.BLOCK_TYPES.IF };
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.IF} ${condition} ${constants_1.KEYWORDS.THEN}`,
        blockType
    };
};
exports.convertIf = convertIf;
const convertElif = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.ELIF);
    if (!match)
        return { convertedLine: line, blockType: null };
    const condition = (0, utils_1.convertConditionOperators)(match[1].trim());
    // For IGCSE, ELIF should be converted to ELSE IF
    const blockType = { type: constants_1.BLOCK_TYPES.ELIF };
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.ELSE_IF} ${condition} ${constants_1.KEYWORDS.THEN}`,
        blockType
    };
};
exports.convertElif = convertElif;
const convertElse = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.ELSE.test(line))
        return { convertedLine: line, blockType: null };
    // ELSE should be at the same level as the IF statement (no indentation for top-level if-else)
    const ifIndentation = '';
    const blockType = { type: constants_1.BLOCK_TYPES.ELSE };
    return {
        convertedLine: `${ifIndentation}${constants_1.KEYWORDS.ELSE}`,
        blockType
    };
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
    let step = '1';
    if (rangeArgs.length === 1) {
        end = (0, utils_1.convertRangeEnd)(rangeArgs[0]);
    }
    else if (rangeArgs.length >= 2) {
        start = rangeArgs[0];
        end = (0, utils_1.convertRangeEnd)(rangeArgs[1]);
        if (rangeArgs.length === 3) {
            step = rangeArgs[2];
        }
    }
    else {
        return { convertedLine: line, blockType: null };
    }
    const stepPart = step === '1' ? '' : ` ${constants_1.KEYWORDS.STEP} ${step}`;
    const blockType = { type: constants_1.BLOCK_TYPES.FOR, ident: variable };
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.FOR} ${variable} ${constants_1.OPERATORS.ASSIGN} ${start} ${constants_1.KEYWORDS.TO} ${end}${stepPart}`,
        blockType
    };
};
exports.convertForRange = convertForRange;
const convertForCollection = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.FOR_COLLECTION);
    if (!match || match[2].startsWith('range('))
        return { convertedLine: line, blockType: null };
    const itemVariable = match[1];
    const collectionVariable = match[2];
    const blockType = { type: constants_1.BLOCK_TYPES.FOR, ident: itemVariable };
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.FOR_EACH} ${itemVariable} ${constants_1.KEYWORDS.IN} ${collectionVariable}`,
        blockType
    };
};
exports.convertForCollection = convertForCollection;
const convertWhile = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.WHILE);
    if (!match)
        return { convertedLine: line, blockType: null };
    const condition = (0, utils_1.convertConditionOperators)(match[1]);
    const blockType = { type: constants_1.BLOCK_TYPES.WHILE };
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.WHILE} ${condition}`,
        blockType
    };
};
exports.convertWhile = convertWhile;
const convertBreak = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.BREAK.test(line))
        return { convertedLine: line, blockType: null };
    // Find the current loop type to determine the correct break statement
    const currentLoop = state.currentBlockTypes.slice().reverse().find(block => block.type === constants_1.BLOCK_TYPES.FOR || block.type === constants_1.BLOCK_TYPES.WHILE);
    if (currentLoop?.type === constants_1.BLOCK_TYPES.FOR) {
        return {
            convertedLine: `${indentation}EXIT FOR`,
            blockType: null
        };
    }
    else if (currentLoop?.type === constants_1.BLOCK_TYPES.WHILE) {
        return {
            convertedLine: `${indentation}EXIT WHILE`,
            blockType: null
        };
    }
    // Fallback if no loop context found
    return {
        convertedLine: `${indentation}// break - exit loop`,
        blockType: null
    };
};
exports.convertBreak = convertBreak;
const convertContinue = (line, indentation, state) => {
    if (!patterns_1.PATTERNS.CONTINUE.test(line))
        return { convertedLine: line, blockType: null };
    // Find the current loop type to determine the correct continue statement
    const currentLoop = state.currentBlockTypes.slice().reverse().find(block => block.type === constants_1.BLOCK_TYPES.FOR || block.type === constants_1.BLOCK_TYPES.WHILE);
    if (currentLoop?.type === constants_1.BLOCK_TYPES.FOR) {
        return {
            convertedLine: `${indentation}NEXT ${currentLoop.ident || 'i'}`,
            blockType: null
        };
    }
    else if (currentLoop?.type === constants_1.BLOCK_TYPES.WHILE) {
        return {
            convertedLine: `${indentation}CONTINUE WHILE`,
            blockType: null
        };
    }
    // Fallback if no loop context found
    return {
        convertedLine: `${indentation}// continue - skip to next iteration`,
        blockType: null
    };
};
exports.convertContinue = convertContinue;
exports.controlFlowConverters = {
    convertIf: exports.convertIf,
    convertElif: exports.convertElif,
    convertElse: exports.convertElse,
    convertForRange: exports.convertForRange,
    convertForCollection: exports.convertForCollection,
    convertWhile: exports.convertWhile,
    convertBreak: exports.convertBreak,
    convertContinue: exports.convertContinue,
};

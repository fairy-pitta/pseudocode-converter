"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlFlowConverters = exports.convertWhile = exports.convertForCollection = exports.convertForRange = exports.convertElse = exports.convertElif = exports.convertIf = void 0;
var patterns_1 = require("../patterns");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var convertIf = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.IF);
    if (!match)
        return { convertedLine: line, blockType: null };
    var condition = (0, utils_1.convertConditionOperators)(match[1].trim());
    var blockType = { type: constants_1.BLOCK_TYPES.IF };
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.IF, " ").concat(condition, " ").concat(constants_1.KEYWORDS.THEN),
        blockType: blockType
    };
};
exports.convertIf = convertIf;
var convertElif = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.ELIF);
    if (!match)
        return { convertedLine: line, blockType: null };
    var condition = (0, utils_1.convertConditionOperators)(match[1].trim());
    // For IGCSE, ELIF should be converted to nested IF structure
    // The ELSE has already been added by the parser, now we add the nested IF
    var blockType = { type: constants_1.BLOCK_TYPES.IF };
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.IF, " ").concat(condition, " ").concat(constants_1.KEYWORDS.THEN),
        blockType: blockType
    };
};
exports.convertElif = convertElif;
var convertElse = function (line, indentation, state) {
    if (!patterns_1.PATTERNS.ELSE.test(line))
        return { convertedLine: line, blockType: null };
    // ELSE should be at the same level as the IF statement (no indentation for top-level if-else)
    var ifIndentation = '';
    var blockType = { type: constants_1.BLOCK_TYPES.ELSE };
    return {
        convertedLine: "".concat(ifIndentation).concat(constants_1.KEYWORDS.ELSE),
        blockType: blockType
    };
};
exports.convertElse = convertElse;
var convertForRange = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.FOR_RANGE);
    if (!match)
        return { convertedLine: line, blockType: null };
    var variable = match[1];
    var rangeArgs = match[2].split(',').map(function (arg) { return arg.trim(); });
    var start = '0';
    var end;
    var step = '1';
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
    var stepPart = step === '1' ? '' : " ".concat(constants_1.KEYWORDS.STEP, " ").concat(step);
    var blockType = { type: constants_1.BLOCK_TYPES.FOR, ident: variable };
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.FOR, " ").concat(variable, " ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(start, " ").concat(constants_1.KEYWORDS.TO, " ").concat(end).concat(stepPart),
        blockType: blockType
    };
};
exports.convertForRange = convertForRange;
var convertForCollection = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.FOR_COLLECTION);
    if (!match || match[2].startsWith('range('))
        return { convertedLine: line, blockType: null };
    var itemVariable = match[1];
    var collectionVariable = match[2];
    var blockType = { type: constants_1.BLOCK_TYPES.FOR, ident: itemVariable };
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.FOR_EACH, " ").concat(itemVariable, " ").concat(constants_1.KEYWORDS.IN, " ").concat(collectionVariable),
        blockType: blockType
    };
};
exports.convertForCollection = convertForCollection;
var convertWhile = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.WHILE);
    if (!match)
        return { convertedLine: line, blockType: null };
    var condition = (0, utils_1.convertConditionOperators)(match[1]);
    var blockType = { type: constants_1.BLOCK_TYPES.WHILE };
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.WHILE, " ").concat(condition, " ").concat(constants_1.KEYWORDS.DO),
        blockType: blockType
    };
};
exports.convertWhile = convertWhile;
exports.controlFlowConverters = {
    convertIf: exports.convertIf,
    convertElif: exports.convertElif,
    convertElse: exports.convertElse,
    convertForRange: exports.convertForRange,
    convertForCollection: exports.convertForCollection,
    convertWhile: exports.convertWhile,
};

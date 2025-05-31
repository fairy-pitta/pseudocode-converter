"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declarationConverters = exports.convertClassDef = exports.convertFunctionDef = void 0;
var patterns_1 = require("../patterns");
var constants_1 = require("../constants");
var convertFunctionDef = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.FUNCTION_DEF);
    if (!match)
        return { convertedLine: line, blockType: null };
    var functionName = match[1];
    var params = match[2] ? match[2].split(',').map(function (p) { return p.trim(); }).join(', ') : '';
    var blockType = { type: constants_1.BLOCK_TYPES.PROCEDURE };
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.PROCEDURE, " ").concat(functionName, "(").concat(params, ")"),
        blockType: blockType
    };
};
exports.convertFunctionDef = convertFunctionDef;
var convertClassDef = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.CLASS_DEF);
    if (!match)
        return { convertedLine: line, blockType: null };
    var className = match[1];
    var blockType = { type: constants_1.BLOCK_TYPES.CLASS };
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.CLASS, " ").concat(className),
        blockType: blockType
    };
};
exports.convertClassDef = convertClassDef;
exports.declarationConverters = {
    convertFunctionDef: exports.convertFunctionDef,
    convertClassDef: exports.convertClassDef,
};

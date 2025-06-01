"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declarationConverters = exports.convertClassDef = exports.convertFunctionDef = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const convertFunctionDef = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.FUNCTION_DEF);
    if (!match)
        return { convertedLine: line, blockType: null };
    const functionName = match[1];
    const params = match[2] ? match[2].split(',').map(p => p.trim()).join(', ') : '';
    const blockType = { type: constants_1.BLOCK_TYPES.PROCEDURE };
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.PROCEDURE} ${functionName}(${params})`,
        blockType
    };
};
exports.convertFunctionDef = convertFunctionDef;
const convertClassDef = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.CLASS_DEF);
    if (!match)
        return { convertedLine: line, blockType: null };
    const className = match[1];
    const blockType = { type: constants_1.BLOCK_TYPES.CLASS };
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.CLASS} ${className}`,
        blockType
    };
};
exports.convertClassDef = convertClassDef;
exports.declarationConverters = {
    convertFunctionDef: exports.convertFunctionDef,
    convertClassDef: exports.convertClassDef,
};

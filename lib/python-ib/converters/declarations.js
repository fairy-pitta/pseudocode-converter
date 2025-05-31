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
    const isProcedure = patterns_1.PATTERNS.PROCEDURE_COMMENT.test(line);
    const keyword = isProcedure ? constants_1.KEYWORDS.PROCEDURE : constants_1.KEYWORDS.FUNCTION;
    const blockType = isProcedure ? constants_1.BLOCK_TYPES.PROCEDURE : constants_1.BLOCK_TYPES.FUNCTION;
    return { convertedLine: `${indentation}${keyword} ${functionName}(${params})`, blockType };
};
exports.convertFunctionDef = convertFunctionDef;
const convertClassDef = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.CLASS_DEF);
    if (!match)
        return { convertedLine: line, blockType: null };
    const className = match[1];
    const parentClass = match[2] ? ` ${constants_1.KEYWORDS.INHERITS} ${match[2]}` : '';
    return { convertedLine: `${indentation}${constants_1.KEYWORDS.CLASS} ${className}${parentClass}`, blockType: constants_1.BLOCK_TYPES.CLASS };
};
exports.convertClassDef = convertClassDef;
exports.declarationConverters = {
    convertFunctionDef: exports.convertFunctionDef,
    convertClassDef: exports.convertClassDef,
};

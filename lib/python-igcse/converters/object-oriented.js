"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectOrientedConverters = exports.convertSelfAssignment = exports.convertMethodAssignment = exports.convertMethodCall = exports.convertObjectInstantiation = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const convertObjectInstantiation = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.OBJECT_INSTANTIATION);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1];
    const className = match[2];
    const args = match[3];
    // Skip built-in functions that are not class constructors
    const builtInFunctions = ['len', 'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'range', 'print', 'input', 'abs', 'max', 'min', 'sum'];
    if (builtInFunctions.includes(className.toLowerCase())) {
        return { convertedLine: line, blockType: null };
    }
    // Process arguments
    const processedArgs = args
        .split(',')
        .map(arg => arg.trim())
        .filter(arg => arg)
        .map(arg => (0, utils_1.convertConditionOperators)(arg))
        .join(', ');
    // Mark variable as declared
    state.declarations.add(variable);
    return {
        convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${constants_1.KEYWORDS.NEW} ${className}(${processedArgs})`,
        blockType: null
    };
};
exports.convertObjectInstantiation = convertObjectInstantiation;
const convertMethodCall = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.METHOD_CALL);
    if (!match)
        return { convertedLine: line, blockType: null };
    const object = match[1];
    const method = match[2];
    const args = match[3];
    // Capitalize method name for pseudocode convention
    const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);
    // Process arguments
    const processedArgs = args
        .split(',')
        .map(arg => arg.trim())
        .filter(arg => arg)
        .map(arg => (0, utils_1.convertConditionOperators)(arg))
        .join(', ');
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.CALL} ${object}.${capitalizedMethod}(${processedArgs})`,
        blockType: null
    };
};
exports.convertMethodCall = convertMethodCall;
const convertMethodAssignment = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.METHOD_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1];
    const object = match[2];
    const method = match[3];
    const args = match[4];
    // Capitalize method name for pseudocode convention
    const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);
    // Process arguments
    const processedArgs = args
        .split(',')
        .map(arg => arg.trim())
        .filter(arg => arg)
        .map(arg => (0, utils_1.convertConditionOperators)(arg))
        .join(', ');
    // Mark variable as declared
    state.declarations.add(variable);
    return {
        convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${object}.${capitalizedMethod}(${processedArgs})`,
        blockType: null
    };
};
exports.convertMethodAssignment = convertMethodAssignment;
const convertSelfAssignment = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.SELF_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const attribute = match[1];
    let value = match[2].trim();
    // Convert condition operators in the value
    value = (0, utils_1.convertConditionOperators)(value);
    // Convert self.attribute to self.attribute in pseudocode
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.SELF}.${attribute} ${constants_1.OPERATORS.ASSIGN} ${value}`,
        blockType: null
    };
};
exports.convertSelfAssignment = convertSelfAssignment;
exports.objectOrientedConverters = {
    convertObjectInstantiation: exports.convertObjectInstantiation,
    convertMethodCall: exports.convertMethodCall,
    convertMethodAssignment: exports.convertMethodAssignment,
    convertSelfAssignment: exports.convertSelfAssignment,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionConverters = exports.convertStandaloneFunctionCall = exports.convertFunctionCall = exports.convertDictionaryAssignment = exports.convertDictionaryLiteral = exports.convertMultipleAssignment = exports.convertLambda = exports.convertListComprehension = exports.convertReturn = exports.convertPrint = exports.convertCompoundAssignment = exports.convertAssignment = exports.convertConstant = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const utils_1 = require("../utils");

// Handle function calls like: result = square(5)
const convertFunctionCall = (line, indentation, state) => {
  const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)$/);
  if (!match) return { convertedLine: line, blockType: null };

  const [, variable, functionName, args] = match;
  
  // Check if this is a declared function (including lambda functions)
  const pascalCaseName = functionName.charAt(0).toUpperCase() + functionName.slice(1);
  
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
    convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${pascalCaseName}(${processedArgs})`,
    blockType: null
  };
};
exports.convertFunctionCall = convertFunctionCall;

// Handle standalone function calls like: greet("John")
const convertStandaloneFunctionCall = (line, indentation, state) => {
  const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)$/);
  if (!match) return { convertedLine: line, blockType: null };

  const [, functionName, args] = match;
  
  // Capitalize function name for pseudocode convention
  const pascalCaseName = functionName.charAt(0).toUpperCase() + functionName.slice(1);

  // Process arguments
  const processedArgs = args
    .split(',')
    .map(arg => arg.trim())
    .filter(arg => arg)
    .map(arg => (0, utils_1.convertConditionOperators)(arg))
    .join(', ');

  return {
    convertedLine: `${indentation}${constants_1.KEYWORDS.CALL} ${pascalCaseName}(${processedArgs})`,
    blockType: null
  };
};
exports.convertStandaloneFunctionCall = convertStandaloneFunctionCall;

exports.expressionConverters = {
    convertAssignment: exports.convertAssignment,
    convertCompoundAssignment: exports.convertCompoundAssignment,
    convertConstant: exports.convertConstant,
    convertPrint: exports.convertPrint,
    convertReturn: exports.convertReturn,
    convertListComprehension: exports.convertListComprehension,
    convertLambda: exports.convertLambda,
    convertMultipleAssignment: exports.convertMultipleAssignment,
    convertDictionaryLiteral: exports.convertDictionaryLiteral,
    convertDictionaryAssignment: exports.convertDictionaryAssignment,
    convertFunctionCall: exports.convertFunctionCall,
    convertStandaloneFunctionCall: exports.convertStandaloneFunctionCall
};

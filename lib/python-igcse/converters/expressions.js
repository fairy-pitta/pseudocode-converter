"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionConverters = exports.convertDictionaryAssignment = exports.convertDictionaryLiteral = exports.convertMultipleAssignment = exports.convertLambda = exports.convertListComprehension = exports.convertReturn = exports.convertPrint = exports.convertCompoundAssignment = exports.convertAssignment = exports.convertConstant = void 0;
var patterns_1 = require("../patterns");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var getVariableType = function (value, state) {
    var type = 'INTEGER';
    if (value.startsWith('"') || value.startsWith("'")) {
        type = 'STRING';
    }
    else if (value.includes('.') && !isNaN(Number(value))) {
        type = 'REAL';
    }
    else if (value === 'TRUE' || value === 'FALSE' || value === 'True' || value === 'False') {
        type = 'BOOLEAN';
    }
    else if (value.includes(' AND ') || value.includes(' OR ') || value.includes(' NOT ') ||
        value.includes('and') || value.includes('or') || value.includes('not')) {
        type = 'BOOLEAN';
    }
    else if (value.includes('UPPER(') || value.includes('LOWER(') || value.includes('MID(')) {
        type = 'STRING';
    }
    else if (value.includes('LENGTH(')) {
        type = 'INTEGER';
    }
    else if (value.includes('/') || value.includes('0.5') || value.includes('^')) {
        // Division, decimal exponents, or power operations typically result in REAL
        type = 'REAL';
    }
    else if (value.includes('(') && value.includes(')') && (value.includes('+') || value.includes('-') || value.includes('*'))) {
        // Complex mathematical expressions are likely to be REAL
        type = 'REAL';
    }
    return type;
};
var convertConstant = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.CONSTANT);
    if (!match)
        return { convertedLine: line, blockType: null };
    var variable = match[1].trim();
    var value = match[2].trim();
    // Convert condition operators
    value = (0, utils_1.convertConditionOperators)(value);
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.CONSTANT, " ").concat(variable, " = ").concat(value),
        blockType: null
    };
};
exports.convertConstant = convertConstant;
var convertAssignment = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    var variable = match[1].trim();
    var value = match[2].trim();
    // Handle input separately if it's part of the assignment
    var inputMatch = value.match(/^input\((?:["'].*?["'])?\)/);
    if (inputMatch) {
        return {
            convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.INPUT, " ").concat(variable),
            blockType: null
        };
    }
    // Convert string methods and functions
    value = value.replace(/\.upper\(\)/g, '.UPPER()');
    value = value.replace(/\.lower\(\)/g, '.LOWER()');
    value = value.replace(/len\(/g, 'LENGTH(');
    value = value.replace(/(\w+)\[(\d+)\]/g, 'MID($1, $2, 1)');
    // Handle function calls
    if (value.includes('(') && value.includes(')')) {
        value = value.replace(/\b(\w+)\(/g, function (match, funcName) {
            // Capitalize first letter for function names
            return funcName.charAt(0).toUpperCase() + funcName.slice(1) + '(';
        });
    }
    // Convert to IGCSE format
    value = value.replace(/(\w+)\.UPPER\(\)/g, 'UPPER($1)');
    value = value.replace(/(\w+)\.LOWER\(\)/g, 'LOWER($1)');
    // Handle string concatenation - replace + with & for string operations
    // Check if the expression contains string literals or string variables
    if (value.includes('"') || value.includes("'")) {
        // Replace + with & for string concatenation
        value = value.replace(/\s*\+\s*/g, ' & ');
    }
    value = (0, utils_1.convertConditionOperators)(value);
    // Check if this is the first time we see this variable
    if (!state.declarations.has(variable)) {
        state.declarations.add(variable);
        // Determine type based on value
        var type = getVariableType(value, state);
        return {
            convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.DECLARE, " ").concat(variable, " : ").concat(type, "\n").concat(indentation).concat(variable, " ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(value),
            blockType: null
        };
    }
    return {
        convertedLine: "".concat(indentation).concat(variable, " ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(value),
        blockType: null
    };
};
exports.convertAssignment = convertAssignment;
var convertCompoundAssignment = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.COMPOUND_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    var variable = match[1].trim();
    var operator = match[2];
    var value = match[3].trim();
    value = (0, utils_1.convertConditionOperators)(value);
    var opMapping = constants_1.COMPOUND_ASSIGNMENT_OPERATORS.find(function (op) { return op.python === operator; });
    if (opMapping) {
        return {
            convertedLine: "".concat(indentation).concat(variable, " ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(variable, " ").concat(opMapping.pseudocode, " ").concat(value),
            blockType: null
        };
    }
    return {
        convertedLine: "".concat(indentation).concat(variable, " ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(variable, " ").concat(operator, " ").concat(value),
        blockType: null
    };
};
exports.convertCompoundAssignment = convertCompoundAssignment;
var convertPrint = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.PRINT);
    if (!match)
        return { convertedLine: line, blockType: null };
    var content = match[1].trim();
    // Convert dictionary access to dot notation
    content = content.replace(patterns_1.PATTERNS.DICTIONARY_ACCESS, function (match, variable, key) {
        var cleanKey = key.replace(/["']/g, '');
        return "".concat(variable, ".").concat(cleanKey);
    });
    content = (0, utils_1.convertConditionOperators)(content);
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.OUTPUT, " ").concat(content),
        blockType: null
    };
};
exports.convertPrint = convertPrint;
var convertReturn = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.RETURN);
    if (!match)
        return { convertedLine: line, blockType: null };
    var value = match[1] ? (0, utils_1.convertConditionOperators)(match[1].trim()) : '';
    return {
        convertedLine: "".concat(indentation).concat(constants_1.KEYWORDS.RETURN, " ").concat(value),
        blockType: null
    };
};
exports.convertReturn = convertReturn;
var convertListComprehension = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.LIST_COMPREHENSION);
    if (!match)
        return { convertedLine: line, blockType: null };
    var arrayName = match[1], expression = match[2], loopVar = match[3], rangeEnd = match[4];
    var endValue = (parseInt(rangeEnd) - 1).toString();
    // Declare the array and index variable
    var arrayDeclaration = "".concat(indentation).concat(constants_1.KEYWORDS.DECLARE, " ").concat(arrayName, " : ARRAY[0:").concat(endValue, "] OF INTEGER");
    var indexDeclaration = "".concat(indentation).concat(constants_1.KEYWORDS.DECLARE, " index : INTEGER");
    var indexInit = "".concat(indentation, "index ").concat(constants_1.OPERATORS.ASSIGN, " 0");
    // Create the for loop
    var forLoop = "".concat(indentation).concat(constants_1.KEYWORDS.FOR, " ").concat(loopVar, " ").concat(constants_1.OPERATORS.ASSIGN, " 0 ").concat(constants_1.KEYWORDS.TO, " ").concat(endValue);
    var assignment = "".concat(indentation, "   ").concat(arrayName, "[index] ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(expression.replace(/\*/g, ' * '));
    var increment = "".concat(indentation, "   index ").concat(constants_1.OPERATORS.ASSIGN, " index + 1");
    var endFor = "".concat(indentation).concat(constants_1.KEYWORDS.NEXT, " ").concat(loopVar);
    // Mark variables as declared
    state.declarations.add(arrayName);
    state.declarations.add('index');
    state.declarations.add(loopVar);
    var result = [arrayDeclaration, indexDeclaration, indexInit, forLoop, assignment, increment, endFor].join('\n');
    return {
        convertedLine: result,
        blockType: null
    };
};
exports.convertListComprehension = convertListComprehension;
var convertLambda = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.LAMBDA);
    if (!match)
        return { convertedLine: line, blockType: null };
    var funcName = match[1], params = match[2], body = match[3];
    // Capitalize function name
    var capitalizedName = funcName.charAt(0).toUpperCase() + funcName.slice(1);
    // Parse parameters
    var paramList = params.split(',').map(function (p) { return p.trim(); });
    var paramDeclarations = paramList.map(function (param) { return "".concat(param, " : INTEGER"); }).join(', ');
    // Convert body expression
    var convertedBody = body.replace(/\*/g, ' * ').replace(/\s+/g, ' ').trim();
    // Create function definition
    var functionDef = "".concat(indentation).concat(constants_1.KEYWORDS.FUNCTION, " ").concat(capitalizedName, "(").concat(paramDeclarations, ") RETURNS INTEGER");
    var returnStatement = "".concat(indentation, "   ").concat(constants_1.KEYWORDS.RETURN, " ").concat(convertedBody);
    var endFunction = "".concat(indentation).concat(constants_1.KEYWORDS.END_FUNCTION);
    var result = [functionDef, returnStatement, endFunction, ''].join('\n');
    return {
        convertedLine: result,
        blockType: null
    };
};
exports.convertLambda = convertLambda;
var convertMultipleAssignment = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.MULTIPLE_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    var variables = match[1], values = match[2];
    // Check if this is actually a multiple assignment (contains comma)
    if (!variables.includes(',')) {
        return { convertedLine: line, blockType: null };
    }
    var varList = variables.split(',').map(function (v) { return v.trim(); });
    var valueList = values.split(',').map(function (v) { return v.trim(); });
    var result = [];
    // Generate declarations and assignments
    for (var i = 0; i < varList.length; i++) {
        var variable = varList[i];
        var value = valueList[i] || '0'; // Default to 0 if no value
        // Add declaration if not already declared
        if (!state.declarations.has(variable)) {
            var type = getVariableType(value, state);
            result.push("".concat(indentation).concat(constants_1.KEYWORDS.DECLARE, " ").concat(variable, " : ").concat(type));
            state.declarations.add(variable);
        }
    }
    // Add assignments
    for (var i = 0; i < varList.length; i++) {
        var variable = varList[i];
        var value = valueList[i] || '0';
        result.push("".concat(indentation).concat(variable, " ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(value));
    }
    return {
        convertedLine: result.join('\n'),
        blockType: null
    };
};
exports.convertMultipleAssignment = convertMultipleAssignment;
var convertDictionaryLiteral = function (line, indentation, state) {
    var _a;
    var match = line.match(patterns_1.PATTERNS.DICTIONARY_LITERAL);
    if (!match)
        return { convertedLine: line, blockType: null };
    var variable = match[1], content = match[2];
    // Parse dictionary content from the current line
    var pairs = content.split(',').map(function (pair) {
        var _a = pair.split(':').map(function (s) { return s.trim(); }), key = _a[0], value = _a[1];
        return { key: key.replace(/["']/g, ''), value: value.trim() };
    });
    // Generate type definition using all known fields for this variable
    var typeName = variable.charAt(0).toUpperCase() + variable.slice(1) + 'Record';
    var typeLines = ["".concat(indentation, "TYPE ").concat(typeName)];
    // Get all fields for this variable (from pre-scan)
    var allFields = ((_a = state.typeFields) === null || _a === void 0 ? void 0 : _a.get(variable)) || new Set();
    // Add fields from the current dictionary literal with their types
    var fieldTypes = new Map();
    pairs.forEach(function (pair) {
        fieldTypes.set(pair.key, getVariableType(pair.value, state));
    });
    // Add all known fields to the type definition
    Array.from(allFields).forEach(function (fieldKey) {
        // Use the type from current literal if available, otherwise default to STRING
        var fieldType = fieldTypes.get(fieldKey) || 'STRING';
        typeLines.push("".concat(indentation, "   DECLARE ").concat(fieldKey, " : ").concat(fieldType));
    });
    typeLines.push("".concat(indentation, "ENDTYPE"));
    typeLines.push('');
    // Generate variable declaration and assignments
    typeLines.push("".concat(indentation).concat(constants_1.KEYWORDS.DECLARE, " ").concat(variable, " : ").concat(typeName));
    pairs.forEach(function (pair) {
        typeLines.push("".concat(indentation).concat(variable, ".").concat(pair.key, " ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(pair.value));
    });
    state.declarations.add(variable);
    return {
        convertedLine: typeLines.join('\n'),
        blockType: null
    };
};
exports.convertDictionaryLiteral = convertDictionaryLiteral;
var convertDictionaryAssignment = function (line, indentation, state) {
    var match = line.match(patterns_1.PATTERNS.DICTIONARY_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    var variable = match[1], key = match[2], value = match[3];
    var cleanKey = key.replace(/["']/g, '');
    return {
        convertedLine: "".concat(indentation).concat(variable, ".").concat(cleanKey, " ").concat(constants_1.OPERATORS.ASSIGN, " ").concat(value),
        blockType: null
    };
};
exports.convertDictionaryAssignment = convertDictionaryAssignment;
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
};

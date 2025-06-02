"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionConverters = exports.convertDictionaryAssignment = exports.convertDictionaryLiteral = exports.convertMultipleAssignment = exports.convertLambda = exports.convertListComprehension = exports.convertReturn = exports.convertPrint = exports.convertCompoundAssignment = exports.convertAssignment = exports.convertConstant = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const getVariableType = (value, state) => {
    let type = 'INTEGER';
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
// Enhanced parameter type inference based on parameter name and context
const inferParameterType = (paramName, functionContext) => {
    // Common string parameter patterns
    if (paramName.includes('name') || paramName.includes('text') || paramName.includes('message') ||
        paramName.includes('str') || paramName.includes('word') || paramName.includes('title') ||
        paramName.includes('description') || paramName.includes('content')) {
        return 'STRING';
    }
    // Common real/float parameter patterns
    if (paramName.includes('price') || paramName.includes('rate') || paramName.includes('percent') ||
        paramName.includes('ratio') || paramName.includes('decimal') || paramName.includes('float') ||
        paramName.includes('weight') || paramName.includes('height') || paramName.includes('distance')) {
        return 'REAL';
    }
    // Common boolean parameter patterns
    if (paramName.includes('is') || paramName.includes('has') || paramName.includes('can') ||
        paramName.includes('should') || paramName.includes('flag') || paramName.includes('enabled') ||
        paramName.includes('valid') || paramName.includes('active')) {
        return 'BOOLEAN';
    }
    // Function context-based inference
    if (functionContext) {
        if (functionContext.toLowerCase().includes('string') || functionContext.toLowerCase().includes('text')) {
            return 'STRING';
        }
        if (functionContext.toLowerCase().includes('calculate') || functionContext.toLowerCase().includes('math')) {
            return 'REAL';
        }
    }
    // Default to INTEGER for numeric operations
    return 'INTEGER';
};
const convertConstant = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.CONSTANT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1].trim();
    let value = match[2].trim();
    // Convert condition operators
    value = (0, utils_1.convertConditionOperators)(value);
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.CONSTANT} ${variable} = ${value}`,
        blockType: null
    };
};
exports.convertConstant = convertConstant;
const convertAssignment = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1].trim();
    let value = match[2].trim();
    // Handle input separately if it's part of the assignment
    const inputMatch = value.match(/^(?:int\()?input\((["'].*?["'])?\)(?:\))?/);
    if (inputMatch) {
        const prompt = inputMatch[1];
        if (prompt) {
            // Generate OUTPUT statement for the prompt, then INPUT statement
            const outputLine = `${indentation}${constants_1.KEYWORDS.OUTPUT} ${prompt}`;
            const inputLine = `${indentation}${constants_1.KEYWORDS.INPUT} ${variable}`;
            return {
                convertedLine: `${outputLine}\n${inputLine}`,
                blockType: null
            };
        }
        else {
            // For IGCSE pseudocode, we only use INPUT without the prompt
            return {
                convertedLine: `${indentation}${constants_1.KEYWORDS.INPUT} ${variable}`,
                blockType: null
            };
        }
    }
    // Keep string indexing as is (text[0] remains text[0])
    // value = value.replace(/(\w+)\[(\d+)\]/g, 'MID($1, $2, 1)');
    // Handle function calls (but not method calls)
    if (value.includes('(') && value.includes(')')) {
        // Use a more specific approach to avoid affecting method calls
        const parts = value.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (i === 0 || !parts[i].includes('(')) {
                // Only process standalone function calls, not method calls
                parts[i] = parts[i].replace(/\b(\w+)\(/g, (match, funcName) => {
                    // Skip len function as it will be handled separately
                    if (funcName === 'len') {
                        return match;
                    }
                    // Skip already uppercase functions
                    if (funcName === funcName.toUpperCase()) {
                        return match;
                    }
                    // Capitalize first letter for function names
                    return funcName.charAt(0).toUpperCase() + funcName.slice(1) + '(';
                });
            }
        }
        value = parts.join('.');
    }
    // Convert len() to LENGTH() after function name capitalization
    value = value.replace(/len\(/g, 'LENGTH(');
    // Convert string methods and functions AFTER function name capitalization
    value = value.replace(/\.upper\(\)/g, '.UPPER()');
    value = value.replace(/\.lower\(\)/g, '.LOWER()');
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
    // For IGCSE, we don't pre-declare variables - they are used directly
    // Track variables for potential future use
    if (!state.declarations.has(variable)) {
        state.declarations.add(variable);
    }
    return {
        convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${value}`,
        blockType: null
    };
};
exports.convertAssignment = convertAssignment;
const convertCompoundAssignment = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.COMPOUND_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const variable = match[1].trim();
    const operator = match[2];
    let value = match[3].trim();
    value = (0, utils_1.convertConditionOperators)(value);
    const opMapping = constants_1.COMPOUND_ASSIGNMENT_OPERATORS.find(op => op.python === operator);
    if (opMapping) {
        return {
            convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${variable} ${opMapping.pseudocode} ${value}`,
            blockType: null
        };
    }
    return {
        convertedLine: `${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${variable} ${operator} ${value}`,
        blockType: null
    };
};
exports.convertCompoundAssignment = convertCompoundAssignment;
const convertPrint = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.PRINT);
    if (!match)
        return null;
    let rawContent = match[1].trim();
    // Handle empty print
    if (!rawContent) {
        return {
            convertedLine: `${indentation}${constants_1.KEYWORDS.OUTPUT} ""`,
            blockType: null
        };
    }
    // Handle method calls like line.strip()
    if (rawContent.includes('.strip()')) {
        const variable = rawContent.replace('.strip()', '');
        return {
            convertedLine: `${indentation}${constants_1.KEYWORDS.OUTPUT} ${variable}`,
            blockType: null
        };
    }
    // First, handle potential f-strings within the raw content
    // Regex to find f-strings like f"...{var}..." or f'...{var}...' 
    rawContent = rawContent.replace(/f(["'])(.*?\{.*?}.*?)\1/g, (match, quote, fstringContent) => {
        let result = '"' + fstringContent.replace(/\{([^}]+)\}/g, '" & $1 & "') + '"';
        result = result.replace(/"" & /g, '').replace(/ & ""$/g, ''); // Clean up empty concatenations
        return result;
    });
    // Split arguments by comma, trim, and rejoin with ', '
    // This needs to be careful about commas inside strings or function calls
    // For simplicity, we'll assume top-level commas separate print arguments
    const args = rawContent.split(',').map(arg => arg.trim());
    let content = args.join(', ');
    // Convert method calls to proper pseudocode format
    content = content.replace(/([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)\(([^)]*)\)/g, (match, object, method, args) => {
        const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);
        const processedArgs = args.trim() ? args.split(',').map((arg) => arg.trim()).join(', ') : '';
        return processedArgs ? `${object}.${capitalizedMethod}(${processedArgs})` : `${object}.${capitalizedMethod}()`;
    });
    // Convert dictionary access to dot notation
    content = content.replace(patterns_1.PATTERNS.DICTIONARY_ACCESS, (match, variable, key) => {
        const cleanKey = key.replace(/["']/g, '');
        return `${variable}.${cleanKey}`;
    });
    content = (0, utils_1.convertConditionOperators)(content);
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.OUTPUT} ${content}`,
        blockType: null
    };
};
exports.convertPrint = convertPrint;
const convertReturn = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.RETURN);
    if (!match)
        return { convertedLine: line, blockType: null };
    // Find the current function and mark it as having a return statement
    const currentFunction = state.currentBlockTypes.find(block => block.type === constants_1.BLOCK_TYPES.FUNCTION);
    if (currentFunction && currentFunction.ident) {
        state.functionHasReturn.set(currentFunction.ident, true);
    }
    const value = match[1] ? (0, utils_1.convertConditionOperators)(match[1].trim()) : '';
    return {
        convertedLine: `${indentation}${constants_1.KEYWORDS.RETURN} ${value}`,
        blockType: null
    };
};
exports.convertReturn = convertReturn;
const convertListComprehension = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.LIST_COMPREHENSION);
    if (!match)
        return { convertedLine: line, blockType: null };
    const [, arrayName, expression, loopVar, rangeEnd] = match;
    const endValue = (parseInt(rangeEnd) - 1).toString();
    // Initialize index variable
    const indexInit = `${indentation}index ${constants_1.OPERATORS.ASSIGN} 0`;
    // Create the for loop
    const forLoop = `${indentation}${constants_1.KEYWORDS.FOR} ${loopVar} ${constants_1.OPERATORS.ASSIGN} 0 ${constants_1.KEYWORDS.TO} ${endValue}`;
    const assignment = `${indentation}   ${arrayName}[index] ${constants_1.OPERATORS.ASSIGN} ${expression.replace(/\*/g, ' * ')}`;
    const increment = `${indentation}   index ${constants_1.OPERATORS.ASSIGN} index + 1`;
    const endFor = `${indentation}${constants_1.KEYWORDS.NEXT} ${loopVar}`;
    // Mark variables as declared
    state.declarations.add(arrayName);
    state.declarations.add('index');
    state.declarations.add(loopVar);
    const result = [indexInit, forLoop, assignment, increment, endFor].join('\n');
    return {
        convertedLine: result,
        blockType: null
    };
};
exports.convertListComprehension = convertListComprehension;
const convertLambda = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.LAMBDA);
    if (!match)
        return { convertedLine: line, blockType: null };
    const [, funcName, params, body] = match;
    // Capitalize function name
    const capitalizedName = funcName.charAt(0).toUpperCase() + funcName.slice(1);
    // Parse parameters with enhanced type inference
    const paramList = params.split(',').map(p => p.trim());
    const paramDeclarations = paramList.map(param => `${param} : ${inferParameterType(param, funcName)}`).join(', ');
    // Convert body expression
    const convertedBody = body.replace(/\*/g, ' * ').replace(/\s+/g, ' ').trim();
    // Create function definition
    const functionDef = `${indentation}${constants_1.KEYWORDS.FUNCTION} ${capitalizedName}(${paramDeclarations}) RETURNS INTEGER`;
    const returnStatement = `${indentation}   ${constants_1.KEYWORDS.RETURN} ${convertedBody}`;
    const endFunction = `${indentation}${constants_1.KEYWORDS.END_FUNCTION}`;
    const result = [functionDef, returnStatement, endFunction, ''].join('\n');
    return {
        convertedLine: result,
        blockType: null
    };
};
exports.convertLambda = convertLambda;
const convertMultipleAssignment = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.MULTIPLE_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const [, variables, values] = match;
    // Check if this is actually a multiple assignment (contains comma)
    if (!variables.includes(',')) {
        return { convertedLine: line, blockType: null };
    }
    const varList = variables.split(',').map(v => v.trim());
    const valueList = values.split(',').map(v => v.trim());
    const result = [];
    // Generate assignments
    for (let i = 0; i < varList.length; i++) {
        const variable = varList[i];
        const value = valueList[i] || '0'; // Default to 0 if no value
        // Mark variable as declared
        state.declarations.add(variable);
        // Add assignment
        result.push(`${indentation}${variable} ${constants_1.OPERATORS.ASSIGN} ${value}`);
    }
    return {
        convertedLine: result.join('\n'),
        blockType: null
    };
};
exports.convertMultipleAssignment = convertMultipleAssignment;
const convertDictionaryLiteral = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.DICTIONARY_LITERAL);
    if (!match)
        return { convertedLine: line, blockType: null };
    const [, variable, content] = match;
    // Parse dictionary content from the current line
    const pairs = content.split(',').map(pair => {
        const [key, value] = pair.split(':').map(s => s.trim());
        return { key: key.replace(/["']/g, ''), value: value.trim() };
    });
    // Generate type definition using all known fields for this variable
    const typeName = variable.charAt(0).toUpperCase() + variable.slice(1) + 'Record';
    const typeLines = [`${indentation}TYPE ${typeName}`];
    // Get all fields for this variable (from pre-scan)
    const allFields = state.typeFields?.get(variable) || new Set();
    // Add fields from the current dictionary literal with their types
    const fieldTypes = new Map();
    pairs.forEach(pair => {
        fieldTypes.set(pair.key, getVariableType(pair.value, state));
    });
    // Add all known fields to the type definition
    Array.from(allFields).forEach(fieldKey => {
        // Use the type from current literal if available, otherwise default to STRING
        const fieldType = fieldTypes.get(fieldKey) || 'STRING';
        typeLines.push(`${indentation}   ${fieldKey} : ${fieldType}`);
    });
    typeLines.push(`${indentation}ENDTYPE`);
    typeLines.push('');
    // Generate field assignments directly (no DECLARE needed)
    pairs.forEach(pair => {
        typeLines.push(`${indentation}${variable}.${pair.key} ${constants_1.OPERATORS.ASSIGN} ${pair.value}`);
    });
    state.declarations.add(variable);
    return {
        convertedLine: typeLines.join('\n'),
        blockType: null
    };
};
exports.convertDictionaryLiteral = convertDictionaryLiteral;
const convertDictionaryAssignment = (line, indentation, state) => {
    const match = line.match(patterns_1.PATTERNS.DICTIONARY_ASSIGNMENT);
    if (!match)
        return { convertedLine: line, blockType: null };
    const [, variable, key, value] = match;
    const cleanKey = key.replace(/["']/g, '');
    return {
        convertedLine: `${indentation}${variable}.${cleanKey} ${constants_1.OPERATORS.ASSIGN} ${value}`,
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

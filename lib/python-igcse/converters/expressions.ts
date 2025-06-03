import { ParserState, ParseResult } from '../types';
import { PATTERNS } from '../patterns';
import { OPERATORS, KEYWORDS, COMPOUND_ASSIGNMENT_OPERATORS, BLOCK_TYPES } from '../constants';
import { convertConditionOperators } from '../utils';

const getVariableType = (value: string, state: ParserState): string => {
  let type = 'INTEGER';
  if (value.startsWith('"') || value.startsWith("'")) {
    type = 'STRING';
  } else if (value.includes('.') && !isNaN(Number(value))) {
    type = 'REAL';
  } else if (value === 'TRUE' || value === 'FALSE' || value === 'True' || value === 'False') {
    type = 'BOOLEAN';
  } else if (value.includes(' AND ') || value.includes(' OR ') || value.includes(' NOT ') || 
             value.includes('and') || value.includes('or') || value.includes('not')) {
    type = 'BOOLEAN';
  } else if (value.includes('UPPER(') || value.includes('LOWER(') || value.includes('MID(')) {
    type = 'STRING';
  } else if (value.includes('LENGTH(')) {
    type = 'INTEGER';
  } else if (value.includes('/') || value.includes('0.5') || value.includes('^')) {
    // Division, decimal exponents, or power operations typically result in REAL
    type = 'REAL';
  } else if (value.includes('(') && value.includes(')') && (value.includes('+') || value.includes('-') || value.includes('*'))) {
    // Complex mathematical expressions are likely to be REAL
    type = 'REAL';
  }
  return type;
};

// Enhanced parameter type inference based on parameter name and context
const inferParameterType = (paramName: string, functionContext?: string): string => {
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

export const convertConstant = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.CONSTANT);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1].trim();
  let value = match[2].trim();

  // Convert condition operators
  value = convertConditionOperators(value);

  return { 
    convertedLine: `${indentation}${KEYWORDS.CONSTANT} ${variable} = ${value}`, 
    blockType: null 
  };
};

export const convertAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1].trim();
  let value = match[2].trim();

  // Handle input separately if it's part of the assignment
  const inputMatch = value.match(/^(?:int\()?input\((["'].*?["'])?\)(?:\))?/);
  if (inputMatch) {
    const prompt = inputMatch[1];
    if (prompt) {
      // Generate OUTPUT statement for the prompt, then INPUT statement
      const outputLine = `${indentation}${KEYWORDS.OUTPUT} ${prompt}`;
      const inputLine = `${indentation}${KEYWORDS.INPUT} ${variable}`;
      return { 
        convertedLine: `${outputLine}\n${inputLine}`, 
        blockType: null 
      };
    } else {
      // For IGCSE pseudocode, we only use INPUT without the prompt
      return { 
        convertedLine: `${indentation}${KEYWORDS.INPUT} ${variable}`, 
        blockType: null 
      };
    }
  }

  // Convert string methods and functions
  value = value.replace(/\.upper\(\)/g, '.UPPER()');
  value = value.replace(/\.lower\(\)/g, '.LOWER()');
  value = value.replace(/len\(/g, 'LENGTH(');
  
  // Keep string indexing as is (text[0] remains text[0])
  // value = value.replace(/(\w+)\[(\d+)\]/g, 'MID($1, $2, 1)');
  
  // Handle function calls
  if (value.includes('(') && value.includes(')')) {
    value = value.replace(/\b(\w+)\(/g, (match: string, funcName: string) => {
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
  
  value = convertConditionOperators(value);
  
  // For IGCSE, we don't pre-declare variables - they are used directly
  // Track variables for potential future use
  if (!state.declarations.has(variable)) {
    state.declarations.add(variable);
  }
  
  return { 
    convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${value}`, 
    blockType: null 
  };
};

export const convertCompoundAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.COMPOUND_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1].trim();
  const operator = match[2];
  let value = match[3].trim();
  
  value = convertConditionOperators(value);

  const opMapping = COMPOUND_ASSIGNMENT_OPERATORS.find(op => op.python === operator);
  if (opMapping) {
    return { 
      convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${variable} ${opMapping.pseudocode} ${value}`, 
      blockType: null 
    };
  }
  
  return { 
    convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${variable} ${operator} ${value}`, 
    blockType: null 
  };
};

export const convertPrint = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.PRINT);
  if (!match) return { convertedLine: line, blockType: null };

  let rawContent = match[1].trim();

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
    const processedArgs = args.trim() ? args.split(',').map((arg: string) => arg.trim()).join(', ') : '';
    return processedArgs ? `${object}.${capitalizedMethod}(${processedArgs})` : `${object}.${capitalizedMethod}()`;
  });

  // Convert dictionary access to dot notation
  content = content.replace(PATTERNS.DICTIONARY_ACCESS, (match, variable, key) => {
    const cleanKey = key.replace(/["']/g, '');
    return `${variable}.${cleanKey}`;
  });
  
  content = convertConditionOperators(content);

  return { 
    convertedLine: `${indentation}${KEYWORDS.OUTPUT} ${content}`, 
    blockType: null 
  };
};

export const convertReturn = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.RETURN);
  if (!match) return { convertedLine: line, blockType: null };

  // Find the current function and mark it as having a return statement
  const currentFunction = state.currentBlockTypes.find(block => block.type === BLOCK_TYPES.FUNCTION);
  if (currentFunction && currentFunction.ident) {
    state.functionHasReturn.set(currentFunction.ident, true);
  }

  const value = match[1] ? convertConditionOperators(match[1].trim()) : '';
  return { 
    convertedLine: `${indentation}${KEYWORDS.RETURN} ${value}`, 
    blockType: null
  };
};

export const convertListComprehension = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.LIST_COMPREHENSION);
  if (!match) return { convertedLine: line, blockType: null };

  const [, arrayName, expression, loopVar, rangeEnd] = match;
  const endValue = (parseInt(rangeEnd) - 1).toString();
  
  // Initialize index variable
  const indexInit = `${indentation}index ${OPERATORS.ASSIGN} 0`;
  
  // Create the for loop
  const forLoop = `${indentation}${KEYWORDS.FOR} ${loopVar} ${OPERATORS.ASSIGN} 0 ${KEYWORDS.TO} ${endValue}`;
  const assignment = `${indentation}   ${arrayName}[index] ${OPERATORS.ASSIGN} ${expression.replace(/\*/g, ' * ')}`;
  const increment = `${indentation}   index ${OPERATORS.ASSIGN} index + 1`;
  const endFor = `${indentation}${KEYWORDS.NEXT} ${loopVar}`;
  
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

export const convertLambda = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.LAMBDA);
  if (!match) return { convertedLine: line, blockType: null };
  
  const [, funcName, params, body] = match;
  
  // Capitalize function name
  const capitalizedName = funcName.charAt(0).toUpperCase() + funcName.slice(1);
  
  // Parse parameters with enhanced type inference
  const paramList = params.split(',').map(p => p.trim());
  const paramDeclarations = paramList.map(param => `${param} : ${inferParameterType(param, funcName)}`).join(', ');
  
  // Convert body expression
  const convertedBody = body.replace(/\*/g, ' * ').replace(/\s+/g, ' ').trim();
  
  // Create function definition
  const functionDef = `${indentation}${KEYWORDS.FUNCTION} ${capitalizedName}(${paramDeclarations}) RETURNS INTEGER`;
  const returnStatement = `${indentation}   ${KEYWORDS.RETURN} ${convertedBody}`;
  const endFunction = `${indentation}${KEYWORDS.END_FUNCTION}`;
  
  const result = [functionDef, returnStatement, endFunction, ''].join('\n');
  
  return { 
    convertedLine: result, 
    blockType: null 
  };
};

export const convertMultipleAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.MULTIPLE_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };
  
  const [, variables, values] = match;
  
  // Check if this is actually a multiple assignment (contains comma)
  if (!variables.includes(',')) {
    return { convertedLine: line, blockType: null };
  }
  
  const varList = variables.split(',').map(v => v.trim());
  const valueList = values.split(',').map(v => v.trim());
  
  const result: string[] = [];
  
  // Generate assignments
  for (let i = 0; i < varList.length; i++) {
    const variable = varList[i];
    const value = valueList[i] || '0'; // Default to 0 if no value
    
    // Mark variable as declared
    state.declarations.add(variable);
    
    // Add assignment
    result.push(`${indentation}${variable} ${OPERATORS.ASSIGN} ${value}`);
  }
  
  return { 
    convertedLine: result.join('\n'), 
    blockType: null 
  };
};

export const convertDictionaryLiteral = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.DICTIONARY_LITERAL);
  if (!match) return { convertedLine: line, blockType: null };
  
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
  const fieldTypes = new Map<string, string>();
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
    typeLines.push(`${indentation}${variable}.${pair.key} ${OPERATORS.ASSIGN} ${pair.value}`);
  });
  
  state.declarations.add(variable);
  
  return {
    convertedLine: typeLines.join('\n'),
    blockType: null
  };
};

export const convertDictionaryAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.DICTIONARY_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };
  
  const [, variable, key, value] = match;
  const cleanKey = key.replace(/["']/g, '');
  
  return {
    convertedLine: `${indentation}${variable}.${cleanKey} ${OPERATORS.ASSIGN} ${value}`,
    blockType: null
  };
};

export const convertSelfAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.SELF_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const attribute = match[1].trim();
  let value = match[2].trim();

  value = convertConditionOperators(value);

  return {
    convertedLine: `${indentation}THIS.${attribute} ${OPERATORS.ASSIGN} ${value}`,
    blockType: null
  };
};

export const convertObjectInstantiation = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.OBJECT_INSTANTIATION);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1].trim();
  const className = match[2].trim();
  const args = match[3] ? match[3].trim() : '';

  const declaration = `${indentation}${KEYWORDS.DECLARE} ${variable} : ${className}`;
  const instantiation = `${indentation}${variable} ${OPERATORS.ASSIGN} ${KEYWORDS.NEW} ${className}(${args})`;
  
  state.declarations.add(variable);

  return {
    convertedLine: `${declaration}\n${instantiation}`,
    blockType: null
  };
};

export const convertMethodCall = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.METHOD_CALL);
  if (!match) return { convertedLine: line, blockType: null };

  const object = match[1].trim();
  const method = match[2].trim();
  const args = match[3] ? match[3].trim() : '';
  
  const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);

  return {
    convertedLine: `${indentation}${KEYWORDS.CALL} ${object}.${capitalizedMethod}(${args})`,
    blockType: null
  };
};

export const expressionConverters = {
  convertAssignment,
  convertCompoundAssignment,
  convertConstant,
  convertPrint,
  convertReturn,
  convertListComprehension,
  convertLambda,
  convertMultipleAssignment,
  convertDictionaryLiteral,
  convertDictionaryAssignment,
  convertSelfAssignment,
  convertObjectInstantiation,
  convertMethodCall,
};
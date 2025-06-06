import { PATTERNS } from '../patterns';
import { KEYWORDS, OPERATORS } from '../constants';
import { ParseResult, ParserState } from '../types';
import { convertConditionOperators } from '../utils';

export const convertObjectInstantiation = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.OBJECT_INSTANTIATION);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1];
  const className = match[2];
  const args = match[3];
  
  // Skip built-in functions that are not class constructors
  const builtInFunctions = ['len', 'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'range', 'print', 'input', 'abs', 'max', 'min', 'sum'];
  if (builtInFunctions.includes(className.toLowerCase())) {
    return { convertedLine: line, blockType: null };
  }
  
  // Skip function calls - check if className is a declared function or lambda
  // This includes lambda functions that were converted to FUNCTION definitions
  const lowerClassName = className.toLowerCase();
  const pascalCaseCheck = className.charAt(0).toLowerCase() + className.slice(1);
  
  if (state.declarations.has(lowerClassName) || 
      state.functionHasReturn.has(lowerClassName) ||
      state.functionHasReturn.has(pascalCaseCheck) ||
      // Also check the original function name from lambda
      state.declarations.has(pascalCaseCheck)) {
    return { convertedLine: line, blockType: null };
  }

  // Process arguments
  const processedArgs = args
    .split(',')
    .map(arg => arg.trim())
    .filter(arg => arg)
    .map(arg => convertConditionOperators(arg))
    .join(', ');

  // Mark variable as declared
  state.declarations.add(variable);

  return {
    convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${KEYWORDS.NEW} ${className}(${processedArgs})`,
    blockType: null
  };
};

export const convertMethodCall = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.METHOD_CALL);
  if (!match) return { convertedLine: line, blockType: null };

  const object = match[1];
  const method = match[2];
  const args = match[3];

  // Handle string methods specially - convert to IGCSE format
  if (method === 'upper') {
    return {
      convertedLine: `${indentation}UPPER(${object})`,
      blockType: null
    };
  }
  
  if (method === 'lower') {
    return {
      convertedLine: `${indentation}LOWER(${object})`,
      blockType: null
    };
  }

  // Capitalize method name for pseudocode convention
  const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);

  // Process arguments
  const processedArgs = args
    .split(',')
    .map(arg => arg.trim())
    .filter(arg => arg)
    .map(arg => convertConditionOperators(arg))
    .join(', ');

  return {
    convertedLine: `${indentation}${KEYWORDS.CALL} ${object}.${capitalizedMethod}(${processedArgs})`,
    blockType: null
  };
};

export const convertMethodAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.METHOD_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1];
  const object = match[2];
  const method = match[3];
  const args = match[4];

  // Handle string methods specially - convert to IGCSE format
  if (method === 'upper') {
    state.declarations.add(variable);
    return {
      convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} UPPER(${object})`,
      blockType: null
    };
  }
  
  if (method === 'lower') {
    state.declarations.add(variable);
    return {
      convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} LOWER(${object})`,
      blockType: null
    };
  }

  // Capitalize method name for pseudocode convention
  const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);

  // Process arguments
  const processedArgs = args
    .split(',')
    .map(arg => arg.trim())
    .filter(arg => arg)
    .map(arg => convertConditionOperators(arg))
    .join(', ');

  // Mark variable as declared
  state.declarations.add(variable);

  return {
    convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${object}.${capitalizedMethod}(${processedArgs})`,
    blockType: null
  };
};

export const convertSelfAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.SELF_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const attribute = match[1];
  let value = match[2].trim();

  // Convert condition operators in the value
  value = convertConditionOperators(value);

  // Convert self.attribute to self.attribute in pseudocode
  return {
    convertedLine: `${indentation}${KEYWORDS.SELF}.${attribute} ${OPERATORS.ASSIGN} ${value}`,
    blockType: null
  };
};

export const objectOrientedConverters = {
  convertObjectInstantiation,
  convertMethodCall,
  convertMethodAssignment,
  convertSelfAssignment,
};
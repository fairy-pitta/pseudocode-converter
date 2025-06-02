import { PATTERNS } from '../patterns';
import { KEYWORDS, BLOCK_TYPES } from '../constants';
import { ParseResult, ParserState, BlockFrame } from '../types';

export function convertFunctionDef(line: string, indentation: string = ''): ParseResult | null {
  const match = line.match(PATTERNS.FUNCTION_DEF);
  
  if (!match) {
    return null;
  }

  let functionName = match[1];
  // Convert functionName to PascalCase
  const pascalCaseName = functionName.charAt(0).toUpperCase() + functionName.slice(1);

  // Initialize function in the tracking map (will be updated when return is found)
  state.functionHasReturn.set(functionName, false);

  const paramsString = match[2] || '';
  // Enhanced parameter type inference
  const inferParameterType = (paramName: string, functionName: string): string => {
     const lowerName = paramName.toLowerCase();
     
     // Special cases for obvious string parameters
     if (lowerName.includes('operation') || lowerName.includes('name') || lowerName.includes('text') || lowerName.includes('message')) {
       return 'STRING';
     }
     
     // Simple rule: if parameter name contains 'num', it's INTEGER
     // Otherwise, it's STRING
     if (lowerName.includes('num')) {
       return 'INTEGER';
     }
     
     return 'STRING';
    };

  const params = paramsString
    .split(',')
    .map(p => p.trim())
    .filter(p => p) // Remove empty strings if any from trailing commas etc.
    .map(p => `${p} : ${inferParameterType(p, functionName)}`)
    .join(', ');

  // Store function info in blockType for later processing
  const blockType: BlockFrame = { type: BLOCK_TYPES.FUNCTION, ident: functionName };
  return { 
    convertedLine: `${indentation}TEMP_FUNCTION ${pascalCaseName}(${params})`, // Temporary placeholder
    blockType 
  };
};

export const convertClassDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.CLASS_DEF);
  if (!match) return { convertedLine: line, blockType: null };

  const className = match[1];
  const parentClass = match[2]; // Capture inheritance
  const blockType: BlockFrame = { type: BLOCK_TYPES.CLASS };
  
  let convertedLine = `${indentation}${KEYWORDS.CLASS} ${className}`;
  if (parentClass) {
    convertedLine += ` ${KEYWORDS.INHERITS} ${parentClass}`;
  }
  
  return { 
    convertedLine, 
    blockType 
  };
};

export const convertConstructorDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.CONSTRUCTOR_DEF);
  if (!match) return { convertedLine: line, blockType: null };

  const paramsString = match[1] || '';
  
  // Enhanced parameter type inference for constructor
  const inferConstructorParameterType = (paramName: string): string => {
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
    
    // For constructor parameters, common patterns suggest STRING for names, ages, etc.
    if (paramName.includes('age') || paramName.includes('id') || paramName.includes('count')) {
      return 'INTEGER';
    }
    
    // Default to STRING for constructor parameters (often names, descriptions, etc.)
    return 'STRING';
  };
  
  // Remove 'self' parameter and process remaining parameters
  const params = paramsString
    .split(',')
    .map(p => p.trim())
    .filter(p => p && p !== 'self')
    .map(p => `${p} : ${inferConstructorParameterType(p)}`)
    .join(', ');

  const blockType: BlockFrame = { type: BLOCK_TYPES.CONSTRUCTOR };
  return { 
    convertedLine: `${indentation}${KEYWORDS.PUBLIC} ${KEYWORDS.PROCEDURE} ${KEYWORDS.NEW}(${params})`, 
    blockType 
  };
};

export const declarationConverters = {
  convertFunctionDef,
  convertClassDef,
  convertConstructorDef,
};
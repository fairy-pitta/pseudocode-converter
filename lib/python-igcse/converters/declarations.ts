import { PATTERNS } from '../patterns';
import { KEYWORDS, BLOCK_TYPES } from '../constants';
import { ParseResult, ParserState, BlockFrame } from '../types';

export const convertFunctionDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  console.log(`[convertFunctionDef] Processing line: "${line.trim()}", pattern test: ${PATTERNS.FUNCTION_DEF.test(line)}`);
  console.log(`[convertFunctionDef] PATTERNS.FUNCTION_DEF: ${PATTERNS.FUNCTION_DEF}`);
  const match = line.match(PATTERNS.FUNCTION_DEF);
  console.log(`[convertFunctionDef] Match result:`, match);
  if (!match) {
    console.log(`[convertFunctionDef] No match for "${line.trim()}", returning original line.`);
    return { convertedLine: line, blockType: null };
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
  // For IGCSE, class definitions become TYPE definitions
  // Attributes are typically defined within the TYPE block or implicitly by assignments in constructor/methods
  // We will handle attribute collection in the parser or a dedicated pass
  const blockType: BlockFrame = { type: BLOCK_TYPES.CLASS, ident: className }; // Store className for context
  
  // TYPE ClassName (attributes will be added by parser based on self. assignments)
  return { 
    convertedLine: `${indentation}${KEYWORDS.TYPE} ${className}`, 
    blockType 
  };
};

export const convertConstructorDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.CONSTRUCTOR_DEF);
  if (!match) return { convertedLine: line, blockType: null };

  // Get the class name from the current block context
  let className = 'Constructor'; // Default if not in class context
  if (state.currentBlockTypes.length > 0) {
    const parentBlock = state.currentBlockTypes[state.currentBlockTypes.length - 1];
    if (parentBlock.type === BLOCK_TYPES.CLASS && parentBlock.ident) {
      className = parentBlock.ident;
    }
  }

  const paramsString = match[1] || '';
  
  const inferConstructorParameterType = (paramName: string): string => {
    if (paramName.includes('name') || paramName.includes('text') || paramName.includes('message') || 
        paramName.includes('str') || paramName.includes('word') || paramName.includes('title') ||
        paramName.includes('description') || paramName.includes('content')) {
      return 'STRING';
    }
    if (paramName.includes('price') || paramName.includes('rate') || paramName.includes('percent') ||
        paramName.includes('ratio') || paramName.includes('decimal') || paramName.includes('float') ||
        paramName.includes('weight') || paramName.includes('height') || paramName.includes('distance')) {
      return 'REAL';
    }
    if (paramName.includes('is') || paramName.includes('has') || paramName.includes('can') ||
        paramName.includes('should') || paramName.includes('flag') || paramName.includes('enabled') ||
        paramName.includes('valid') || paramName.includes('active')) {
      return 'BOOLEAN';
    }
    if (paramName.includes('age') || paramName.includes('id') || paramName.includes('count')) {
      return 'INTEGER';
    }
    return 'STRING';
  };
  
  const params = paramsString
    .split(',')
    .map(p => p.trim())
    .filter(p => p && p !== 'self')
    .map(p => `${p} : ${inferConstructorParameterType(p)}`)
    .join(', ');

  // IGCSE uses PROCEDURE for constructors, often named 'Constructor' or ClassName
  // For consistency with IGCSE examples, let's use 'Constructor' or the class name itself.
  // The actual instantiation is done via `NEW ClassName()`
  const constructorProcedureName = className; // Or a fixed "Constructor"

  const blockType: BlockFrame = { type: BLOCK_TYPES.CONSTRUCTOR, ident: constructorProcedureName };
  return { 
    convertedLine: `${indentation}${KEYWORDS.PROCEDURE} ${constructorProcedureName}(${params})`, 
    blockType 
  };
};

export const declarationConverters = {
  convertFunctionDef,
  convertClassDef,
  convertConstructorDef,
};
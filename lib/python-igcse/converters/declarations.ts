import { PATTERNS } from '../patterns';
import { KEYWORDS, BLOCK_TYPES } from '../constants';
import { ParseResult, ParserState, BlockFrame } from '../types';

export const convertFunctionDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  console.log('[convertFunctionDef] Testing line with PATTERNS.FUNCTION_DEF:', line, PATTERNS.FUNCTION_DEF.test(line));
  const match = line.match(PATTERNS.FUNCTION_DEF);
  if (!match) {
    console.log(`[convertFunctionDef] No match for "${line}", returning original line.`);
    return { convertedLine: line, blockType: null };
  }

  let functionName = match[1];
  // Convert functionName to PascalCase
  const pascalCaseName = functionName.charAt(0).toUpperCase() + functionName.slice(1);

  // Initialize function in the tracking map (will be updated when return is found)
  state.functionHasReturn.set(functionName, false);

  const paramsString = match[2] || '';
  const params = paramsString
    .split(',')
    .map(p => p.trim())
    .filter(p => p) // Remove empty strings if any from trailing commas etc.
    .map(p => `${p} : INTEGER`) // Default to INTEGER for mathematical operations
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
  // Remove 'self' parameter and process remaining parameters
  const params = paramsString
    .split(',')
    .map(p => p.trim())
    .filter(p => p && p !== 'self')
    .map(p => `${p} : STRING`)
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
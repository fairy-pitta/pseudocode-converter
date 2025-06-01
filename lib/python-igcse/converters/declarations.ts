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
  functionName = functionName.charAt(0).toUpperCase() + functionName.slice(1);

  const paramsString = match[2] || '';
  const params = paramsString
    .split(',')
    .map(p => p.trim())
    .filter(p => p) // Remove empty strings if any from trailing commas etc.
    .map(p => `${p} : STRING`) // Add : STRING to each parameter
    .join(', ');

  const blockType: BlockFrame = { type: BLOCK_TYPES.PROCEDURE };
  return { 
    convertedLine: `${indentation}${KEYWORDS.PROCEDURE} ${functionName}(${params})`, 
    blockType 
  };
};

export const convertClassDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.CLASS_DEF);
  if (!match) return { convertedLine: line, blockType: null };

  const className = match[1];
  const blockType: BlockFrame = { type: BLOCK_TYPES.CLASS };
  
  return { 
    convertedLine: `${indentation}${KEYWORDS.CLASS} ${className}`, 
    blockType 
  };
};

export const declarationConverters = {
  convertFunctionDef,
  convertClassDef,
};
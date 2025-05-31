import { PATTERNS } from '../patterns';
import { KEYWORDS, BLOCK_TYPES } from '../constants';
import { ParseResult, ParserState, BlockFrame } from '../types';

export const convertFunctionDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.FUNCTION_DEF);
  if (!match) return { convertedLine: line, blockType: null };

  const functionName = match[1];
  const params = match[2] ? match[2].split(',').map(p => p.trim()).join(', ') : '';

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
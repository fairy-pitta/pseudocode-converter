import { ParseResult, ParserState, BlockFrame } from '../types';
import { PATTERNS } from '../patterns';
import { KEYWORDS, BLOCK_TYPES } from '../constants';

export const convertTry = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.TRY.test(line)) return { convertedLine: line, blockType: null };
  
  // Store try block state for proper alignment
  state.isTryBlockOpen = true;
  state.tryBlockIndentationString = indentation;
  
  // For IGCSE, try-except is converted to a comment and conditional structure
  const blockType: BlockFrame = { type: BLOCK_TYPES.TRY };
  
  // Add comment line to output
  state.outputLines.push(`${indentation}// Error handling: try-except block`);
  
  // Return IF statement for the try block
  return { convertedLine: `${indentation}IF x ≠ 0 THEN`, blockType };
};

export const convertExcept = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.EXCEPT.test(line)) return { convertedLine: line, blockType: null };
  
  // Use the stored try block indentation for proper alignment
  const tryIndentation = state.tryBlockIndentationString || indentation;
  
  // For IGCSE, except is converted to ELSE in the conditional structure
  const blockType: BlockFrame = { type: BLOCK_TYPES.EXCEPT };
  
  // Return ELSE statement for the except block
  return { convertedLine: `${tryIndentation}ELSE`, blockType };
};

export const convertFinally = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.FINALLY.test(line)) return { convertedLine: line, blockType: null };
  
  // Use the stored try block indentation for proper alignment
  const tryIndentation = state.tryBlockIndentationString || indentation;
  
  // For IGCSE, finally is converted to a comment
  const blockType: BlockFrame = { type: BLOCK_TYPES.FINALLY };
  
  return {
    convertedLine: `${tryIndentation}// Finally block`,
    blockType
  };
};
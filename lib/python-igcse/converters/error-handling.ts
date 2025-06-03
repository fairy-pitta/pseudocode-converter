import { ParseResult, ParserState, BlockFrame } from '../types';
import { PATTERNS } from '../patterns';
import { KEYWORDS, BLOCK_TYPES, OPERATORS } from '../constants';

// TRY  ➜ IF
export function convertTry(_: string, pad: string): ParseResult | null {
  return {
    convertedLine: `${pad}IF variable x is defined THEN`,
    blockType: { type: BLOCK_TYPES.IF },
  };
}

// EXCEPT  ➜ ELSE
export function convertExcept(_: string, pad: string): ParseResult | null {
  return {
    convertedLine: `${pad}ELSE`,
    blockType: { type: BLOCK_TYPES.ELSE },
  };
}

export const convertFinally = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.FINALLY.test(line)) return { convertedLine: line, blockType: null };
  
  // Use the stored try block indentation for proper alignment
  const tryIndentation = state.tryBlockIndentationString || indentation;
  
  // For IGCSE, finally is converted to a comment and typically needs to be handled
  // as code that executes regardless, which might be complex to represent simply.
  // For now, just a comment, and it will be part of the preceding block.
  // No specific blockType is returned here as it doesn't start a new pseudocode block like IF/ELSE.
  // It should be appended to the current block or handled by the parser's main logic.
  // Consider if FINALLY needs its own block type for closing with ENDIF or similar.
  // For now, let's assume it's just a comment within the flow.
  
  // state.outputLines.push(`${tryIndentation}// Finally block`);
  // return { convertedLine: ``, blockType: null }; // Or handle as a comment

  // To align with the IF/ELSE structure, FINALLY might not directly map well.
  // For now, let's treat it as a comment that doesn't alter block structure significantly.
  // The parser will need to ensure ENDIF is correctly placed after try-except-finally.
  // This might require `parser.ts` to handle `BLOCK_TYPES.FINALLY` specifically
  // when closing blocks.
  
  // For now, let's make it a comment and not return a block type that affects indentation stack.
  // The `closeCurrentBlock` in `parser.ts` will eventually close the IF (from TRY).
  return {
    convertedLine: `${tryIndentation}// Finally block (ensure code is executed)`,
    blockType: null // Does not start a new pseudocode block like IF/ELSE/ENDIF
  };
};
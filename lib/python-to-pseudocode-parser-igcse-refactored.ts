import { IGCSEPseudocodeParser } from './python-igcse/parser';

/**
 * Converts Python code to IGCSE pseudocode format.
 * @param pythonCode The Python source code to convert.
 * @returns The converted IGCSE pseudocode.
 */
export function pythonToIGCSEPseudocode(pythonCode: string): string {
  const parser = new IGCSEPseudocodeParser();
  return parser.parse(pythonCode);
}

// Re-export the parser class for advanced usage
export { IGCSEPseudocodeParser } from './python-igcse/parser';

// Re-export types for external usage
export type { ParseResult, BlockFrame, ParserState, ConverterFunction } from './python-igcse/types';
export type { BlockType } from './python-igcse/constants';
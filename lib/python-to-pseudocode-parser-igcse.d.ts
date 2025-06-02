/**
 * Converts Python code to IGCSE pseudocode format.
 * @param pythonCode The Python source code to convert.
 * @returns The converted IGCSE pseudocode.
 */
export declare function pythonToIGCSEPseudocode(pythonCode: string): string;
export { IGCSEPseudocodeParser } from './python-igcse/parser';
export type { ParseResult, BlockFrame, ParserState, ConverterFunction } from './python-igcse/types';
export type { BlockType } from './python-igcse/constants';

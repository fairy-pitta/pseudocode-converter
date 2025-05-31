import { BlockType } from './constants';

export interface ParseResult {
  convertedLine: string;
  blockType: BlockType | null;
  skipClose?: boolean; // Optional: To prevent automatic block closing for specific cases like for-collection
}

export interface ParserState {
  indentationLevels: number[];
  currentBlockTypes: BlockType[];
  outputLines: string[];
  isTryBlockOpen: boolean;
  tryBlockIndentationString: string | null; // Added for correct END TRY indentation
}

export interface ParseResult {
  convertedLine: string;
  blockType: BlockType | null;
  skipClose?: boolean; // Optional: To prevent automatic block closing for specific cases like for-collection
}

export type ConverterFunction = (line: string, indentation: string, state: ParserState) => ParseResult;
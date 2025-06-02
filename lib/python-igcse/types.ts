import { BlockType } from './constants';

export interface ParseResult {
  convertedLine: string;
  blockType: BlockFrame | null;
}

export interface BlockFrame {
  type: BlockType;
  ident?: string;
}

export interface ParserState {
  indentationLevels: number[];
  currentBlockTypes: BlockFrame[];
  outputLines: string[];
  declarations: Set<string>;
  typeFields?: Map<string, Set<string>>;
  isTryBlockOpen: boolean;
  tryBlockIndentationString: string | null;
  functionHasReturn: Map<string, boolean>; // Track if functions have return statements
}

export type ConverterFunction = (line: string, indentation: string, state: ParserState) => ParseResult | null;
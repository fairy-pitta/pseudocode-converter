import { ParserState, ParseResult, BlockFrame } from '../types';
import { PATTERNS } from '../patterns';
import { KEYWORDS, BLOCK_TYPES, OPERATORS, INDENT_SIZE } from '../constants';
import { convertConditionOperators, convertRangeEnd } from '../utils';

export const convertIf = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.IF);
  if (!match) return { convertedLine: line, blockType: null };
  
  const condition = convertConditionOperators(match[1].trim());
  const blockType: BlockFrame = { type: BLOCK_TYPES.IF };
  
  return { 
    convertedLine: `${indentation}${KEYWORDS.IF} ${condition} ${KEYWORDS.THEN}`, 
    blockType 
  };
};

export const convertElif = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.ELIF);
  if (!match) return { convertedLine: line, blockType: null };
  
  const condition = convertConditionOperators(match[1].trim());
  
  // For IGCSE, ELIF should be converted to ELSE IF
  const blockType: BlockFrame = { type: BLOCK_TYPES.ELIF };
  
  return { 
    convertedLine: `${indentation}${KEYWORDS.ELSE_IF} ${condition} ${KEYWORDS.THEN}`, 
    blockType 
  };
};

export const convertElse = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.ELSE.test(line)) return { convertedLine: line, blockType: null };
  
  // ELSE should be at the same level as the IF statement (no indentation for top-level if-else)
  const ifIndentation = '';
  
  const blockType: BlockFrame = { type: BLOCK_TYPES.ELSE };
  return { 
    convertedLine: `${ifIndentation}${KEYWORDS.ELSE}`, 
    blockType 
  };
};

export const convertForRange = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.FOR_RANGE);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1];
  const rangeArgs = match[2].split(',').map(arg => arg.trim());

  let start = '0';
  let end: string;
  let step = '1';

  if (rangeArgs.length === 1) {
    end = convertRangeEnd(rangeArgs[0]);
  } else if (rangeArgs.length >= 2) {
    start = rangeArgs[0];
    end = convertRangeEnd(rangeArgs[1]);
    if (rangeArgs.length === 3) {
      step = rangeArgs[2];
    }
  } else {
    return { convertedLine: line, blockType: null };
  }

  const stepPart = step === '1' ? '' : ` ${KEYWORDS.STEP} ${step}`;
  const blockType: BlockFrame = { type: BLOCK_TYPES.FOR, ident: variable };
  
  return { 
    convertedLine: `${indentation}${KEYWORDS.FOR} ${variable} ${OPERATORS.ASSIGN} ${start} ${KEYWORDS.TO} ${end}${stepPart}`, 
    blockType 
  };
};

export const convertForCollection = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.FOR_COLLECTION);
  if (!match || match[2].startsWith('range(')) return { convertedLine: line, blockType: null };

  const itemVariable = match[1];
  const collectionVariable = match[2];
  const blockType: BlockFrame = { type: BLOCK_TYPES.FOR, ident: itemVariable };
  
  return { 
    convertedLine: `${indentation}${KEYWORDS.FOR_EACH} ${itemVariable} ${KEYWORDS.IN} ${collectionVariable}`, 
    blockType 
  };
};

export const convertWhile = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.WHILE);
  if (!match) return { convertedLine: line, blockType: null };
  
  const condition = convertConditionOperators(match[1]);
  const blockType: BlockFrame = { type: BLOCK_TYPES.WHILE };
  
  return { 
    convertedLine: `${indentation}${KEYWORDS.WHILE} ${condition}`, 
    blockType 
  };
};

export const convertBreak = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.BREAK.test(line)) return { convertedLine: line, blockType: null };
  
  // Find the current loop type to determine the correct break statement
  const currentLoop = state.currentBlockTypes.slice().reverse().find(block => 
    block.type === BLOCK_TYPES.FOR || block.type === BLOCK_TYPES.WHILE
  );
  
  if (currentLoop?.type === BLOCK_TYPES.FOR) {
    return {
      convertedLine: `${indentation}EXIT FOR`,
      blockType: null
    };
  } else if (currentLoop?.type === BLOCK_TYPES.WHILE) {
    return {
      convertedLine: `${indentation}EXIT WHILE`,
      blockType: null
    };
  }
  
  // Fallback if no loop context found
  return {
    convertedLine: `${indentation}// break - exit loop`,
    blockType: null
  };
};

export const convertContinue = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.CONTINUE.test(line)) return { convertedLine: line, blockType: null };
  
  // Find the current loop type to determine the correct continue statement
  const currentLoop = state.currentBlockTypes.slice().reverse().find(block => 
    block.type === BLOCK_TYPES.FOR || block.type === BLOCK_TYPES.WHILE
  );
  
  if (currentLoop?.type === BLOCK_TYPES.FOR) {
    return {
      convertedLine: `${indentation}NEXT ${currentLoop.ident || 'i'}`,
      blockType: null
    };
  } else if (currentLoop?.type === BLOCK_TYPES.WHILE) {
    return {
      convertedLine: `${indentation}CONTINUE WHILE`,
      blockType: null
    };
  }
  
  // Fallback if no loop context found
  return {
    convertedLine: `${indentation}// continue - skip to next iteration`,
    blockType: null
  };
};

export const controlFlowConverters = {
  convertIf,
  convertElif,
  convertElse,
  convertForRange,
  convertForCollection,
  convertWhile,
  convertBreak,
  convertContinue,
};
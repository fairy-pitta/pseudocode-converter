import { ParserState, ParseResult } from '../types';
import { PATTERNS } from '../patterns';
import { KEYWORDS, BLOCK_TYPES, OPERATORS } from '../constants';
import { convertConditionOperators, getCurrentIndentation } from '../utils';

export const convertIf = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.IF);
  if (!match) return { convertedLine: line, blockType: null };
  const condition = convertConditionOperators(match[1].trim()); // Ensure condition itself is trimmed before use
  return { convertedLine: `${indentation}${KEYWORDS.IF} ${condition} ${KEYWORDS.THEN}`, blockType: BLOCK_TYPES.IF };
};

export const convertElif = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.ELIF);
  if (!match) return { convertedLine: line, blockType: null };
  const condition = convertConditionOperators(match[1]);
  // ELIF needs to correctly close the previous IF/ELIF before opening a new one at the same indent level.
  // This is handled by the main parser logic by comparing current indentation with the stack.
  return { convertedLine: `${indentation}${KEYWORDS.ELSE_IF} ${condition} ${KEYWORDS.THEN}`, blockType: BLOCK_TYPES.ELIF };
};

export const convertElse = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.ELSE.test(line)) return { convertedLine: line, blockType: null };
  // ELSE needs to correctly close the previous IF/ELIF before opening at the same indent level.
  return { convertedLine: `${indentation}${KEYWORDS.ELSE}`, blockType: BLOCK_TYPES.ELSE };
};

export const convertForRange = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.FOR_RANGE);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1];
  const rangeArgs = match[2].split(',').map(arg => arg.trim());

  let start = '0';
  let end;
  // let step = '1'; // Step is not directly supported in IB 'loop from to' syntax

  if (rangeArgs.length === 1) {
    end = `${parseInt(rangeArgs[0]) - 1}`;
  } else if (rangeArgs.length >= 2) {
    start = rangeArgs[0];
    end = `${parseInt(rangeArgs[1]) - 1}`;
    // if (rangeArgs.length === 3) step = rangeArgs[2];
  }

  if (end === undefined) return { convertedLine: line, blockType: null }; // Invalid range

  return { convertedLine: `${indentation}${KEYWORDS.FOR} ${variable} ${KEYWORDS.FROM} ${start} ${KEYWORDS.TO} ${end}`, blockType: BLOCK_TYPES.FOR };
};

export const convertForCollection = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.FOR_COLLECTION);
  if (!match) return { convertedLine: line, blockType: null };

  const itemVariable = match[1];
  const collectionVariable = match[2];

  const resetLine = `${indentation}${collectionVariable}${KEYWORDS.RESET_NEXT}`;
  const loopLine = `${indentation}${KEYWORDS.FOR} ${KEYWORDS.WHILE} ${collectionVariable}${KEYWORDS.HAS_NEXT}`;
  const getNextLine = `${indentation}    ${itemVariable} ${OPERATORS.ASSIGN} ${collectionVariable}${KEYWORDS.GET_NEXT}`;
  
  // Add these lines directly to output and then return an empty line to signify the block start
  state.outputLines.push(resetLine);
  state.outputLines.push(loopLine);
  state.outputLines.push(getNextLine);

  return { convertedLine: "", blockType: BLOCK_TYPES.FOR, skipClose: false }; // skipClose is false as the main loop will handle it.
};

export const convertWhile = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.WHILE);
  if (!match) return { convertedLine: line, blockType: null };
  const condition = convertConditionOperators(match[1]);
  return { convertedLine: `${indentation}${KEYWORDS.WHILE} ${condition} ${KEYWORDS.DO}`, blockType: BLOCK_TYPES.WHILE };
};

export const convertRepeat = (line: string, indentation: string, state: ParserState): ParseResult => {
  // This converter looks for 'while True:' combined with a '# repeat' comment
  const isWhileTrue = PATTERNS.WHILE.test(line) && line.includes('True');
  const hasRepeatComment = PATTERNS.REPEAT_COMMENT.test(line);

  if (isWhileTrue && hasRepeatComment) {
    return { convertedLine: `${indentation}${KEYWORDS.REPEAT}`, blockType: BLOCK_TYPES.REPEAT };
  }
  return { convertedLine: line, blockType: null };
};

export const convertTry = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.TRY.test(line)) return { convertedLine: line, blockType: null };
  state.isTryBlockOpen = true;
  state.tryBlockIndentationString = indentation; // Store indentation of TRY block
  return { convertedLine: `${indentation}${KEYWORDS.TRY}`, blockType: BLOCK_TYPES.TRY };
};

export const convertExcept = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.EXCEPT);
  if (!match) return { convertedLine: line, blockType: null };
  const exceptionType = match[1] ? ` ${match[1].trim()}` : '';
  // Use the stored try block indentation for proper alignment
  const tryIndentation = state.tryBlockIndentationString || '';
  return { convertedLine: `${tryIndentation}${KEYWORDS.CATCH}${exceptionType}`, blockType: BLOCK_TYPES.CATCH };
};

export const convertFinally = (line: string, indentation: string, state: ParserState): ParseResult => {
  if (!PATTERNS.FINALLY.test(line)) return { convertedLine: line, blockType: null };
  // Use the stored try block indentation for proper alignment
  const tryIndentation = state.tryBlockIndentationString || '';
  return { convertedLine: `${tryIndentation}${KEYWORDS.FINALLY}`, blockType: BLOCK_TYPES.FINALLY };
};

export const controlFlowConverters = {
  convertIf,
  convertElif,
  convertElse,
  convertForRange,
  convertForCollection,
  convertWhile,
  convertRepeat,
  convertTry,
  convertExcept,
  convertFinally,
};
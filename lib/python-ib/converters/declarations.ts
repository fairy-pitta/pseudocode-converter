import { PATTERNS } from '../patterns';
import { KEYWORDS, OPERATORS, BLOCK_TYPES } from '../constants';
import { ParseResult, ParserState } from '../types';
import { convertConditionOperators } from '../utils';

export const convertFunctionDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.FUNCTION_DEF);
  if (!match) return { convertedLine: line, blockType: null };

  const functionName = match[1];
  const params = match[2] ? match[2].split(',').map(p => p.trim()).join(', ') : '';
  const isProcedure = PATTERNS.PROCEDURE_COMMENT.test(line);

  const keyword = isProcedure ? KEYWORDS.PROCEDURE : KEYWORDS.FUNCTION;
  const blockType = isProcedure ? BLOCK_TYPES.PROCEDURE : BLOCK_TYPES.FUNCTION;

  return { convertedLine: `${indentation}${keyword} ${functionName}(${params})`, blockType };
};

export const convertClassDef = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.CLASS_DEF);
  if (!match) return { convertedLine: line, blockType: null };

  const className = match[1];
  const parentClass = match[2] ? ` ${KEYWORDS.INHERITS} ${match[2]}` : '';

  return { convertedLine: `${indentation}${KEYWORDS.CLASS} ${className}${parentClass}`, blockType: BLOCK_TYPES.CLASS };
};

export const declarationConverters = {
  convertFunctionDef,
  convertClassDef,
};
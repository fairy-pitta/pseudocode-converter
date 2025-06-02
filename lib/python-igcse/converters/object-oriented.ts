import { PATTERNS } from '../patterns';
import { KEYWORDS, OPERATORS } from '../constants';
import { ParseResult, ParserState } from '../types';
import { convertConditionOperators } from '../utils';

export const convertObjectInstantiation = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.OBJECT_INSTANTIATION);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1];
  const className = match[2];
  const args = match[3];

  // Process arguments
  const processedArgs = args
    .split(',')
    .map(arg => arg.trim())
    .filter(arg => arg)
    .map(arg => convertConditionOperators(arg))
    .join(', ');

  // Mark variable as declared
  state.declarations.add(variable);

  return {
    convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${KEYWORDS.NEW} ${className}(${processedArgs})`,
    blockType: null
  };
};

export const convertMethodCall = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.METHOD_CALL);
  if (!match) return { convertedLine: line, blockType: null };

  const object = match[1];
  const method = match[2];
  const args = match[3];

  // Capitalize method name for pseudocode convention
  const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);

  // Process arguments
  const processedArgs = args
    .split(',')
    .map(arg => arg.trim())
    .filter(arg => arg)
    .map(arg => convertConditionOperators(arg))
    .join(', ');

  return {
    convertedLine: `${indentation}${KEYWORDS.CALL} ${object}.${capitalizedMethod}(${processedArgs})`,
    blockType: null
  };
};

export const convertMethodAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.METHOD_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1];
  const object = match[2];
  const method = match[3];
  const args = match[4];

  // Capitalize method name for pseudocode convention
  const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);

  // Process arguments
  const processedArgs = args
    .split(',')
    .map(arg => arg.trim())
    .filter(arg => arg)
    .map(arg => convertConditionOperators(arg))
    .join(', ');

  // Mark variable as declared
  state.declarations.add(variable);

  return {
    convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${object}.${capitalizedMethod}(${processedArgs})`,
    blockType: null
  };
};

export const convertSelfAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.SELF_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const attribute = match[1];
  let value = match[2].trim();

  // Convert condition operators in the value
  value = convertConditionOperators(value);

  // Convert self.attribute to self.attribute in pseudocode
  return {
    convertedLine: `${indentation}${KEYWORDS.SELF}.${attribute} ${OPERATORS.ASSIGN} ${value}`,
    blockType: null
  };
};

export const objectOrientedConverters = {
  convertObjectInstantiation,
  convertMethodCall,
  convertMethodAssignment,
  convertSelfAssignment,
};
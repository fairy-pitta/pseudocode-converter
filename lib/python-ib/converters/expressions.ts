import { ParserState, ParseResult } from '../types';
import { PATTERNS } from '../patterns';
import { OPERATORS, KEYWORDS, COMPOUND_ASSIGNMENT_OPERATORS } from '../constants';
import { convertConditionOperators } from '../utils';

export const convertAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1].trim();
  let value = match[2].trim();

  // Handle input separately if it's part of the assignment
  const inputMatch = value.match(/^input(?:\((?:\"(.*)\"|'(.*)')?\))?/);
  if (inputMatch) {
    return { convertedLine: `${indentation}${KEYWORDS.INPUT} ${variable}`, blockType: null };
  }

  value = convertConditionOperators(value);
  return { convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${value}`, blockType: null };
};

export const convertCompoundAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.COMPOUND_ASSIGNMENT);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1].trim();
  const operator = match[2];
  let value = match[3].trim();
  value = convertConditionOperators(value); // Apply operator conversion to the value

  const opMapping = COMPOUND_ASSIGNMENT_OPERATORS.find(op => op.python === operator);
  if (opMapping) {
    return { convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${variable} ${opMapping.pseudocode} ${value}`, blockType: null };
  }
  // Fallback if operator not in map (should not happen with current regex)
  // Ensure the fallback still uses the assignment operator for pseudocode consistency
  return { convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${variable} ${operator} ${value}`, blockType: null }; 
};

export const convertPrint = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.PRINT);
  if (!match) return { convertedLine: line, blockType: null };

  let content = match[1].trim();

  // Check if the content is an f-string
  const fStringMatch = content.match(/^f(['"])(.*)\1$/);
  if (fStringMatch) {
    const innerContent = fStringMatch[2];
    // Split by {variable} syntax, keeping the delimiters
    const parts = innerContent.split(/({[^}]+})/g);
    let newContent = '';
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith('{') && part.endsWith('}')) {
        const variableName = part.substring(1, part.length - 1);
        if (newContent) newContent += ` ${OPERATORS.CONCAT} `;
        newContent += variableName;
      } else if (part) { // Non-empty string part
        if (newContent) newContent += ` ${OPERATORS.CONCAT} `;
        // Ensure all string parts are correctly quoted
        newContent += `"${part.replace(/"/g, '\"')}"`;
      }
    }
    content = newContent;
  } else {
    // For non-f-strings, apply existing operator conversion
    content = convertConditionOperators(content);
  }

  return { convertedLine: `${indentation}${KEYWORDS.OUTPUT} ${content}`, blockType: null };
};

export const convertReturn = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(PATTERNS.RETURN);
  if (!match) return { convertedLine: line, blockType: null };
  const value = match[1] ? convertConditionOperators(match[1].trim()) : '';
  return { convertedLine: `${indentation}${KEYWORDS.RETURN}${value ? ' ' + value : ''}`, blockType: null };
};

export const convertStandaloneExpression = (line: string, indentation: string, state: ParserState): ParseResult => {
    // This is a simple pass-through for now, assuming it's a procedure call.
    // More sophisticated handling might be needed for other standalone expressions.
    if (PATTERNS.STANDALONE_EXPRESSION.test(line.trim())) {
        return { convertedLine: `${indentation}${line.trim()}`, blockType: null };
    }
    return { convertedLine: line, blockType: null };
};


export const expressionConverters = {
  convertAssignment,
  convertCompoundAssignment,
  convertPrint,
  convertReturn,
  convertStandaloneExpression,
};
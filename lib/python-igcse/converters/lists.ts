import { ParseResult, ParserState } from '../types';
import { PATTERNS } from '../patterns';
import { OPERATORS } from '../constants';
import { convertConditionOperators } from '../utils';

// Handle list declarations like: numbers = [1, 2, 3, 4, 5]
export const convertListDeclaration = (line: string, indentation: string, state: ParserState): ParseResult | null => {
  const match = line.match(/^([A-Za-z_]\w*)\s*=\s*\[(.*)\]$/);
  if (!match) return { convertedLine: line, blockType: null };

  const [, variable, content] = match;

  // Handle empty list - return null to skip output
  if (!content.trim()) {
    return null;
  }

  // Parse list elements
  const elements = content.split(',').map(elem => elem.trim());
  const result: string[] = [];

  // Convert each element to array assignment
  elements.forEach((element, index) => {
    let convertedElement = element;
    
    // Convert Python boolean values
    if (element === 'True') {
      convertedElement = 'TRUE';
    } else if (element === 'False') {
      convertedElement = 'FALSE';
    } else if (!isNaN(Number(element)) && !element.includes('"') && !element.includes("'")) {
      // Keep numbers as numbers for IGCSE
      convertedElement = element;
    }
    
    convertedElement = convertConditionOperators(convertedElement);
    result.push(`${indentation}${variable}[${index}] ${OPERATORS.ASSIGN} ${convertedElement}`);
  });

  // Track variable for potential future use
  if (!state.declarations.has(variable)) {
    state.declarations.add(variable);
  }

  return { 
    convertedLine: result.join('\n'), 
    blockType: null 
  };
};

// Handle list access like: first = numbers[0]
export const convertListAccess = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(/^([A-Za-z_]\w*)\s*=\s*([A-Za-z_]\w*)\[(\d+)\]\s*$/);
  if (!match) return { convertedLine: line, blockType: null };

  const variable = match[1].trim();
  const arrayName = match[2].trim();
  const index = match[3].trim();

  // Track variable for potential future use
  if (!state.declarations.has(variable)) {
    state.declarations.add(variable);
  }

  return { 
    convertedLine: `${indentation}${variable} ${OPERATORS.ASSIGN} ${arrayName}[${index}]`, 
    blockType: null 
  };
};

// Handle list assignment like: numbers[1] = 10
export const convertListAssignment = (line: string, indentation: string, state: ParserState): ParseResult => {
  const match = line.match(/^([A-Za-z_]\w*)\[(\d+)\]\s*=\s*(.+)$/);
  if (!match) return { convertedLine: line, blockType: null };

  const arrayName = match[1].trim();
  const index = match[2].trim();
  let value = match[3].trim();

  value = convertConditionOperators(value);

  return { 
    convertedLine: `${indentation}${arrayName}[${index}] ${OPERATORS.ASSIGN} ${value}`, 
    blockType: null 
  };
};
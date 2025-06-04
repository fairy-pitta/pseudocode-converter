import { SYSTEM_OUT_PRINTLN, LOGICAL_OPERATION_BINARY, LOGICAL_OPERATION_UNARY_NOT, STRING_ASSIGNMENT, INCREMENT, DECREMENT } from '../patterns';
import { toIBPseudocode } from '../utils';

export function convertSystemOutPrintln(line: string): string | null {
  const match = line.match(SYSTEM_OUT_PRINTLN);
  if (!match) return null;
  
  const content = match[1].trim();
  return `output ${toIBPseudocode(content)}`;
}

export function convertLogicalOperation(line: string): string | null {
  // Try binary operation first
  const binaryMatch = line.match(LOGICAL_OPERATION_BINARY);
  if (binaryMatch) {
    const variableName = binaryMatch[1].trim();
    const leftOperand = binaryMatch[2].trim();
    const operator = binaryMatch[3].trim();
    const rightOperand = binaryMatch[4].trim();
    
    const ibOperator = operator === '&&' ? 'AND' : 'OR';
    
    return `${variableName.toUpperCase()} ← ${toIBPseudocode(leftOperand)} ${ibOperator} ${toIBPseudocode(rightOperand)}`;
  }
  
  // Then try unary NOT
  const unaryMatch = line.match(LOGICAL_OPERATION_UNARY_NOT);
  if (unaryMatch) {
    const variableName = unaryMatch[1].trim();
    const operand = unaryMatch[2].trim();
    
    return `${variableName.toUpperCase()} ← NOT ${toIBPseudocode(operand)}`;
  }
  
  return null;
}

export function convertStringAssignment(line: string): string | null {
  const match = line.match(STRING_ASSIGNMENT);
  if (!match) return null;
  
  const variableName = match[1].trim();
  const value = match[2].trim();
  
  return `${variableName.toUpperCase()} ← ${toIBPseudocode(value)}`;
}

export function convertIncrement(line: string): string | null {
  const match = line.match(INCREMENT);
  if (!match) return null;
  
  const variableName = match[1].trim();
  
  return `${variableName.toUpperCase()} ← ${variableName.toUpperCase()} + 1`;
}

export function convertDecrement(line: string): string | null {
  const match = line.match(DECREMENT);
  if (!match) return null;
  
  const variableName = match[1].trim();
  
  return `${variableName.toUpperCase()} ← ${variableName.toUpperCase()} - 1`;
}
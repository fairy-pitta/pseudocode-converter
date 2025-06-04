import { VARIABLE_DECLARATION_ASSIGNMENT } from '../patterns';
import { toIBPseudocode } from '../utils';

export function convertVariableDeclarationAssignment(line: string): string | null {
  const match = line.match(VARIABLE_DECLARATION_ASSIGNMENT);
  if (!match) return null;
  
  const type = match[1].trim();
  const variableName = match[2].trim();
  const value = match[3].trim();
  
  // Convert to IB pseudocode format
  return `${variableName.toUpperCase()} ← ${toIBPseudocode(value)}`;
}
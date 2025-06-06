import { VARIABLE_DECLARATION_ASSIGNMENT } from '../patterns';
import { toIBPseudocode } from '../utils';
import { ExpressionParser } from '../expression-parser';

export function convertVariableDeclarationAssignment(line: string): string | null {
  const match = line.match(VARIABLE_DECLARATION_ASSIGNMENT);
  if (!match) return null;
  
  const type = match[1].trim();
  const variableName = match[2].trim();
  const value = match[3].trim();
  
  // 複雑な式の場合は式パーサーを使用し、それ以外は toIBPseudocode を使用
  let parsedValue;
  try {
    // まず ExpressionParser でのパースを試みる
    parsedValue = ExpressionParser.parse(value);
    // 結果に対して演算子変換を適用
    parsedValue = parsedValue.replace(/\//g, 'div').replace(/%/g, 'mod');
  } catch (e) {
    // ExpressionParser でエラーが発生した場合、toIBPseudocode をフォールバックとして使用
    console.warn(`[convertVariableDeclarationAssignment] ExpressionParser failed for value: "${value}". Falling back to toIBPseudocode. Error: ${e}`);
    parsedValue = toIBPseudocode(value);
  }
  return `${variableName.toUpperCase()} ← ${parsedValue}`;
}
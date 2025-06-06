import { SYSTEM_OUT_PRINTLN, LOGICAL_OPERATION_BINARY, LOGICAL_OPERATION_UNARY_NOT, STRING_ASSIGNMENT, INCREMENT, DECREMENT, ARITHMETIC_OPERATION} from '../patterns';
import { toIBPseudocode } from '../utils';
import { ExpressionParser } from '../expression-parser';

export function convertSystemOutPrintln(line: string): string | null {
  const match = line.match(SYSTEM_OUT_PRINTLN);
  if (!match) return null;
  
  const content = match[1].trim();
  // 一時的にシンプルな実装を使用
  try {
    return `output ${ExpressionParser.parse(content)}`;
  } catch (error) {
    // ExpressionParserでエラーが発生した場合は、シンプルな変換を使用
    console.warn(`ExpressionParser failed for: ${content}, using simple conversion`);
    if (content.startsWith('"') && content.endsWith('"')) {
      return `output ${content}`;
    }
    // 変数名を大文字に変換
    return `output ${content.toUpperCase()}`;
  }
}

export function convertLogicalOperation(line: string): string | null {
  console.log(`[convertLogicalOperation] called with line: '${line}'`); // Add log
  // Try binary operation first
  const binaryMatch = line.match(LOGICAL_OPERATION_BINARY);
  if (binaryMatch) {
    const variableName = binaryMatch[1].trim();
    const leftOperand = binaryMatch[2].trim();
    const operator = binaryMatch[3].trim();
    const rightOperand = binaryMatch[4].trim();

    console.log(`[convertLogicalOperation] rightOperand: '${rightOperand}'`); // Add log
    const parsedRightOperand = ExpressionParser.parse(rightOperand);
    console.log(`[convertLogicalOperation] parsedRightOperand: '${parsedRightOperand}'`); // Add log
    
    const ibOperator = operator === '&&' ? 'AND' : 'OR';
    
    return `${variableName.toUpperCase()} ← ${ExpressionParser.parse(leftOperand)} ${ibOperator} ${parsedRightOperand}`;
  }
  
  // Then try unary NOT
  const unaryMatch = line.match(LOGICAL_OPERATION_UNARY_NOT);
  if (unaryMatch) {
    const variableName = unaryMatch[1].trim();
    const operand = unaryMatch[2].trim();
    
    return `${variableName.toUpperCase()} ← NOT ${ExpressionParser.parse(operand)}`;
  }
  
  return null;
}

export function convertStringAssignment(line: string): string | null {
  const match = line.match(STRING_ASSIGNMENT);
  if (!match) return null;
  
  const variableName = match[1].trim();
  const value = match[2].trim();
  
  return `${variableName.toUpperCase()} ← ${ExpressionParser.parse(value)}`;
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

export function convertArithmeticOperation(line: string): string | null {
  const match = line.match(ARITHMETIC_OPERATION);
  if (!match) return null;


  const variableName = match[1].trim();
  const leftOperand  = match[2].trim();
  const operator     = match[3].trim();
  const rightOperand = match[4].trim();

  // 演算子を直接変換
  let ibOperator = operator;
  if (operator === '/') {
    ibOperator = 'div';
  } else if (operator === '%') {
    ibOperator = 'mod';
  }

  // 変数名を大文字に変換
  const leftVar = leftOperand.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) ? leftOperand.toUpperCase() : leftOperand;
  const rightVar = rightOperand.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) ? rightOperand.toUpperCase() : rightOperand;
  
  console.log("ConvertArithmeticOperation was called");
  return `${variableName.toUpperCase()} ← ${leftVar} ${ibOperator} ${rightVar}`;
}

export function convertComparisonOperation(line: string): string | null {
  const COMPARISON_OPERATION = /^\s*boolean\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\((.+?)\s*(==|!=|>=|<=|>|<)\s*(.+?)\);\s*$/;
  const match = line.match(COMPARISON_OPERATION);
  if (!match) return null;

  const variableName = match[1].trim();
  const leftOperand = match[2].trim();
  const operator = match[3].trim();
  const rightOperand = match[4].trim();

  // 複雑な式の場合は式パーサーを使用
  const expression = `${leftOperand} ${operator} ${rightOperand}`;
  const parsedExpression = ExpressionParser.parse(expression);

  return `${variableName.toUpperCase()} ← ${parsedExpression}`;
}
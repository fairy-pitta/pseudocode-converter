import { ExpressionParser } from './expression-parser';

/**
 * Java式をIB擬似コードに変換する
 * @param name 変換するJava式
 * @returns IB擬似コード形式の式
 */
export function toIBPseudocode(name: string): string {
  console.log(`toIBPseudocode input: ${name}`);
  
  // 単純な式の場合は従来の方法で処理
  // 文字列リテラル
  if (name.startsWith('"') && name.endsWith('"')) {
    console.log(`toIBPseudocode output (string literal): ${name}`);
    return name;
  }

  // 真偽値リテラル
  if (name.toLowerCase() === 'true') {
    console.log('toIBPseudocode output (boolean true): TRUE');
    return 'TRUE';
  }
  if (name.toLowerCase() === 'false') {
    console.log('toIBPseudocode output (boolean false): FALSE');
    return 'FALSE';
  }

  // 算術演算の直接処理
  const arithmeticMatch = name.match(/^([a-zA-Z_][a-zA-Z0-9_]*|\d+(?:\.\d+)?)\s*([+\-*/%])\s*([a-zA-Z_][a-zA-Z0-9_]*|\d+(?:\.\d+)?)$/);
  if (arithmeticMatch) {
    const left = arithmeticMatch[1].trim();
    const operator = arithmeticMatch[2].trim();
    const right = arithmeticMatch[3].trim();
    
    let ibOperator = operator;
    if (operator === '/') {
      ibOperator = 'div';
    } else if (operator === '%') {
      ibOperator = 'mod';
    }
    
    const leftVar = left.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) ? left.toUpperCase() : left;
    const rightVar = right.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) ? right.toUpperCase() : right;
    
    const result = `${leftVar} ${ibOperator} ${rightVar}`;
    console.log(`toIBPseudocode output (arithmetic): ${result}`);
    return result;
  }

  // 複雑な式の場合は式パーサーを使用
  try {
    // 演算子を含む式かどうかを簡易チェック
    if (name.match(/[+\-*/%=!<>&|()]/)) {
      let result = ExpressionParser.parse(name);
      // 結果に対して演算子変換を適用
      result = result.replace(/\//g, 'div').replace(/%/g, 'mod');
      console.log(`toIBPseudocode output (parsed expression): ${result}`);
      return result;
    }
  } catch (error) {
    console.error(`式の解析中にエラーが発生しました: ${name}`);
    console.error(error);
  }

  // 単純な識別子の場合は大文字に変換
  const result = name.toUpperCase();
  console.log(`toIBPseudocode output (uppercase): ${result}`);
  return result;
}
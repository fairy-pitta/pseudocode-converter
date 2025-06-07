import { describe, it, expect } from 'vitest';
import { ExpressionParser } from '../lib/java-ib/expression-parser';

describe('ExpressionParser修正版テスト', () => {
  it('比較演算子 (p == q) を正しく変換する', () => {
    const result = ExpressionParser.parse('(p == q)');
    console.log('比較演算子テスト結果:', result);
    expect(result).toBe('(P = Q)');
  });

  it('算術演算子 (a + b) を正しく変換する', () => {
    const result = ExpressionParser.parse('(a + b)');
    console.log('算術演算子テスト結果:', result);
    expect(result).toBe('(A + B)');
  });

  it('論理演算子 (x && y) を正しく変換する', () => {
    const result = ExpressionParser.parse('(x && y)');
    console.log('論理演算子テスト結果:', result);
    expect(result).toBe('(X AND Y)');
  });

  it('単純な変数 variable を正しく変換する', () => {
    const result = ExpressionParser.parse('variable');
    console.log('変数テスト結果:', result);
    expect(result).toBe('VARIABLE');
  });

  it('数値リテラル 42 をそのまま返す', () => {
    const result = ExpressionParser.parse('42');
    console.log('数値リテラルテスト結果:', result);
    expect(result).toBe('42');
  });
});
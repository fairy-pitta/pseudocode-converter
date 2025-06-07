import { ExpressionParser } from './lib/java-ib/expression-parser.ts';
import { Java2IB } from './lib/java-to-pseudocode-parser-ib.ts';

console.log('=== Expression Parser Tests ===');

// Test 1: 比較演算子
try {
  const result1 = ExpressionParser.parse('(p == q)');
  console.log('✓ 比較演算子テスト:', result1);
  console.log('  期待値: (P = Q), 実際: ' + result1);
  console.log('  結果:', result1 === '(P = Q)' ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('✗ 比較演算子テスト失敗:', error.message);
}

// Test 2: 算術演算子
try {
  const result2 = ExpressionParser.parse('(a + b)');
  console.log('✓ 算術演算子テスト:', result2);
  console.log('  期待値: (A + B), 実際: ' + result2);
  console.log('  結果:', result2 === '(A + B)' ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('✗ 算術演算子テスト失敗:', error.message);
}

// Test 3: 論理演算子
try {
  const result3 = ExpressionParser.parse('(x && y)');
  console.log('✓ 論理演算子テスト:', result3);
  console.log('  期待値: (X AND Y), 実際: ' + result3);
  console.log('  結果:', result3 === '(X AND Y)' ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('✗ 論理演算子テスト失敗:', error.message);
}

// Test 4: 変数
try {
  const result4 = ExpressionParser.parse('variable');
  console.log('✓ 変数テスト:', result4);
  console.log('  期待値: VARIABLE, 実際: ' + result4);
  console.log('  結果:', result4 === 'VARIABLE' ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('✗ 変数テスト失敗:', error.message);
}

// Test 5: 数値リテラル
try {
  const result5 = ExpressionParser.parse('42');
  console.log('✓ 数値リテラルテスト:', result5);
  console.log('  期待値: 42, 実際: ' + result5);
  console.log('  結果:', result5 === '42' ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('✗ 数値リテラルテスト失敗:', error.message);
}

console.log('\n=== Java2IB Parser Tests ===');

// Java2IB Tests
const parser = new Java2IB();

// Test 1: 変数宣言と代入
try {
  const result = parser.convert('int x = 5;');
  console.log('✓ 変数宣言テスト:', result);
  console.log('  結果:', result.includes('X') ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('✗ 変数宣言テスト失敗:', error.message);
}

// Test 2: System.out.println
try {
  const result = parser.convert('System.out.println("Hello");');
  console.log('✓ System.out.printlnテスト:', result);
  console.log('  結果:', result.includes('output') ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('✗ System.out.printlnテスト失敗:', error.message);
}

// Test 3: if文
try {
  const result = parser.convert('if (x > 0) { y = 1; }');
  console.log('✓ if文テスト:', result);
  console.log('  結果:', result.includes('if') ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('✗ if文テスト失敗:', error.message);
}

console.log('\n=== テスト完了 ===');
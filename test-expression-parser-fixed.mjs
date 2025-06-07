// 直接TypeScriptファイルをインポートできないため、java-astパッケージを使用して
// ExpressionParserの機能を再現するテストスクリプトを作成

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'java-ast';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Testing Expression Parser Logic ===');

// テスト用のJavaコード
const testJavaCode = `
public class Test {
    public void testMethod() {
        System.out.println((p == q));
    }
}
`;

// 比較演算子の変換関数
function transformComparisonOperator(expr) {
  // 比較演算子の変換
  return expr.replace(/==/g, '=');
}

// 大文字変換関数
function transformToUpperCase(expr) {
  return expr.toUpperCase();
}

// AST解析とExpressionParserのロジックを再現
async function testExpressionParser() {
  try {
    console.log('\n--- Parsing Java Code ---');
    console.log('Java Code:\n', testJavaCode);
    
    // Javaコードをパース
    const ast = parse(testJavaCode);
    
    // AST構造を探索して比較式を抽出
    console.log('\n--- Extracting Expression ---');
    
    // CompilationUnitContextを取得
    if (!ast || !ast.children || ast.children.length === 0) {
      throw new Error('AST is empty or invalid');
    }
    
    // TypeDeclarationContextを探す
    const typeDeclaration = ast.children.find(child => 
      child.constructor.name === 'TypeDeclarationContext');
    if (!typeDeclaration) {
      throw new Error('TypeDeclarationContext not found');
    }
    
    // ClassDeclarationContextを探す
    const classDeclaration = typeDeclaration.children.find(child => 
      child.constructor.name === 'ClassDeclarationContext');
    if (!classDeclaration) {
      throw new Error('ClassDeclarationContext not found');
    }
    
    // ClassBodyContextを探す
    const classBody = classDeclaration.children.find(child => 
      child.constructor.name === 'ClassBodyContext');
    if (!classBody) {
      throw new Error('ClassBodyContext not found');
    }
    
    console.log('ClassBody children count:', classBody.children.length);
    classBody.children.forEach((child, index) => {
      console.log(`  ClassBody Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
    });
    
    // ClassBodyDeclarationContextを探す
    const classBodyDeclaration = classBody.children.find(child => 
      child.constructor.name === 'ClassBodyDeclarationContext');
    if (!classBodyDeclaration) {
      throw new Error('ClassBodyDeclarationContext not found');
    }
    
    console.log('ClassBodyDeclaration children count:', classBodyDeclaration.children.length);
    classBodyDeclaration.children.forEach((child, index) => {
      console.log(`  ClassBodyDeclaration Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
    });
    
    // ClassBodyDeclarationContextの中からMethodDeclarationContextを探す
    let methodDeclaration = classBodyDeclaration.children.find(child => 
      child.constructor.name === 'MethodDeclarationContext');
    
    if (!methodDeclaration) {
      // MemberDeclarationContextを探してみる
      const memberDeclaration = classBodyDeclaration.children.find(child => 
        child.constructor.name === 'MemberDeclarationContext');
      if (memberDeclaration) {
        console.log('Found MemberDeclarationContext, exploring its children:');
        memberDeclaration.children.forEach((child, index) => {
          console.log(`  MemberDeclaration Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
        });
        
        // MemberDeclarationContextの中からMethodDeclarationContextを探す
        methodDeclaration = memberDeclaration.children.find(child => 
          child.constructor.name === 'MethodDeclarationContext');
        if (!methodDeclaration) {
          throw new Error('MethodDeclarationContext not found in MemberDeclarationContext');
        }
      } else {
        throw new Error('MethodDeclarationContext not found');
      }
    }
    
    console.log('Found MethodDeclarationContext:', methodDeclaration.constructor.name);
    
    console.log('MethodDeclaration children count:', methodDeclaration.children.length);
    methodDeclaration.children.forEach((child, index) => {
      console.log(`  MethodDeclaration Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
    });
    
    // MethodBodyContextを探す
    const methodBody = methodDeclaration.children.find(child => 
      child.constructor.name === 'MethodBodyContext');
    if (!methodBody) {
      throw new Error('MethodBodyContext not found');
    }
    
    console.log('MethodBody children count:', methodBody.children.length);
    methodBody.children.forEach((child, index) => {
      console.log(`  MethodBody Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
    });
    
    // BlockContextを探す
    const block = methodBody.children.find(child => 
      child.constructor.name === 'BlockContext');
    if (!block) {
      throw new Error('BlockContext not found');
    }
    
    console.log('Block children count:', block.children.length);
    block.children.forEach((child, index) => {
      console.log(`  Block Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
    });
    
    // BlockStatementContextを探す
    const blockStatement = block.children.find(child => 
      child.constructor.name === 'BlockStatementContext');
    if (!blockStatement) {
      throw new Error('BlockStatementContext not found');
    }
    
    console.log('BlockStatement children count:', blockStatement.children.length);
    blockStatement.children.forEach((child, index) => {
      console.log(`  BlockStatement Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
    });
    
    // BlockStatementContextの中からStatementContextを探す
    const statement = blockStatement.children.find(child => 
      child.constructor.name === 'StatementContext');
    if (!statement) {
      throw new Error('StatementContext not found in BlockStatementContext');
    }
    
    // ExpressionContextを探す
    const expression = statement.children.find(child => 
      child.constructor.name === 'ExpressionContext');
    if (!expression) {
      throw new Error('ExpressionContext not found');
    }
    
    // MethodCallContextを探す
    const methodCall = expression.children.find(child => 
      child.constructor.name === 'MethodCallContext');
    if (!methodCall) {
      throw new Error('MethodCallContext not found');
    }
    
    // ArgumentsContextを探す
    const args = methodCall.children.find(child => 
      child.constructor.name === 'ArgumentsContext');
    if (!args) {
      throw new Error('ArgumentsContext not found');
    }
    
    // ExpressionListを取得
    const expressionList = args.expressionList();
    if (!expressionList) {
      throw new Error('ExpressionList not found');
    }
    
    // 最終的な式を取得
    const finalExpression = expressionList.expression();
    const expr = Array.isArray(finalExpression) ? finalExpression[0] : finalExpression;
    
    if (!expr) {
      throw new Error('Expression not found');
    }
    
    // 抽出された式のテキストを取得
    const extractedExpr = expr.text;
    console.log('Extracted Expression:', extractedExpr);
    
    // 式を変換
    console.log('\n--- Transforming Expression ---');
    const transformedExpr = transformToUpperCase(transformComparisonOperator(extractedExpr));
    console.log('Transformed Expression:', transformedExpr);
    
    // 期待される結果と比較
    const expectedResult = '(P=Q)';
    console.log('Expected Result:', expectedResult);
    console.log('Success:', transformedExpr === expectedResult ? '✅' : '❌');
    
    // 追加のテストケース
    console.log('\n--- Additional Test Cases ---');
    
    // テストケース1: 論理演算子
    const logicalExpr = '(x && y)';
    const transformedLogical = transformToUpperCase(logicalExpr.replace(/&&/g, 'AND'));
    console.log('Logical Operator Test:');
    console.log('Input:', logicalExpr);
    console.log('Output:', transformedLogical);
    console.log('Expected: (X AND Y)');
    console.log('Success:', transformedLogical === '(X AND Y)' ? '✅' : '❌');
    
    // テストケース2: 算術演算子
    const arithmeticExpr = '(a + b)';
    const transformedArithmetic = transformToUpperCase(arithmeticExpr);
    console.log('\nArithmetic Operator Test:');
    console.log('Input:', arithmeticExpr);
    console.log('Output:', transformedArithmetic);
    console.log('Expected: (A + B)');
    console.log('Success:', transformedArithmetic === '(A + B)' ? '✅' : '❌');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// テスト実行
testExpressionParser();
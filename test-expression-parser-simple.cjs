// Simple test script for ExpressionParser
const fs = require('fs');
const path = require('path');

// TypeScriptファイルを直接読み込んで評価する簡易テスト
console.log('=== ExpressionParser Simple Test ===');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// ファイルの存在確認
const expressionParserPath = path.join(__dirname, 'lib', 'java-ib', 'expression-parser.ts');
console.log('ExpressionParser file exists:', fs.existsSync(expressionParserPath));

if (fs.existsSync(expressionParserPath)) {
  console.log('ExpressionParser file size:', fs.statSync(expressionParserPath).size, 'bytes');
  
  // ファイルの最初の数行を読み取り
  const content = fs.readFileSync(expressionParserPath, 'utf8');
  const lines = content.split('\n').slice(0, 10);
  console.log('First 10 lines of ExpressionParser:');
  lines.forEach((line, index) => {
    console.log(`${index + 1}: ${line}`);
  });
}

// 依存関係の確認
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('\nProject dependencies:');
  console.log('- antlr4ts:', packageJson.dependencies?.['antlr4ts'] || 'not found');
  console.log('- typescript:', packageJson.devDependencies?.['typescript'] || 'not found');
  console.log('- vitest:', packageJson.devDependencies?.['vitest'] || 'not found');
}

console.log('\n=== Test completed ===');
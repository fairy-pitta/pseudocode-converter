// Use ts-node to run TypeScript directly
const { execSync } = require('child_process');

// Test simple else statement
const input = `if x > 5:
  print("Greater")
else:
  print("Smaller")`;

console.log('Input:');
console.log(input);
console.log('\nTesting with ts-node...');

try {
  const result = execSync(`npx ts-node -e "import { IBParser } from './lib/python-to-pseudocode-parser-ib'; const parser = new IBParser(); console.log(parser.parse('${input.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'));"`).toString();
  console.log('Output:', result.trim());
} catch (error) {
  console.error('Error:', error.message);
}
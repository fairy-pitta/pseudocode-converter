// Import using dynamic import for TypeScript
const fs = require('fs');
const { execSync } = require('child_process');

// Compile TypeScript to JavaScript first
try {
  execSync('npx tsc lib/python-to-pseudocode-parser-igsce.ts --outDir ./temp --target es2020 --module commonjs', { stdio: 'inherit' });
  const { pythonToIGCSEPseudocode } = require('./temp/lib/python-to-pseudocode-parser-igsce.js');
  runTests(pythonToIGCSEPseudocode);
} catch (error) {
  console.error('Error compiling TypeScript:', error.message);
  process.exit(1);
}

function runTests(pythonToIGCSEPseudocode) {

// Test case 1: Variable declarations
console.log('=== Test 1: Variable declarations ===');
const pythonCode1 = `counter = 5
name = "John"`;
const expectedPseudocode1 = `DECLARE counter : INTEGER
counter ← 5
DECLARE name : STRING
name ← "John"`;
const result1 = pythonToIGCSEPseudocode(pythonCode1);
console.log('Python code:');
console.log(pythonCode1);
console.log('\nExpected:');
console.log(expectedPseudocode1);
console.log('\nActual:');
console.log(result1);
console.log('\nMatch:', result1 === expectedPseudocode1);

// Test case 2: Constants
console.log('\n=== Test 2: Constants ===');
const pythonCode2 = `PI = 3.14`;
const expectedPseudocode2 = `CONSTANT PI = 3.14`;
const result2 = pythonToIGCSEPseudocode(pythonCode2);
console.log('Python code:');
console.log(pythonCode2);
console.log('\nExpected:');
console.log(expectedPseudocode2);
console.log('\nActual:');
console.log(result2);
console.log('\nMatch:', result2 === expectedPseudocode2);

// Test case 3: Simple if statement
console.log('\n=== Test 3: Simple if statement ===');
const pythonCode3 = `if score >= 50:
    print("Pass")`;
const expectedPseudocode3 = `IF score ≥ 50 THEN
   OUTPUT "Pass"
ENDIF`;
const result3 = pythonToIGCSEPseudocode(pythonCode3);
console.log('Python code:');
console.log(pythonCode3);
console.log('\nExpected:');
console.log(expectedPseudocode3);
console.log('\nActual:');
console.log(result3);
console.log('\nMatch:', result3 === expectedPseudocode3);

// Test case 4: For loop with range
console.log('\n=== Test 4: For loop with range ===');
const pythonCode4 = `for i in range(1, 11):
    print(i)`;
const expectedPseudocode4 = `FOR i ← 1 TO 10
   OUTPUT i
NEXT i`;
const result4 = pythonToIGCSEPseudocode(pythonCode4);
console.log('Python code:');
console.log(pythonCode4);
console.log('\nExpected:');
console.log(expectedPseudocode4);
console.log('\nActual:');
console.log(result4);
console.log('\nMatch:', result4 === expectedPseudocode4);
}
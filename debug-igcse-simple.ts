import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igsce';

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
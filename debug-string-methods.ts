import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `text = "Hello World"
upper_text = text.upper()
length = len(text)
first_char = text[0]`;

const expectedPseudocode = `DECLARE text : STRING
text ← "Hello World"
DECLARE upper_text : STRING
upper_text ← UPPER(text)
DECLARE length : INTEGER
length ← LENGTH(text)
DECLARE first_char : STRING
first_char ← MID(text, 0, 1)`;

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
const result = pythonToIGCSEPseudocode(pythonCode);
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);
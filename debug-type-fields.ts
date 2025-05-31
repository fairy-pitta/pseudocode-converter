import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `student = {"name": "John", "age": 20}
print(student["name"])
student["grade"] = "A"`;

console.log('Testing type fields tracking...');
console.log('Python code:', pythonCode);

const result = pythonToIGCSEPseudocode(pythonCode);
console.log('\nResult:');
console.log(result);
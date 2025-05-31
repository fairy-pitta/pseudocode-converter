import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `student = {"name": "John", "age": 20}
print(student["name"])
student["grade"] = "A"`;

console.log('Converting Python code:');
console.log(pythonCode);
console.log('\n' + '='.repeat(50) + '\n');

const result = pythonToIGCSEPseudocode(pythonCode);
console.log('Generated pseudocode:');
console.log(result);
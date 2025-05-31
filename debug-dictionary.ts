import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `student = {"name": "John", "age": 20}
print(student["name"])
student["grade"] = "A"`;

const expectedPseudocode = `TYPE StudentRecord
   DECLARE name : STRING
   DECLARE age : INTEGER
   DECLARE grade : STRING
ENDTYPE

DECLARE student : StudentRecord
student.name ← "John"
student.age ← 20
OUTPUT student.name
student.grade ← "A"`;

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);
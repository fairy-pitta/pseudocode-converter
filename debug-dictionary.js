"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
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
const result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);

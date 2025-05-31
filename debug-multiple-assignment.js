"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
const pythonCode = `a, b = 1, 2
x, y, z = 10, 20, 30`;
const expectedPseudocode = `DECLARE a : INTEGER
DECLARE b : INTEGER
a ← 1
b ← 2
DECLARE x : INTEGER
DECLARE y : INTEGER
DECLARE z : INTEGER
x ← 10
y ← 20
z ← 30`;
const result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);

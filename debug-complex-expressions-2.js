"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
const pythonCode = `result = (a + b) * (c - d) / (e + f)
power = x ** 2
square_root = x ** 0.5`;
const expectedPseudocode = `DECLARE result : REAL
result ← (a + b) * (c - d) / (e + f)
DECLARE power : REAL
power ← x ^ 2
DECLARE square_root : REAL
square_root ← x ^ 0.5`;
const result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);

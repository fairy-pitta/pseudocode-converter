"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
const pythonCode = `greeting = "Hello" + " " + name`;
const expectedPseudocode = `DECLARE greeting : STRING
greeting ← "Hello" & " " & name`;
const result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);

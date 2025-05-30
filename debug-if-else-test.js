"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
var pythonCode = "if score >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")";
var expectedPseudocode = "IF score \u2265 50 THEN\n   OUTPUT \"Pass\"\nELSE\n   OUTPUT \"Fail\"\nENDIF";
console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nActual:');
var result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log(result);
console.log('\nMatch:', result === expectedPseudocode);

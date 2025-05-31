"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
var pythonCode = "if score >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")";
var expectedPseudocode = "IF score \u2265 50 THEN\n   OUTPUT \"Pass\"\nELSE\n   OUTPUT \"Fail\"\nENDIF";
var result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(JSON.stringify(expectedPseudocode));
console.log('\nActual:');
console.log(JSON.stringify(result));
console.log('\nExpected lines:');
expectedPseudocode.split('\n').forEach(function (line, i) {
    console.log("".concat(i, ": \"").concat(line, "\""));
});
console.log('\nActual lines:');
result.split('\n').forEach(function (line, i) {
    console.log("".concat(i, ": \"").concat(line, "\""));
});
console.log('\nLine by line comparison:');
var expectedLines = expectedPseudocode.split('\n');
var actualLines = result.split('\n');
var maxLines = Math.max(expectedLines.length, actualLines.length);
for (var i = 0; i < maxLines; i++) {
    var expected = expectedLines[i] || '<missing>';
    var actual = actualLines[i] || '<missing>';
    var match = expected === actual;
    console.log("Line ".concat(i, ": ").concat(match ? '✓' : '✗', " Expected: \"").concat(expected, "\" | Actual: \"").concat(actual, "\""));
}
console.log('\nMatch:', result === expectedPseudocode);

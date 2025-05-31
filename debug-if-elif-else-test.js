"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
var pythonCode = "if score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelse:\n    print(\"C\")";
var expectedPseudocode = "IF score \u2265 90 THEN\n   OUTPUT \"A\"\nELSE\n   IF score \u2265 80 THEN\n      OUTPUT \"B\"\n   ELSE\n      OUTPUT \"C\"\n   ENDIF\nENDIF";
var result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nActual:');
console.log(result);
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

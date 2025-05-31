"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./lib/python-igcse/parser");
var parser = new parser_1.IGCSEPseudocodeParser();
var pythonCode = "if score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelse:\n    print(\"C\")";
console.log('Python Code:');
console.log(pythonCode);
console.log('\n=== Processing ===');
// Override the processLine method to add debugging
var originalProcessLine = parser.processLine;
parser.processLine = function (line) {
    console.log("\nProcessing line: \"".concat(line, "\""));
    console.log('Current blocks:', this.state.currentBlockTypes.map(function (b) { return b.type; }));
    console.log('Indentation levels:', this.state.indentationLevels);
    console.log('Output lines so far:', this.state.outputLines.length);
    var result = originalProcessLine.call(this, line);
    console.log('After processing:');
    console.log('Current blocks:', this.state.currentBlockTypes.map(function (b) { return b.type; }));
    console.log('Indentation levels:', this.state.indentationLevels);
    console.log('Latest output line:', this.state.outputLines[this.state.outputLines.length - 1]);
    return result;
};
var result = parser.parse(pythonCode);
console.log('\n=== Final Result ===');
console.log(result);

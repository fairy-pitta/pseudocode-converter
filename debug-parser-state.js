"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./lib/python-igcse/parser");
var pythonCode = "if score >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")";
var parser = new parser_1.IGCSEPseudocodeParser();
// Add debug logging to see what's happening
var originalProcessLine = parser.processLine;
parser.processLine = function (line) {
    console.log("Processing line: \"".concat(line, "\""));
    console.log("Current blocks:", this.state.currentBlockTypes.map(function (b) { return b.type; }));
    console.log("Indentation levels:", this.state.indentationLevels);
    var result = originalProcessLine.call(this, line);
    console.log("After processing:");
    console.log("Current blocks:", this.state.currentBlockTypes.map(function (b) { return b.type; }));
    console.log("Output lines:", this.state.outputLines);
    console.log("---");
    return result;
};
var result = parser.parse(pythonCode);
console.log('\nFinal result:');
console.log(result);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Java2IB = void 0;
const declarations_1 = require("./converters/declarations");
const expressions_1 = require("./converters/expressions");
const control_flow_1 = require("./converters/control-flow");
class Java2IB {
    parse(javaCode) {
        const lines = javaCode.split('\n');
        let pseudocodeLines = [];
        let currentIndex = 0;
        while (currentIndex < lines.length) {
            const remainingJavaCodeLines = lines.slice(currentIndex);
            // Try to convert multi-line statements first
            let conversionResult = null;
            // Check for if-else statements first, as they are more specific
            conversionResult = (0, control_flow_1.convertIfElseStatement)(lines, currentIndex, this);
            if (conversionResult) {
                pseudocodeLines.push(conversionResult.pseudocode);
                currentIndex = conversionResult.endIndex;
                continue;
            }
            // Then check for if statements
            conversionResult = (0, control_flow_1.convertIfStatement)(lines, currentIndex, this);
            if (conversionResult) {
                pseudocodeLines.push(conversionResult.pseudocode);
                currentIndex = conversionResult.endIndex;
                continue;
            }
            // Then check for for loops
            conversionResult = (0, control_flow_1.convertForLoop)(lines, currentIndex, this);
            if (conversionResult) {
                pseudocodeLines.push(conversionResult.pseudocode);
                currentIndex = conversionResult.endIndex;
                continue;
            }
            // Then check for while loops
            conversionResult = (0, control_flow_1.convertWhileLoop)(lines, currentIndex, this);
            if (conversionResult) {
                pseudocodeLines.push(conversionResult.pseudocode);
                currentIndex = conversionResult.endIndex;
                continue;
            }
            // If no multi-line statement is converted, proceed with line-by-line parsing
            const line = lines[currentIndex];
            let convertedLine = null;
            convertedLine = (0, declarations_1.convertVariableDeclarationAssignment)(line);
            if (convertedLine) {
                pseudocodeLines.push(convertedLine);
                currentIndex++;
                continue;
            }
            convertedLine = (0, expressions_1.convertSystemOutPrintln)(line);
            if (convertedLine) {
                pseudocodeLines.push(convertedLine);
                currentIndex++;
                continue;
            }
            convertedLine = (0, expressions_1.convertLogicalOperation)(line);
            if (convertedLine) {
                pseudocodeLines.push(convertedLine);
                currentIndex++;
                continue;
            }
            convertedLine = (0, expressions_1.convertStringAssignment)(line);
            if (convertedLine) {
                pseudocodeLines.push(convertedLine);
                currentIndex++;
                continue;
            }
            convertedLine = (0, expressions_1.convertIncrement)(line);
            if (convertedLine) {
                pseudocodeLines.push(convertedLine);
                currentIndex++;
                continue;
            }
            convertedLine = (0, expressions_1.convertDecrement)(line);
            if (convertedLine) {
                pseudocodeLines.push(convertedLine);
                currentIndex++;
                continue;
            }
            // If no conversion found for the line, add the original line (or handle as error/unsupported)
            // For now, we'll just skip lines that don't match our patterns
            currentIndex++;
        }
        return pseudocodeLines.join('\n');
    }
}
exports.Java2IB = Java2IB;

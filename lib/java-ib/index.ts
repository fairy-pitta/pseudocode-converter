import { convertVariableDeclarationAssignment } from './converters/declarations';
import { convertSystemOutPrintln, convertLogicalOperation, convertStringAssignment, convertIncrement, convertDecrement } from './converters/expressions';
import { convertIfStatement, convertIfElseStatement, convertForLoop, convertWhileLoop } from './converters/control-flow';

export class Java2IB {
  parse(javaCode: string): string {
    const lines = javaCode.split('\n');
    let pseudocodeLines: string[] = [];

    let currentIndex = 0;

    while (currentIndex < lines.length) {
      const remainingJavaCodeLines = lines.slice(currentIndex);

      // Try to convert multi-line statements first
      let conversionResult: { pseudocode: string; endIndex: number } | null = null;

      // Check for if-else statements first, as they are more specific
      conversionResult = convertIfElseStatement(lines, currentIndex, this);
      if (conversionResult) {
        pseudocodeLines.push(conversionResult.pseudocode);
        currentIndex = conversionResult.endIndex;
        continue;
      }

      // Then check for if statements
      conversionResult = convertIfStatement(lines, currentIndex, this);
      if (conversionResult) {
        pseudocodeLines.push(conversionResult.pseudocode);
        currentIndex = conversionResult.endIndex;
        continue;
      }

      // Then check for for loops
      conversionResult = convertForLoop(lines, currentIndex, this);
      if (conversionResult) {
        pseudocodeLines.push(conversionResult.pseudocode);
        currentIndex = conversionResult.endIndex;
        continue;
      }

      // Then check for while loops
      conversionResult = convertWhileLoop(lines, currentIndex, this);
      if (conversionResult) {
        pseudocodeLines.push(conversionResult.pseudocode);
        currentIndex = conversionResult.endIndex;
        continue;
      }

      // If no multi-line statement is converted, proceed with line-by-line parsing
      const line = lines[currentIndex];
      let convertedLine: string | null = null;

      convertedLine = convertVariableDeclarationAssignment(line);
      if (convertedLine) {
        pseudocodeLines.push(convertedLine);
        currentIndex++;
        continue;
      }

      convertedLine = convertSystemOutPrintln(line);
      if (convertedLine) {
        pseudocodeLines.push(convertedLine);
        currentIndex++;
        continue;
      }

      convertedLine = convertLogicalOperation(line);
      if (convertedLine) {
        pseudocodeLines.push(convertedLine);
        currentIndex++;
        continue;
      }

      convertedLine = convertStringAssignment(line);
      if (convertedLine) {
        pseudocodeLines.push(convertedLine);
        currentIndex++;
        continue;
      }

      convertedLine = convertIncrement(line);
      if (convertedLine) {
        pseudocodeLines.push(convertedLine);
        currentIndex++;
        continue;
      }

      convertedLine = convertDecrement(line);
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
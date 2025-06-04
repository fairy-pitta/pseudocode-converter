import { IF_STATEMENT, IF_ELSE_STATEMENT, FOR_LOOP, WHILE_LOOP } from '../patterns';
import { Java2IB } from '../index'; // Import Java2IB for recursive parsing
import { toIBPseudocode } from '../utils';

// Helper function to indent lines
function indent(text: string, level: number = 1): string {
  const indentation = '    '.repeat(level);
  return text.split('\n').map(line => `${indentation}${line}`).join('\n');
}

interface ConversionResult {
  pseudocode: string;
  endIndex: number;
}

export function convertIfStatement(javaCodeLines: string[], startIndex: number, parser: Java2IB): ConversionResult | null {
  const blockLines: string[] = [];
  let openBraces = 0;
  let endIndex = startIndex;
  let firstLineMatch = false;

  for (let i = startIndex; i < javaCodeLines.length; i++) {
    const line = javaCodeLines[i];
    const trimmedLine = line.trim();

    if (i === startIndex) {
        // Check if the line starts with 'if' instead of using the full pattern
        const ifCheck = /^\s*if\s*\(/.test(trimmedLine);
        if (ifCheck) {
            firstLineMatch = true;
        } else {
            return null; // Not an if statement starting at this line
        }
    }

    if (firstLineMatch) {
        blockLines.push(line);
        if (trimmedLine.includes('{')) {
            openBraces += (trimmedLine.match(/\{/g) || []).length;
        }
        if (trimmedLine.includes('}')) {
            openBraces -= (trimmedLine.match(/\}/g) || []).length;
        }
        if (openBraces === 0 && blockLines.length > 0) {
            endIndex = i + 1;
            break;
        }
    }
  }

  if (blockLines.length === 0 || !firstLineMatch) {
    return null;
  }

  const javaBlock = blockLines.join('\n');
  const match = javaBlock.match(IF_STATEMENT);

  if (match) {
    const condition = match[1].trim();
    const body = match[2].trim();
    const ibBody = parser.parse(body);
    return {
      pseudocode: `if ${toIBPseudocode(condition)} then\n${indent(ibBody)}\nend if`,
      endIndex: endIndex,
    };
  }
  return null;
}

export function convertIfElseStatement(javaCodeLines: string[], startIndex: number, parser: Java2IB): ConversionResult | null {
  const blockLines: string[] = [];
  let openBraces = 0;
  let endIndex = startIndex;
  let firstLineMatch = false;

  for (let i = startIndex; i < javaCodeLines.length; i++) {
    const line = javaCodeLines[i];
    const trimmedLine = line.trim();

    if (i === startIndex) {
        // Check if the line starts with 'if' and contains 'else' later in the code
        const ifCheck = /^\s*if\s*\(/.test(trimmedLine);
        if (ifCheck) {
            firstLineMatch = true;
        } else {
            return null; // Not an if-else statement starting at this line
        }
    }

    if (firstLineMatch) {
        blockLines.push(line);
        if (trimmedLine.includes('{')) {
            openBraces += (trimmedLine.match(/\{/g) || []).length;
        }
        if (trimmedLine.includes('}')) {
            openBraces -= (trimmedLine.match(/\}/g) || []).length;
        }
        if (openBraces === 0 && blockLines.length > 0) {
            endIndex = i + 1;
            break;
        }
    }
  }

  if (blockLines.length === 0 || !firstLineMatch) {
    return null;
  }

  const javaBlock = blockLines.join('\n');
  const match = javaBlock.match(IF_ELSE_STATEMENT);

  if (match) {
    const condition = match[1].trim();
    const ifBody = match[2].trim();
    const elseBody = match[3].trim();
    const ibIfBody = parser.parse(ifBody);
    const ibElseBody = parser.parse(elseBody);
    return {
      pseudocode: `if ${toIBPseudocode(condition)} then\n${indent(ibIfBody)}\nelse\n${indent(ibElseBody)}\nend if`,
      endIndex: endIndex,
    };
  }
  return null;
}

export function convertForLoop(javaCodeLines: string[], startIndex: number, parser: Java2IB): ConversionResult | null {
  const blockLines: string[] = [];
  let openBraces = 0;
  let endIndex = startIndex;
  let firstLineMatch = false;

  for (let i = startIndex; i < javaCodeLines.length; i++) {
    const line = javaCodeLines[i];
    const trimmedLine = line.trim();

    if (i === startIndex) {
        // Check if the line starts with 'for' instead of using the full pattern
        const forCheck = /^\s*for\s*\(/.test(trimmedLine);
        if (forCheck) {
            firstLineMatch = true;
        } else {
            return null; // Not a for loop starting at this line
        }
    }

    if (firstLineMatch) {
        blockLines.push(line);
        if (trimmedLine.includes('{')) {
            openBraces += (trimmedLine.match(/\{/g) || []).length;
        }
        if (trimmedLine.includes('}')) {
            openBraces -= (trimmedLine.match(/\}/g) || []).length;
        }
        if (openBraces === 0 && blockLines.length > 0) {
            endIndex = i + 1;
            break;
        }
    }
  }

  if (blockLines.length === 0 || !firstLineMatch) {
    return null;
  }

  const javaBlock = blockLines.join('\n');
  const match = javaBlock.match(FOR_LOOP);

  if (match) {
    const variable = match[1].trim();
    const start = match[2].trim();
    const end = match[3].trim();
    const body = match[4].trim();
    const ibBody = parser.parse(body);
    
    // IB pseudocode uses inclusive range, so we need to subtract 1 from the end value
    const endValue = parseInt(end) - 1;
    
    return {
      pseudocode: `loop ${variable.toUpperCase()} from ${start} to ${endValue}\n${indent(ibBody)}\nend loop`,
      endIndex: endIndex,
    };
  }
  return null;
}

export function convertWhileLoop(javaCodeLines: string[], startIndex: number, parser: Java2IB): ConversionResult | null {
  const blockLines: string[] = [];
  let openBraces = 0;
  let endIndex = startIndex;
  let firstLineMatch = false;

  for (let i = startIndex; i < javaCodeLines.length; i++) {
    const line = javaCodeLines[i];
    const trimmedLine = line.trim();

    if (i === startIndex) {
        // Check if the line starts with 'while' instead of using the full pattern
        const whileCheck = /^\s*while\s*\(/.test(trimmedLine);
        if (whileCheck) {
            firstLineMatch = true;
        } else {
            return null; // Not a while loop starting at this line
        }
    }

    if (firstLineMatch) {
        blockLines.push(line);
        if (trimmedLine.includes('{')) {
            openBraces += (trimmedLine.match(/\{/g) || []).length;
        }
        if (trimmedLine.includes('}')) {
            openBraces -= (trimmedLine.match(/\}/g) || []).length;
        }
        if (openBraces === 0 && blockLines.length > 0) {
            endIndex = i + 1;
            break;
        }
    }
  }

  if (blockLines.length === 0 || !firstLineMatch) {
    return null;
  }

  const javaBlock = blockLines.join('\n');
  const match = javaBlock.match(WHILE_LOOP);

  if (match) {
    const condition = match[1].trim();
    const body = match[2].trim();
    const ibBody = parser.parse(body);
    
    return {
      pseudocode: `loop while ${toIBPseudocode(condition)}\n${indent(ibBody)}\nend loop`,
      endIndex: endIndex,
    };
  }
  return null;
}
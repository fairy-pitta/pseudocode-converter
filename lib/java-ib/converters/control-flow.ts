import { IF_STATEMENT, IF_ELSE_STATEMENT, FOR_LOOP, WHILE_LOOP } from '../patterns';
import { Java2IB } from '../index'; // Import Java2IB for recursive parsing
import { toIBPseudocode } from '../utils';
import { ExpressionParser } from '../expression-parser';

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
  
  // ヘッダー行（if (condition) {）と本体を分離
  const headerLine = blockLines[0];
  const bodyLines = blockLines.slice(1, -1); // 先頭と末尾の { } を除外
  
  // 条件部分を抽出
  const condition = headerLine.match(/if\s*\(([^)]+)\)/)?.[1]?.trim();
  
  if (condition !== undefined) {
    const body = bodyLines.join('\n');
    // 再帰の深さを引き継ぐ
    const ibBody = parser.parse(body, 1); // 再帰深度を1に設定
    return {
      pseudocode: `if ${ExpressionParser.parseCondition(condition)} then\n${indent(ibBody)}\nend if`,
      endIndex: endIndex,
    };
  }
  return null;
}

export function convertIfElseStatement(javaCodeLines: string[], startIndex: number, parser: Java2IB): ConversionResult | null {
  console.log('DEBUG: convertIfElseStatement called with startIndex:', startIndex);
  console.log('DEBUG: First line:', javaCodeLines[startIndex]);
  
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
            console.log('DEBUG: First line matches if pattern');
        } else {
            console.log('DEBUG: First line does not match if pattern');
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
  console.log('DEBUG: Collected javaBlock:', javaBlock);
  
  const match = javaBlock.match(IF_ELSE_STATEMENT);
  console.log('DEBUG: IF_ELSE_STATEMENT match result:', match);

  if (match) {
    console.log('DEBUG: Match found, processing if-else statement');
    const condition = match[1].trim();
    const ifBody = match[2].trim();
    const elseBody = match[3].trim();
    console.log('DEBUG: Condition:', condition);
    console.log('DEBUG: If body:', ifBody);
    console.log('DEBUG: Else body:', elseBody);
    
    // 再帰の深さを引き継ぐ
    const ibIfBody = parser.parse(ifBody, 1);
    const ibElseBody = parser.parse(elseBody, 1);
    return {
      pseudocode: `if ${ExpressionParser.parseCondition(condition)} then\n${indent(ibIfBody)}\nelse\n${indent(ibElseBody)}\nend if`,
      endIndex: endIndex,
    };
  }
  console.log('DEBUG: No match found, returning null');
  return null;
}

// New function to handle if-else if-else chains
export function convertIfElseChain(javaCodeLines: string[], startIndex: number, parser: Java2IB): ConversionResult | null {
  // First, check if this is an if statement
  const ifCheck = /^\s*if\s*\(/.test(javaCodeLines[startIndex].trim());
  if (!ifCheck) {
    return null; // Not an if statement starting at this line
  }

  // Collect all lines in the if-else if-else chain
  const blockLines: string[] = [];
  let openBraces = 0;
  let endIndex = startIndex;
  let currentLine = startIndex;
  let inChain = true;

  while (inChain && currentLine < javaCodeLines.length) {
    const line = javaCodeLines[currentLine];
    const trimmedLine = line.trim();
    
    blockLines.push(line);
    
    // Count braces to track nesting
    if (trimmedLine.includes('{')) {
      openBraces += (trimmedLine.match(/\{/g) || []).length;
    }
    if (trimmedLine.includes('}')) {
      openBraces -= (trimmedLine.match(/\}/g) || []).length;
    }
    
    // Check if we've reached the end of a block
    if (openBraces === 0 && blockLines.length > 1) {
      // Check if the next line continues the chain
      if (currentLine + 1 < javaCodeLines.length) {
        const nextLine = javaCodeLines[currentLine + 1].trim();
        if (nextLine.startsWith('} else if') || nextLine.startsWith('else if') || nextLine.startsWith('} else') || nextLine === 'else {') {
          // Continue the chain
          currentLine++;
          continue;
        }
      }
      // End of chain
      endIndex = currentLine + 1;
      inChain = false;
    }
    
    currentLine++;
  }

  if (blockLines.length === 0) {
    return null;
  }

  // Parse the collected block
  const javaBlock = blockLines.join('\n');
  
  // Use parseIfElseChain function which has better implementation
  return parseIfElseChainWithDepth(javaBlock, parser, endIndex, 0);
}

function parseIfElseChain(javaBlock: string, parser: Java2IB, endIndex: number): ConversionResult | null {
  // 再帰の深さを追跡するための変数
  const recursionDepth = 0;
  return parseIfElseChainWithDepth(javaBlock, parser, endIndex, recursionDepth);
}

function parseIfElseChainWithDepth(javaBlock: string, parser: Java2IB, endIndex: number, recursionDepth: number): ConversionResult | null {
  // 再帰の深さに制限を設ける
  const MAX_RECURSION_DEPTH = 10;
  if (recursionDepth > MAX_RECURSION_DEPTH) {
    console.warn(`Warning: Maximum recursion depth (${MAX_RECURSION_DEPTH}) exceeded in parseIfElseChain. Returning partial result.`);
    return {
      pseudocode: "// Maximum recursion depth exceeded in parseIfElseChain",
      endIndex
    };
  }

  console.log(`DEBUG: parseIfElseChain called with recursionDepth=${recursionDepth}`);
  console.log(`DEBUG: javaBlock snippet: ${javaBlock.substring(0, 100)}...`);

  // より柔軟な解析アプローチ
  // まず全体のブロックを行ごとに分析
  const lines = javaBlock.split('\n');
  let pseudocode = '';
  let i = 0;
  let braceCount = 0;
  let currentCondition = '';
  let currentBody: string[] = [];
  let inBody = false;
  let isFirstIf = true;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // if文の開始を検出
    if (line.match(/^if\s*\(/)) {
      const conditionMatch = line.match(/^if\s*\(([^)]+)\)\s*\{?/);
      if (conditionMatch) {
        currentCondition = conditionMatch[1].trim();
        inBody = true;
        braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        if (isFirstIf) {
          pseudocode = `if ${ExpressionParser.parseCondition(currentCondition)} then`;
          isFirstIf = false;
        }
      }
    }
    // else if文の開始を検出
    else if (line.match(/^\}?\s*else\s+if\s*\(/)) {
      // 前のブロックを処理
       if (currentBody.length > 0) {
         // 変数代入の場合は特別処理
         if (currentBody.length === 1 && currentBody[0].match(/^\w+\s*=\s*".*";$/)) {
           const assignMatch = currentBody[0].match(/^(\w+)\s*=\s*"(.*)";$/);
           if (assignMatch) {
             const varName = assignMatch[1].toUpperCase();
             const value = assignMatch[2];
             pseudocode += `\n${indent(`${varName} ← "${value}"`)}`;
           } else {
             const bodyCode = currentBody.join('\n');
             const parsedBody = parser.parse(bodyCode, recursionDepth + 1);
             pseudocode += `\n${indent(parsedBody)}`;
           }
         } else {
           const bodyCode = currentBody.join('\n');
           const parsedBody = parser.parse(bodyCode, recursionDepth + 1);
           pseudocode += `\n${indent(parsedBody)}`;
         }
         currentBody = [];
       }
      
      const conditionMatch = line.match(/^\}?\s*else\s+if\s*\(([^)]+)\)\s*\{?/);
      if (conditionMatch) {
        currentCondition = conditionMatch[1].trim();
        pseudocode += `\nelse\n${indent(`if ${ExpressionParser.parseCondition(currentCondition)} then`)}`;
        braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      }
    }
    // else文の開始を検出
    else if (line.match(/^\}?\s*else\s*\{?/)) {
      // 前のブロックを処理
       if (currentBody.length > 0) {
         // 変数代入の場合は特別処理
         if (currentBody.length === 1 && currentBody[0].match(/^\w+\s*=\s*".*";$/)) {
           const assignMatch = currentBody[0].match(/^(\w+)\s*=\s*"(.*)";$/);
           if (assignMatch) {
             const varName = assignMatch[1].toUpperCase();
             const value = assignMatch[2];
             pseudocode += `\n${indent(`${varName} ← "${value}"`)}`;
           } else {
             const bodyCode = currentBody.join('\n');
             const parsedBody = parser.parse(bodyCode, recursionDepth + 1);
             pseudocode += `\n${indent(parsedBody)}`;
           }
         } else {
           const bodyCode = currentBody.join('\n');
           const parsedBody = parser.parse(bodyCode, recursionDepth + 1);
           pseudocode += `\n${indent(parsedBody)}`;
         }
         currentBody = [];
       }
      
      pseudocode += `\nelse`;
      braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    }
    // ブロック内のコードを収集
      else if (inBody && !line.match(/^\}*$/)) {
        // 変数宣言の場合は特別処理
        if (line.match(/^String\s+\w+;$/)) {
          const varMatch = line.match(/^String\s+(\w+);$/);
          if (varMatch) {
            const varName = varMatch[1].toUpperCase();
            // 変数宣言を擬似コードに直接追加
            pseudocode = `${varName}\n${pseudocode}`;
          }
        } else {
          currentBody.push(line);
        }
      }
    
    // ブレースのカウントを更新
    if (inBody) {
      braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (braceCount <= 0 && line.includes('}')) {
        // ブロック終了
         if (currentBody.length > 0) {
           // 変数代入の場合は特別処理
           if (currentBody.length === 1 && currentBody[0].match(/^\w+\s*=\s*".*";$/)) {
             const assignMatch = currentBody[0].match(/^(\w+)\s*=\s*"(.*)";$/);
             if (assignMatch) {
               const varName = assignMatch[1].toUpperCase();
               const value = assignMatch[2];
               pseudocode += `\n${indent(`${varName} ← "${value}"`)}`;
             } else {
               const bodyCode = currentBody.join('\n');
               const parsedBody = parser.parse(bodyCode, recursionDepth + 1);
               pseudocode += `\n${indent(parsedBody)}`;
             }
           } else {
             const bodyCode = currentBody.join('\n');
             const parsedBody = parser.parse(bodyCode, recursionDepth + 1);
             pseudocode += `\n${indent(parsedBody)}`;
           }
           currentBody = [];
         }
        inBody = false;
      }
    }
    
    i++;
  }
  
  // 最後のブロックを処理
  if (currentBody.length > 0) {
    // 変数代入の場合は特別処理
    if (currentBody.length === 1 && currentBody[0].match(/^\w+\s*=\s*".*";$/)) {
      const assignMatch = currentBody[0].match(/^(\w+)\s*=\s*"(.*)";$/);
      if (assignMatch) {
        const varName = assignMatch[1].toUpperCase();
        const value = assignMatch[2];
        pseudocode += `\n${indent(`${varName} ← "${value}"`)}`;
      } else {
        const bodyCode = currentBody.join('\n');
        const parsedBody = parser.parse(bodyCode, recursionDepth + 1);
        pseudocode += `\n${indent(parsedBody)}`;
      }
    } else {
      const bodyCode = currentBody.join('\n');
      const parsedBody = parser.parse(bodyCode, recursionDepth + 1);
      pseudocode += `\n${indent(parsedBody)}`;
    }
  }
  
  // end ifを追加
  pseudocode += '\nend if';
  
  console.log(`DEBUG: parseIfElseChain returning with recursionDepth=${recursionDepth}`);
  return {
    pseudocode,
    endIndex
  };
}

// 古い実装をバックアップとして保持
function parseIfElseChainWithDepthOld(javaBlock: string, parser: Java2IB, endIndex: number, recursionDepth: number): ConversionResult | null {
  // 再帰の深さに制限を設ける
  const MAX_RECURSION_DEPTH = 10;
  if (recursionDepth > MAX_RECURSION_DEPTH) {
    console.warn(`Warning: Maximum recursion depth (${MAX_RECURSION_DEPTH}) exceeded in parseIfElseChain. Returning partial result.`);
    return {
      pseudocode: "// Maximum recursion depth exceeded in parseIfElseChain",
      endIndex
    };
  }

  console.log(`DEBUG: parseIfElseChain called with recursionDepth=${recursionDepth}`);
  console.log(`DEBUG: javaBlock snippet: ${javaBlock.substring(0, 50)}...`);

  // Regular expressions to match different parts of the if-else if-else chain
  const ifRegex = /^\s*if\s*\(([^)]+)\)\s*\{([\s\S]*?)\}/;
  const elseIfRegex = /\}\s*else\s+if\s*\(([^)]+)\)\s*\{([\s\S]*?)\}/g;
  const elseRegex = /else\s*\{([\s\S]*?)\}/;

  // Extract the initial if condition and body
  const ifMatch = javaBlock.match(ifRegex);
  if (!ifMatch) return null;
  
  const initialCondition = ifMatch[1].trim();
  const initialBody = ifMatch[2].trim();
  
  // 内側のif文を正しく処理するために、初期化されたparserインスタンスを使用
  // 再帰の深さを増やして渡す
  const ibInitialBody = parser.parse(initialBody, recursionDepth + 1);
  
  let pseudocode = `if ${ExpressionParser.parseCondition(initialCondition)} then\n${indent(ibInitialBody)}`;
  
  // Extract all else-if blocks
  let elseIfMatch;
  let remainingBlock = javaBlock.substring(ifMatch[0].length);
  
  while ((elseIfMatch = elseIfRegex.exec(remainingBlock)) !== null) {
    const elseIfCondition = elseIfMatch[1].trim();
    const elseIfBody = elseIfMatch[2].trim();
    // 再帰の深さを増やして渡す
    const ibElseIfBody = parser.parse(elseIfBody, recursionDepth + 1);
    
    // 修正: else ifではなく、elseの後に新しい行でifを配置
    pseudocode += `\nelse\n${indent(`if ${ExpressionParser.parseCondition(elseIfCondition)} then\n${indent(ibElseIfBody)}`)}`;  
  }
  
  // Extract the final else block if it exists
  const elseMatch = remainingBlock.match(elseRegex);
  if (elseMatch) {
    const elseBody = elseMatch[1].trim();
    // 再帰の深さを増やして渡す
    const ibElseBody = parser.parse(elseBody, recursionDepth + 1);
    
    pseudocode += `\nelse\n${indent(ibElseBody)}`;
  }
  
  // Close the if-else chain
  pseudocode += '\nend if';
  
  console.log(`DEBUG: parseIfElseChain returning with recursionDepth=${recursionDepth}`);
  return {
    pseudocode,
    endIndex
  };
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
    // 再帰の深さを0から開始（親の深さは不明なため）
    const ibBody = parser.parse(body, 0);
    
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
    // 再帰の深さを0から開始（親の深さは不明なため）
    const ibBody = parser.parse(body, 0);
    
    return {
      pseudocode: `loop while ${ExpressionParser.parseCondition(condition)}\n${indent(ibBody)}\nend loop`,
      endIndex: endIndex,
    };
  }
  return null;
}
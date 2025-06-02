import { ParserState, ParseResult, BlockFrame } from './types';
import { PATTERNS } from './patterns';
import { KEYWORDS, INDENT_SIZE, BLOCK_TYPES, PYTHON_INDENT_SIZE } from './constants';
import { getLineIndentationLevel, getLeadingWhitespace, convertConditionOperators } from './utils';
import { ALL_CONVERTERS } from './converters';

// Helper list for block types that start a new indentation level
const INDENTING_BLOCK_TYPES_LIST: Array<typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES]> = [
  BLOCK_TYPES.IF,
  BLOCK_TYPES.FOR,
  BLOCK_TYPES.WHILE,
  BLOCK_TYPES.FUNCTION,
  BLOCK_TYPES.PROCEDURE,
  BLOCK_TYPES.CLASS,
  BLOCK_TYPES.CONSTRUCTOR,
  BLOCK_TYPES.METHOD,
  BLOCK_TYPES.REPEAT,
];

export class IGCSEPseudocodeParser {
  private state!: ParserState;

  parse(sourceCode: string): string {
    if (!sourceCode.trim()) return '';
    
    this.initializeState();
    const lines = sourceCode.split(/\r?\n/);
    
    this.collectDeclarations(lines);
    lines.forEach(line => this.processLine(line));
    this.closeRemainingBlocks();
    
    return this.state.outputLines.join('\n');
  }

  private initializeState(): void {
    this.state = {
      indentationLevels: [0],
      currentBlockTypes: [],
      outputLines: [],
      declarations: new Set(),
      isTryBlockOpen: false,
      tryBlockIndentationString: null,
      functionHasReturn: new Map(),
    };
  }

  private collectDeclarations(lines: string[]): void {
    // For IGCSE, we don't pre-declare variables
    // Variables are declared inline when first assigned
    
    // Pre-scan for dictionary fields to ensure complete TYPE definitions
    this.prescanDictionaryFields(lines);
  }

  private prescanDictionaryFields(lines: string[]): void {
    if (!this.state.typeFields) {
      this.state.typeFields = new Map();
    }

    lines.forEach(line => {
      // Check for dictionary literal
      const dictLiteralMatch = line.match(PATTERNS.DICTIONARY_LITERAL);
      if (dictLiteralMatch) {
        const [, variable, content] = dictLiteralMatch;
        
        if (!this.state.typeFields!.has(variable)) {
          this.state.typeFields!.set(variable, new Set());
        }
        
        const pairs = content.split(',').map(pair => {
          const [key] = pair.split(':').map(s => s.trim());
          return key.replace(/["']/g, '');
        });
        
        pairs.forEach(key => {
          this.state.typeFields!.get(variable)!.add(key);
        });
      }
      
      // Check for dictionary assignment
      const dictAssignMatch = line.match(PATTERNS.DICTIONARY_ASSIGNMENT);
      if (dictAssignMatch) {
        const [, variable, key] = dictAssignMatch;
        const cleanKey = key.replace(/["']/g, '');
        
        if (!this.state.typeFields!.has(variable)) {
          this.state.typeFields!.set(variable, new Set());
        }
        
        this.state.typeFields!.get(variable)!.add(cleanKey);
      }
    });
  }

  private processLine(line: string): void {
    const trimmed = line.trim();

    if (!trimmed) {
      this.state.outputLines.push('');
      return;
    }

    if (trimmed.startsWith('#')) {
      const commentLine = `${getLeadingWhitespace(line)}// ${trimmed.slice(1).trim()}`;
      this.state.outputLines.push(commentLine);
      return;
    }

    const currentIndentation = getLineIndentationLevel(line);

    // Check if this line is ELIF or ELSE before closing blocks
    const isElif = /^elif\s+.+:$/i.test(trimmed);
    const isElse = /^else\s*:$/i.test(trimmed);
    const skipBlockClosing = isElif || isElse;

    // 1. Close any blocks whose indentation level is greater than the current line's indentation.
    //    This must happen BEFORE processing the current line's block type, especially for ELSE/ELIF.
    //    But skip for ELIF/ELSE to prevent premature END IF generation
    this.closeBlocksForIndentation(currentIndentation, skipBlockClosing);

    // Update indentationLevels based on Python's physical indentation
    const lastStoredIndentationLevel = this.state.indentationLevels[this.state.indentationLevels.length - 1];
    if (currentIndentation > lastStoredIndentationLevel) {
        this.state.indentationLevels.push(currentIndentation);
    }

    // 2. Determine an initial indentation string (this might be refined later)
    // This initial indentation is less critical now as we recalculate precisely later,
    // but converters might still use it as a hint.
    let initialPseudocodeIndentLevel = 0;
    if (this.state.indentationLevels.length > 0) { 
        initialPseudocodeIndentLevel = Math.max(0, this.state.indentationLevels.length - 1);
    }
    const initialIndentationString = ' '.repeat(initialPseudocodeIndentLevel * INDENT_SIZE);

    // 3. Handle inline comments (comments at the end of a line)
    let lineToConvert = trimmed;
    let inlineComment = '';
    const commentIndex = trimmed.indexOf('#');
    if (commentIndex > 0) {
      const beforeComment = trimmed.substring(0, commentIndex);
      const singleQuotes = (beforeComment.match(/'/g) || []).length;
      const doubleQuotes = (beforeComment.match(/"/g) || []).length;
      if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
        lineToConvert = beforeComment.trim();
        inlineComment = '  // ' + trimmed.substring(commentIndex + 1).trim();
      }
    }

    // 4. Convert the Python line to pseudocode.
    const conversionResult = this.convertLine(lineToConvert, initialIndentationString);
    
    if (conversionResult === null) {
      return;
    }
    
    // 5. Manage the block type stack (currentBlockTypes).
    // IndentationLevels stack is now managed based on physical Python indent.
    if (conversionResult.blockType) {
        const newBlockType = conversionResult.blockType.type;

        if (newBlockType === BLOCK_TYPES.ELSE || newBlockType === BLOCK_TYPES.ELIF) {
            const lastBlockOnStack = this.state.currentBlockTypes.length > 0 ? this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1] : null;
            if (lastBlockOnStack && (lastBlockOnStack.type === BLOCK_TYPES.IF || lastBlockOnStack.type === BLOCK_TYPES.ELIF)) {
                this.state.currentBlockTypes.pop();
                this.state.currentBlockTypes.push(conversionResult.blockType);
            } else {
                this.state.currentBlockTypes.push(conversionResult.blockType);
            }
        } else {
            this.state.currentBlockTypes.push(conversionResult.blockType);
        }
    }

    // 6. Recalculate correct indentation based on *updated* indentationLevels and IGCSE rules
    // currentPythonBlockDepth is 0 for top-level, 1 for first nesting, etc., based on *updated* indentationLevels
    // which now correctly reflect Python's physical indentation structure.
    const currentPythonBlockDepth = Math.max(0, this.state.indentationLevels.length - 1);
    let correctPseudocodeIndentLevel = currentPythonBlockDepth;

    // The pseudocode indent level directly corresponds to the Python block depth.
    // Example: Python indent 0 -> Pseudocode indent 0
    //          Python indent 4 (inside a block) -> Pseudocode indent 1
    //          Python indent 8 (nested block) -> Pseudocode indent 2
    // This simplification is possible because indentationLevels now accurately tracks Python's nesting.

    correctPseudocodeIndentLevel = Math.max(0, correctPseudocodeIndentLevel); // Ensure non-negative
    const correctIndentationString = ' '.repeat(correctPseudocodeIndentLevel * INDENT_SIZE);

    // Remove initial indentation (if any) from conversionResult.convertedLine and prepend correctIndentationString
    let lineContent = conversionResult.convertedLine;
    if (initialIndentationString.length > 0 && lineContent.startsWith(initialIndentationString)) {
        lineContent = lineContent.substring(initialIndentationString.length);
    } else {
        // If initialIndentationString was empty, or line didn't start with it (e.g. converter didn't use it), trim leading spaces that might be there by mistake.
        // This is a bit of a fallback.
        lineContent = lineContent.trimStart();
    }
    const finalConvertedLine = correctIndentationString + lineContent + inlineComment;
    
    this.state.outputLines.push(finalConvertedLine);
    
    // Handle additional lines if present
    if (conversionResult.additionalLines) {
      for (const additionalLine of conversionResult.additionalLines) {
        this.state.outputLines.push(additionalLine);
      }
    }
  }



  private closeBlocksForIndentation(currentIndentation: number, skipForElif: boolean = false): void {
    if (skipForElif) {
      return;
    }
    
    while (
      this.state.indentationLevels.length > 1 &&
      currentIndentation < this.state.indentationLevels[this.state.indentationLevels.length - 1]
    ) {
      this.closeCurrentBlock();
    }
  }

  private closeCurrentBlock(): void {
    // Pop the indentation level
    if (this.state.indentationLevels.length > 1) {
      this.state.indentationLevels.pop();
    }

    // Handle case where we're at base indentation but still have blocks to close
    if (this.state.indentationLevels.length === 0) {
      return;
    }

    // Pop the block type
    const blockFrame = this.state.currentBlockTypes.pop();
    if (!blockFrame) {
      return;
    }

    // Handle function block closure - convert TEMP_FUNCTION to proper FUNCTION/PROCEDURE
    if (blockFrame.type === BLOCK_TYPES.FUNCTION && blockFrame.ident) {
      this.finalizeFunctionDefinition(blockFrame.ident);
    }

    const baseIndentationCount = Math.max(0, this.state.indentationLevels.length - 1);
    
    const closeKeyword = this.getCloseKeyword(blockFrame);
    const indentationString = ' '.repeat(baseIndentationCount * INDENT_SIZE);
    const closeLine = `${indentationString}${closeKeyword}`;
    
    this.state.outputLines.push(closeLine);
    
    // Reset try block state when closing TRY block
    if (blockFrame.type === BLOCK_TYPES.TRY) {
      this.state.isTryBlockOpen = false;
      this.state.tryBlockIndentationString = null;
    }
  }

  private getCloseKeyword(blockFrame: BlockFrame): string {
    
    // Special handling for function blocks
    if (blockFrame.type === BLOCK_TYPES.FUNCTION && blockFrame.ident) {
      const hasReturn = this.state.functionHasReturn.get(blockFrame.ident) || false;
      return hasReturn ? KEYWORDS.END_FUNCTION : KEYWORDS.END_PROCEDURE;
    }
    
    const closeMap: { [key: string]: string } = {
      function: KEYWORDS.END_FUNCTION,
      procedure: KEYWORDS.END_PROCEDURE,
      class: KEYWORDS.END_CLASS,
      constructor: KEYWORDS.END_PROCEDURE, // Constructor uses ENDPROCEDURE
      method: KEYWORDS.END_PROCEDURE, // Method uses ENDPROCEDURE
      if: KEYWORDS.END_IF,
      elif: KEYWORDS.END_IF,
      else: KEYWORDS.END_IF,
      for: blockFrame.ident ? `${KEYWORDS.NEXT} ${blockFrame.ident}` : KEYWORDS.NEXT,
      while: KEYWORDS.END_WHILE,
      file_while: KEYWORDS.END_WHILE,
      repeat: `${KEYWORDS.UNTIL} <condition>`,
      try: 'ENDIF',
      except: '',  // except doesn't need a closing keyword
      finally: '',  // finally doesn't need a closing keyword
      return: '',  // return doesn't need a closing keyword
      with: (this.state as any).currentFile ? `CLOSEFILE "${(this.state as any).currentFile}"` : 'END WITH',
    };
    
    return closeMap[blockFrame.type] || `END ${blockFrame.type?.toUpperCase() || 'BLOCK'}`;
  }

  private inferReturnType(functionName: string): string {
    // Simple rule: most functions return INTEGER by default
    const lowerName = functionName.toLowerCase();
    if (lowerName.includes('greet') || lowerName.includes('format') || lowerName.includes('string') || lowerName.includes('text')) {
      return 'STRING';
    }
    if (lowerName.includes('check') || lowerName.includes('is') || lowerName.includes('has') || lowerName.includes('valid')) {
      return 'BOOLEAN';
    }
    
    const pascalCaseName = functionName.charAt(0).toUpperCase() + functionName.slice(1);
    
    // Analyze function content to determine return type
    let functionStartIndex = -1;
    let functionEndIndex = -1;
    
    // Find function boundaries
    for (let i = 0; i < this.state.outputLines.length; i++) {
      const line = this.state.outputLines[i];
      if (line.includes(`TEMP_FUNCTION ${pascalCaseName}`)) {
        functionStartIndex = i;
      }
      if (functionStartIndex !== -1 && (line.includes('ENDFUNCTION') || line.includes('ENDPROCEDURE'))) {
        functionEndIndex = i;
        break;
      }
    }
    
    if (functionStartIndex === -1) return 'INTEGER';
    
    // Analyze return statements and function content
    for (let i = functionStartIndex; i < Math.min(functionEndIndex, this.state.outputLines.length); i++) {
      const line = this.state.outputLines[i].toLowerCase();
      
      // Check return statements
      if (line.includes('return')) {
        // String operations or string literals
        if (line.includes('"') || line.includes("'") || line.includes('upper(') || 
            line.includes('lower(') || line.includes('mid(') || line.includes('&')) {
          return 'STRING';
        }
        // Real number operations
        if (line.includes('/') || line.includes('.') || line.includes('real') ||
            line.includes('float') || line.includes('0.5')) {
          return 'REAL';
        }
        // Boolean operations
        if (line.includes('true') || line.includes('false') || line.includes('and') ||
            line.includes('or') || line.includes('not') || line.includes('=') ||
            line.includes('<') || line.includes('>')) {
          return 'BOOLEAN';
        }
      }
    }
    
    return 'INTEGER'; // Default
  }

  private finalizeFunctionDefinition(functionName: string): void {
    const hasReturn = this.state.functionHasReturn.get(functionName) || false;
    const pascalCaseName = functionName.charAt(0).toUpperCase() + functionName.slice(1);
    
    // Find and update the function definition line
    for (let i = 0; i < this.state.outputLines.length; i++) {
      const line = this.state.outputLines[i];
      if (line.includes(`TEMP_FUNCTION ${pascalCaseName}`)) {
        if (hasReturn) {
          // Convert to FUNCTION with RETURNS
          this.state.outputLines[i] = line.replace(
            /TEMP_FUNCTION (\w+)\(([^)]*)\)/,
            (match, name, params) => {
              // Add RETURNS with inferred type if not already present
              if (!this.state.outputLines[i].includes('RETURNS')) {
                const returnType = this.inferReturnType(functionName);
                return `${KEYWORDS.FUNCTION} ${name}(${params}) RETURNS ${returnType}`;
              }
              return `${KEYWORDS.FUNCTION} ${name}(${params})`;
            }
          );
        } else {
          // Convert to PROCEDURE
          this.state.outputLines[i] = line.replace(
            `TEMP_FUNCTION ${pascalCaseName}`,
            `${KEYWORDS.PROCEDURE} ${pascalCaseName}`
          );
        }
        break;
      }
    }
  }

  private closeRemainingBlocks(): void {
    while (this.state.currentBlockTypes.length > 0) {
      this.closeCurrentBlock();
    }
  }



  private convertLine(line: string, indentation: string): ParseResult | null {
    for (let i = 0; i < ALL_CONVERTERS.length; i++) {
      const converter = ALL_CONVERTERS[i];
      const result = converter(line, indentation, this.state);
      if (result) {
        if (result.convertedLine !== line) {
          return result;
        }
      }
    }
    
    // If no converter handled the line, add a TODO comment
    return {
      convertedLine: `${indentation}// TODO: ${line.trim()}`,
      blockType: null
    };
  }
}
import { KEYWORDS, INDENT_SIZE, BLOCK_TYPES } from './constants';
import { ParserState, BlockFrame } from './types';
import { getLineIndentationLevel } from './utils';
import { ALL_CONVERTERS } from './converters';
import { ConverterFunction, ParseResult } from './types';

export class IGCSEPseudocodeParser {
  private state: ParserState;

  constructor() {
    this.state = {
      outputLines: [],
      currentBlockTypes: [],
      indentationLevels: [0],
      declarations: new Set<string>(),
      typeFields: new Map(),
      isTryBlockOpen: false,
      tryBlockIndentationString: null,
      functionHasReturn: new Map(),
    };
  }

  parse(pythonCode: string): string {
    this.initializeState();
    
    const lines = pythonCode.split('\n');
    
    // Pre-scan for dictionary field declarations
    this.prescanDictionaryFields(lines);
    
    // Collect all variable declarations first
    this.collectDeclarations(lines);
    
    // Process each line
    for (const line of lines) {
      this.processLine(line);
    }
    
    // Close any remaining blocks
    this.closeRemainingBlocks();
    
    return this.state.outputLines.join('\n');
  }

  private initializeState(): void {
    this.state.outputLines = [];
    this.state.currentBlockTypes = [];
    this.state.indentationLevels = [0];
    this.state.declarations.clear();
    this.state.typeFields?.clear();
  }

  private collectDeclarations(lines: string[]): void {
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        // Look for variable assignments
        const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
        if (assignMatch) {
          this.state.declarations.add(assignMatch[1]);
        }
      }
    }
  }

  private prescanDictionaryFields(lines: string[]): void {
    for (const line of lines) {
      const trimmed = line.trim();
      const dictFieldMatch = trimmed.match(/([a-zA-Z_][a-zA-Z0-9_]*)\[(['"])([^'"]+)\2\]\s*=/);
      if (dictFieldMatch) {
        const dictName = dictFieldMatch[1];
        const fieldName = dictFieldMatch[3];
        if (!this.state.typeFields) {
          this.state.typeFields = new Map();
        }
        if (!this.state.typeFields.has(dictName)) {
          this.state.typeFields.set(dictName, new Set());
        }
        this.state.typeFields.get(dictName)!.add(fieldName);
      }
    }
  }

  private processLine(line: string): void {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }
    
    const currentIndentation = getLineIndentationLevel(line);
    
    // Handle elif specially - convert to nested ELSE/IF structure
    if (trimmed.startsWith('elif ')) {
      // Add ELSE at the same level as the original IF
      this.state.outputLines.push('ELSE');
      
      // Replace current block with ELSE
      this.state.currentBlockTypes.pop();
      this.state.currentBlockTypes.push({ type: BLOCK_TYPES.ELSE });
      
      // Convert elif to IF and add with proper indentation
      const elifCondition = trimmed.substring(5, trimmed.length - 1); // Remove 'elif ' and ':'
      const convertedCondition = this.convertCondition(elifCondition);
      const indentString = this.getIndentationString();
      this.state.outputLines.push(`${indentString}IF ${convertedCondition} THEN`);
      
      // Add IF block
      this.state.currentBlockTypes.push({ type: BLOCK_TYPES.IF });
      return;
    }
    
    // Handle else specially
    if (trimmed === 'else:') {
      // Add ELSE with proper indentation
      const indentString = this.getIndentationString();
      if (this.state.currentBlockTypes.length > 1) {
        this.state.outputLines.push(`${indentString}ELSE`);
      } else {
        this.state.outputLines.push('ELSE');
      }
      
      // Replace current block with ELSE
      this.state.currentBlockTypes.pop();
      this.state.currentBlockTypes.push({ type: BLOCK_TYPES.ELSE });
      return;
    }
    
    // Close blocks if indentation decreased
    this.closeBlocksForIndentation(currentIndentation);
    
    // Update indentation stack if increased
    if (currentIndentation > this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
      this.state.indentationLevels.push(currentIndentation);
    }
    
    // Convert and add the line
    const result = this.convertLineWithConverters(trimmed);
    const indentationString = this.getIndentationString();
    this.state.outputLines.push(`${indentationString}${result.convertedLine}`);
    
    // Add block type if this line starts a new block
    if (result.blockType) {
      this.state.currentBlockTypes.push(result.blockType);
    }
  }
  
  private convertCondition(condition: string): string {
    // Convert Python comparison operators to pseudocode
    return condition
      .replace(/==/g, '=')
      .replace(/!=/g, '≠')
      .replace(/<=/g, '≤')
      .replace(/>=/g, '≥')
      .replace(/\band\b/g, 'AND')
      .replace(/\bor\b/g, 'OR')
      .replace(/\bnot\b/g, 'NOT');
  }
  
  private convertLineWithConverters(line: string): ParseResult {
    const indentationString = this.getIndentationString();
    
    for (const converter of ALL_CONVERTERS) {
      const result = converter(line, indentationString, this.state);
      if (result && result.convertedLine !== line) {
        return result;
      }
    }
    
    // If no converter matched, return the line as-is
    return {
      convertedLine: line,
      blockType: null
    };
  }

  private getIndentationString(): string {
    if (this.state.currentBlockTypes.length === 0) {
      return '';
    }
    
    // Use 3 spaces per indentation level
    // The content inside blocks should be indented based on the number of blocks
    const blockCount = this.state.currentBlockTypes.length;
    return ' '.repeat(blockCount * INDENT_SIZE);
  }

  private closeBlocksForIndentation(currentIndentation: number): void {
    while (
      this.state.indentationLevels.length > 1 &&
      currentIndentation < this.state.indentationLevels[this.state.indentationLevels.length - 1]
    ) {
      this.closeCurrentBlock();
    }
  }

  private closeCurrentBlock(): void {
    this.state.indentationLevels.pop();
    const blockFrame = this.state.currentBlockTypes.pop()!;
    
    // Determine correct indentation for ENDIF
    let indentationString = '';
    const remainingBlocks = this.state.currentBlockTypes.length;
    
    if (remainingBlocks === 1) {
      indentationString = '   '; // 3 spaces for nested ENDIF
    } else if (remainingBlocks === 0) {
      indentationString = ''; // No indentation for outermost ENDIF
    } else {
      indentationString = ' '.repeat(remainingBlocks * INDENT_SIZE);
    }
    
    const closeKeyword = this.getCloseKeyword(blockFrame);
    this.state.outputLines.push(`${indentationString}${closeKeyword}`);
  }

  private getCloseKeyword(blockFrame: BlockFrame): string {
    const closeMap: { [key: string]: string } = {
      function: KEYWORDS.END_FUNCTION,
      procedure: KEYWORDS.END_PROCEDURE,
      class: KEYWORDS.END_CLASS,
      if: KEYWORDS.END_IF,
      elif: KEYWORDS.END_IF,
      else: KEYWORDS.END_IF,
      for: blockFrame.ident ? `${KEYWORDS.NEXT} ${blockFrame.ident}` : KEYWORDS.NEXT,
      while: KEYWORDS.END_WHILE,
      repeat: `${KEYWORDS.UNTIL} <condition>`,
    };
    
    return closeMap[blockFrame.type] || `END ${blockFrame.type.toUpperCase()}`;
  }

  private closeRemainingBlocks(): void {
    while (this.state.currentBlockTypes.length > 0) {
      this.closeCurrentBlock();
    }
  }
}
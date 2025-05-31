import { ParserState, ParseResult, BlockFrame } from './types';
import { BLOCK_TYPES, INDENT_SIZE } from './constants';
import { getLineIndentationLevel } from './utils';

export class IGCSEPseudocodeParser {
  private state: ParserState;

  constructor() {
    this.state = this.initializeState();
  }

  private initializeState(): ParserState {
    return {
      outputLines: [],
      currentBlockTypes: [],
      indentationLevels: [0],
      declarations: new Set(),
      typeFields: new Map()
    };
  }

  public parse(code: string): string {
    this.state = this.initializeState();
    const lines = code.split('\n');
    
    for (const line of lines) {
      this.processLine(line);
    }
    
    // Close any remaining blocks
    this.closeRemainingBlocks();
    
    return this.state.outputLines.join('\n');
  }

  private processLine(line: string): void {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }
    
    const currentIndentation = getLineIndentationLevel(line);
    
    // Handle different statement types
    if (trimmed.startsWith('if ')) {
      // Close blocks if indentation decreased (but not for if statements)
      this.closeBlocksForIndentation(currentIndentation);
      this.handleIf(trimmed);
    } else if (trimmed.startsWith('elif ')) {
      // elif is at the same level as if, don't close blocks
      this.handleElif(trimmed);
    } else if (trimmed === 'else:') {
      // else is at the same level as if, don't close blocks
      this.handleElse();
    } else {
      // Close blocks if indentation decreased
      this.closeBlocksForIndentation(currentIndentation);
      this.handleRegularStatement(trimmed, currentIndentation);
    }
  }

  private handleIf(line: string): void {
    const condition = this.convertCondition(line.substring(3, line.length - 1));
    const indentString = this.getIndentationString();
    this.state.outputLines.push(`${indentString}IF ${condition} THEN`);
    
    this.state.currentBlockTypes.push({ type: BLOCK_TYPES.IF });
  }

  private handleElif(line: string): void {
    // Convert elif to nested ELSE/IF structure
    // First, get the current indentation level (before popping)
    const currentIndentString = this.getIndentationString();
    
    // Add ELSE at the same level as the current IF
    this.state.outputLines.push('ELSE');
    
    // Replace current IF block with ELSE
    this.state.currentBlockTypes.pop();
    this.state.currentBlockTypes.push({ type: BLOCK_TYPES.ELSE });
    
    // Add nested IF with proper indentation
    const condition = this.convertCondition(line.substring(5, line.length - 1));
    this.state.outputLines.push(`   IF ${condition} THEN`);
    
    this.state.currentBlockTypes.push({ type: BLOCK_TYPES.IF });
  }

  private handleElse(): void {
    // For nested structure, ELSE should be indented
    if (this.state.currentBlockTypes.length > 1) {
      this.state.outputLines.push('   ELSE');
    } else {
      this.state.outputLines.push('ELSE');
    }
    
    // Replace current block with ELSE
    this.state.currentBlockTypes.pop();
    this.state.currentBlockTypes.push({ type: BLOCK_TYPES.ELSE });
  }

  private handleRegularStatement(line: string, currentIndentation: number): void {
    // Update indentation stack if increased
    if (currentIndentation > this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
      this.state.indentationLevels.push(currentIndentation);
    }
    
    // Convert the statement
    const convertedLine = this.convertStatement(line);
    const indentString = this.getIndentationString();
    this.state.outputLines.push(`${indentString}${convertedLine}`);
  }

  private convertStatement(line: string): string {
    // Convert print statements
    if (line.startsWith('print(')) {
      const content = line.substring(6, line.length - 1);
      return `OUTPUT ${content}`;
    }
    
    return line;
  }

  private convertCondition(condition: string): string {
    return condition
      .replace(/==/g, '=')
      .replace(/!=/g, '≠')
      .replace(/<=/g, '≤')
      .replace(/>=/g, '≥')
      .replace(/\band\b/g, 'AND')
      .replace(/\bor\b/g, 'OR')
      .replace(/\bnot\b/g, 'NOT');
  }

  private getIndentationString(): string {
    // For IGCSE pseudocode:
    // - Main IF content: 3 spaces
    // - Nested IF content: 6 spaces
    // - ELSE at same level as IF: no extra indentation
    
    const blockCount = this.state.currentBlockTypes.length;
    
    if (blockCount === 0) {
      return '';
    } else if (blockCount === 1) {
      return '   '; // 3 spaces for first level
    } else {
      return '      '; // 6 spaces for nested level
    }
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
    if (this.state.currentBlockTypes.length > 0) {
      const blockType = this.state.currentBlockTypes.pop();
      this.state.indentationLevels.pop();
      
      if (blockType?.type === BLOCK_TYPES.IF) {
        const indentString = this.getIndentationString();
        this.state.outputLines.push(`${indentString}ENDIF`);
      }
    }
  }

  private closeRemainingBlocks(): void {
    while (this.state.currentBlockTypes.length > 0) {
      this.closeCurrentBlock();
    }
  }
}
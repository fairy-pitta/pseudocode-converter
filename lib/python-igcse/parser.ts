import { ParserState, ParseResult, BlockFrame } from './types';
import { PATTERNS } from './patterns';
import { KEYWORDS, INDENT_SIZE, BLOCK_TYPES } from './constants';
import { getLineIndentationLevel, getLeadingWhitespace, convertConditionOperators } from './utils';
import { ALL_CONVERTERS } from './converters';

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
    
    // Handle empty lines
    if (!trimmed) {
      this.state.outputLines.push('');
      return;
    }
    
    // Handle comments
    if (trimmed.startsWith('#')) {
      const leadingWhitespace = getLeadingWhitespace(line);
      this.state.outputLines.push(`${leadingWhitespace}// ${trimmed.slice(1).trim()}`);
      return;
    }

    const currentIndentation = getLineIndentationLevel(line);
    
    // Close blocks if indentation decreased (but handle else and elif specially)
    if (trimmed === 'else:') {
      // For else, don't close blocks based on indentation - just replace IF/ELIF with ELSE
      const lastBlock = this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1];
      if (lastBlock && (lastBlock.type === BLOCK_TYPES.IF || lastBlock.type === BLOCK_TYPES.ELIF)) {
        // Replace the IF/ELIF block with ELSE block at the same level
        this.state.currentBlockTypes.pop();
      }
    } else if (trimmed.startsWith('elif ')) {
      // For elif, we need to close the current IF/ELIF block and start a new nested structure
      const lastBlock = this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1];
      if (lastBlock && (lastBlock.type === BLOCK_TYPES.IF || lastBlock.type === BLOCK_TYPES.ELIF)) {
        // Add ELSE at the same level as the original IF (no indentation)
        this.state.outputLines.push(KEYWORDS.ELSE);
        
        // Replace the current block with ELSE
        this.state.currentBlockTypes.pop();
        this.state.currentBlockTypes.push({ type: BLOCK_TYPES.ELSE });
        
        // Set indentation for the nested IF to be 3 spaces
        this.state.indentationLevels[this.state.indentationLevels.length - 1] = INDENT_SIZE;
      }
    } else {
      // Normal indentation handling for non-else/elif statements
      this.closeBlocksForIndentation(currentIndentation);
    }
    
    // Update indentation stack if increased
    if (currentIndentation > this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
      this.state.indentationLevels.push(currentIndentation);
    }
    
    const indentationString = ' '.repeat((this.state.indentationLevels.length - 1) * INDENT_SIZE);
    
    const result = this.convertLine(trimmed, indentationString);
    
    this.state.outputLines.push(result.convertedLine);
    
    if (result.blockType) {
      this.state.currentBlockTypes.push(result.blockType);
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
    this.state.indentationLevels.pop();
    const blockFrame = this.state.currentBlockTypes.pop()!;
    const indentationString = ' '.repeat((this.state.indentationLevels.length - 1) * INDENT_SIZE);
    
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



  private convertLine(line: string, indentation: string): ParseResult {
    for (const converter of ALL_CONVERTERS) {
      const result = converter(line, indentation, this.state);
      if (result.convertedLine !== line) {
        return result;
      }
    }
    
    // Fallback for unrecognized patterns
    return {
      convertedLine: `${indentation}// TODO: ${line}`,
      blockType: null,
    };
  }
}
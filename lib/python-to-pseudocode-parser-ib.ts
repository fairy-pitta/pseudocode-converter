import { INDENT_SIZE, KEYWORDS, BLOCK_TYPES, BlockType, OPERATORS } from './python-ib/constants';
import { ParseResult, ParserState } from './python-ib/types';
import { getLineIndentationLevel, getLeadingWhitespace, getCurrentIndentation } from './python-ib/utils';
import { ALL_CONVERTERS } from './python-ib/converters';
import { PATTERNS } from './python-ib/patterns';

export class IBParser {
  private state: ParserState = {
    indentationLevels: [0],
    currentBlockTypes: [],
    outputLines: [],
    isTryBlockOpen: false,
    tryBlockIndentationString: null, // Initialize here
  };

  public parse(sourceCode: string): string {
    if (!sourceCode || typeof sourceCode !== 'string') {
      return '';
    }
    // Reset state for each parse call
    this.state = {
      indentationLevels: [0],
      currentBlockTypes: [],
      outputLines: [],
      isTryBlockOpen: false,
      tryBlockIndentationString: null,
    };

    const lines = sourceCode.split('\n');
    for (const line of lines) {
      this.processLine(line);
    }

    // Close any remaining open blocks
    while (this.state.currentBlockTypes.length > 0) {
      this.closeBlock();
    }

    return this.state.outputLines.join('\n');
  }

  private processLine(line: string): void {
    const trimmedLine = line.trim();

    // Handle empty lines
    if (!trimmedLine) {
      this.state.outputLines.push('');
      return;
    }

    // Handle comments
    if (PATTERNS.COMMENT.test(trimmedLine)) {
      const leadingWhitespace = getLeadingWhitespace(line);
      this.state.outputLines.push(`${leadingWhitespace}// ${trimmedLine.substring(1).trim()}`);
      return;
    }

    const currentIndentationLevel = getLineIndentationLevel(line);
    const currentIndentationString = getCurrentIndentation(this.state);

    // Special handling for ELIF, ELSE, EXCEPT, and FINALLY - they should not close the previous block
    const isElif = PATTERNS.ELIF.test(trimmedLine);
    const isElse = PATTERNS.ELSE.test(trimmedLine);
    const isExcept = PATTERNS.EXCEPT.test(trimmedLine);
    const isFinally = PATTERNS.FINALLY.test(trimmedLine);
    
    if (isElif || isElse) {
      // For ELIF/ELSE, don't close blocks based on indentation
      // Just replace the block type in the stack if it's an IF/ELIF
      if (this.state.currentBlockTypes.length > 0) {
        const lastBlockType = this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1];
        if (lastBlockType === BLOCK_TYPES.IF || lastBlockType === BLOCK_TYPES.ELIF) {
          this.state.currentBlockTypes.pop();
        }
      }
    } else if (isExcept || isFinally) {
      // For EXCEPT/FINALLY, don't close blocks based on indentation
      // They are part of the TRY structure
    } else {
      // Adjust indentation levels and close blocks if necessary
      let maxIterations = 100; // Safety limit to prevent infinite loops
      while (
        this.state.indentationLevels.length > 1 &&
        currentIndentationLevel < this.state.indentationLevels[this.state.indentationLevels.length - 1] &&
        maxIterations > 0
      ) {
        const beforeLength = this.state.indentationLevels.length;
        this.closeBlock();
        maxIterations--;
        
        // If indentation levels didn't change, break to prevent infinite loop
        if (this.state.indentationLevels.length === beforeLength) {
          break;
        }
      }
    }

    // Increase indentation level if current line is more indented
    if (currentIndentationLevel > this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
      this.state.indentationLevels.push(currentIndentationLevel);
    }

    // Convert the line using the appropriate converter
    const actualIndentationString = getLeadingWhitespace(line);
    const result = this.convertLine(trimmedLine, actualIndentationString);
    if (result.convertedLine) {
      this.state.outputLines.push(result.convertedLine);
    }

    // Add block type to stack if applicable
    if (result.blockType) {
      this.state.currentBlockTypes.push(result.blockType);
    }
  }

  private convertLine(trimmedLine: string, indentationString: string): ParseResult {
    // Convert the line using the chain of converters
    let result: ParseResult = { convertedLine: `${indentationString}${trimmedLine}`, blockType: null };
    
    for (const converter of ALL_CONVERTERS) {
      const conversionAttempt = converter(trimmedLine, indentationString, this.state);
      // A converter has acted if the converted line is different from the original line
      // or a block type was returned
      if (conversionAttempt.convertedLine !== trimmedLine || 
          conversionAttempt.blockType !== null) {
        result = conversionAttempt;
        break;
      }
    }
    
    return result;
  }

  private closeBlock(): void {
    if (this.state.currentBlockTypes.length === 0) {
      return;
    }

    const blockTypeToClose = this.state.currentBlockTypes.pop();
    
    // Pop indentation level for most block types
    // CATCH and FINALLY don't pop indentation as they're part of TRY structure
    if (blockTypeToClose !== BLOCK_TYPES.CATCH && 
        blockTypeToClose !== BLOCK_TYPES.FINALLY &&
        this.state.indentationLevels.length > 1) {
      this.state.indentationLevels.pop();
    }
    
    // Safety check to prevent infinite loops
    if (!blockTypeToClose) {
      return;
    }
    
    // Use the stored indentation for END TRY, otherwise use current indentation
    const indentationToUse = (blockTypeToClose === BLOCK_TYPES.TRY && this.state.tryBlockIndentationString) 
      ? this.state.tryBlockIndentationString 
      : getCurrentIndentation(this.state);

    // Generate closing statement
    switch (blockTypeToClose) {
      case BLOCK_TYPES.IF:
      case BLOCK_TYPES.ELIF:
      case BLOCK_TYPES.ELSE:
        this.state.outputLines.push(`${indentationToUse}${KEYWORDS.END_IF}`);
        break;
      case BLOCK_TYPES.FOR:
        this.state.outputLines.push(`${indentationToUse}${KEYWORDS.END_FOR}`);
        break;
      case BLOCK_TYPES.WHILE:
        this.state.outputLines.push(`${indentationToUse}${KEYWORDS.END_WHILE}`);
        break;
      case BLOCK_TYPES.REPEAT:
        this.state.outputLines.push(`${indentationToUse}${KEYWORDS.UNTIL} condition`);
        break;
      case BLOCK_TYPES.TRY:
        this.state.outputLines.push(`${indentationToUse}${KEYWORDS.END_TRY}`);
        this.state.isTryBlockOpen = false;
        this.state.tryBlockIndentationString = null;
        break;
      case BLOCK_TYPES.FUNCTION:
        this.state.outputLines.push(`${indentationToUse}${KEYWORDS.END_FUNCTION}`);
        break;
      // CATCH and FINALLY don't generate closing statements
      case BLOCK_TYPES.CATCH:
      case BLOCK_TYPES.FINALLY:
        break;
    }
  }
}

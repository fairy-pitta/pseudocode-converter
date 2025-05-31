"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBParser = void 0;
const constants_1 = require("./python-ib/constants");
const utils_1 = require("./python-ib/utils");
const converters_1 = require("./python-ib/converters");
const patterns_1 = require("./python-ib/patterns");
class IBParser {
    constructor() {
        this.state = {
            indentationLevels: [0],
            currentBlockTypes: [],
            outputLines: [],
            isTryBlockOpen: false,
            tryBlockIndentationString: null, // Initialize here
        };
    }
    parse(sourceCode) {
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
    processLine(line) {
        const trimmedLine = line.trim();
        // Handle empty lines
        if (!trimmedLine) {
            this.state.outputLines.push('');
            return;
        }
        // Handle comments
        if (patterns_1.PATTERNS.COMMENT.test(trimmedLine)) {
            const leadingWhitespace = (0, utils_1.getLeadingWhitespace)(line);
            this.state.outputLines.push(`${leadingWhitespace}// ${trimmedLine.substring(1).trim()}`);
            return;
        }
        const currentIndentationLevel = (0, utils_1.getLineIndentationLevel)(line);
        const currentIndentationString = (0, utils_1.getCurrentIndentation)(this.state);
        // Special handling for ELIF, ELSE, EXCEPT, and FINALLY - they should not close the previous block
        const isElif = patterns_1.PATTERNS.ELIF.test(trimmedLine);
        const isElse = patterns_1.PATTERNS.ELSE.test(trimmedLine);
        const isExcept = patterns_1.PATTERNS.EXCEPT.test(trimmedLine);
        const isFinally = patterns_1.PATTERNS.FINALLY.test(trimmedLine);
        if (isElif || isElse) {
            // For ELIF/ELSE, don't close blocks based on indentation
            // Just replace the block type in the stack if it's an IF/ELIF
            if (this.state.currentBlockTypes.length > 0) {
                const lastBlockType = this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1];
                if (lastBlockType === constants_1.BLOCK_TYPES.IF || lastBlockType === constants_1.BLOCK_TYPES.ELIF) {
                    this.state.currentBlockTypes.pop();
                }
            }
        }
        else if (isExcept || isFinally) {
            // For EXCEPT/FINALLY, don't close blocks based on indentation
            // They are part of the TRY structure
        }
        else {
            // Adjust indentation levels and close blocks if necessary
            let maxIterations = 100; // Safety limit to prevent infinite loops
            while (this.state.indentationLevels.length > 1 &&
                currentIndentationLevel < this.state.indentationLevels[this.state.indentationLevels.length - 1] &&
                maxIterations > 0) {
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
        const actualIndentationString = (0, utils_1.getLeadingWhitespace)(line);
        const result = this.convertLine(trimmedLine, actualIndentationString);
        if (result.convertedLine) {
            this.state.outputLines.push(result.convertedLine);
        }
        // Add block type to stack if applicable
        if (result.blockType) {
            this.state.currentBlockTypes.push(result.blockType);
        }
    }
    convertLine(trimmedLine, indentationString) {
        // Convert the line using the chain of converters
        let result = { convertedLine: `${indentationString}${trimmedLine}`, blockType: null };
        for (const converter of converters_1.ALL_CONVERTERS) {
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
    closeBlock() {
        if (this.state.currentBlockTypes.length === 0) {
            return;
        }
        const blockTypeToClose = this.state.currentBlockTypes.pop();
        // Pop indentation level for most block types
        // CATCH and FINALLY don't pop indentation as they're part of TRY structure
        if (blockTypeToClose !== constants_1.BLOCK_TYPES.CATCH &&
            blockTypeToClose !== constants_1.BLOCK_TYPES.FINALLY &&
            this.state.indentationLevels.length > 1) {
            this.state.indentationLevels.pop();
        }
        // Safety check to prevent infinite loops
        if (!blockTypeToClose) {
            return;
        }
        // Use the stored indentation for END TRY, otherwise use current indentation
        const indentationToUse = (blockTypeToClose === constants_1.BLOCK_TYPES.TRY && this.state.tryBlockIndentationString)
            ? this.state.tryBlockIndentationString
            : (0, utils_1.getCurrentIndentation)(this.state);
        // Generate closing statement
        switch (blockTypeToClose) {
            case constants_1.BLOCK_TYPES.IF:
            case constants_1.BLOCK_TYPES.ELIF:
            case constants_1.BLOCK_TYPES.ELSE:
                this.state.outputLines.push(`${indentationToUse}${constants_1.KEYWORDS.END_IF}`);
                break;
            case constants_1.BLOCK_TYPES.FOR:
                this.state.outputLines.push(`${indentationToUse}${constants_1.KEYWORDS.END_FOR}`);
                break;
            case constants_1.BLOCK_TYPES.WHILE:
                this.state.outputLines.push(`${indentationToUse}${constants_1.KEYWORDS.END_WHILE}`);
                break;
            case constants_1.BLOCK_TYPES.REPEAT:
                this.state.outputLines.push(`${indentationToUse}${constants_1.KEYWORDS.UNTIL} condition`);
                break;
            case constants_1.BLOCK_TYPES.TRY:
                this.state.outputLines.push(`${indentationToUse}${constants_1.KEYWORDS.END_TRY}`);
                this.state.isTryBlockOpen = false;
                this.state.tryBlockIndentationString = null;
                break;
            case constants_1.BLOCK_TYPES.FUNCTION:
                this.state.outputLines.push(`${indentationToUse}${constants_1.KEYWORDS.END_FUNCTION}`);
                break;
            // CATCH and FINALLY don't generate closing statements
            case constants_1.BLOCK_TYPES.CATCH:
            case constants_1.BLOCK_TYPES.FINALLY:
                break;
        }
    }
}
exports.IBParser = IBParser;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGCSEPseudocodeParser = void 0;
const patterns_1 = require("./patterns");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const converters_1 = require("./converters");
// Helper list for block types that start a new indentation level
const INDENTING_BLOCK_TYPES_LIST = [
    constants_1.BLOCK_TYPES.IF,
    constants_1.BLOCK_TYPES.FOR,
    constants_1.BLOCK_TYPES.WHILE,
    constants_1.BLOCK_TYPES.FUNCTION,
    constants_1.BLOCK_TYPES.PROCEDURE,
    constants_1.BLOCK_TYPES.CLASS,
    constants_1.BLOCK_TYPES.REPEAT,
];
class IGCSEPseudocodeParser {
    parse(sourceCode) {
        if (!sourceCode.trim())
            return '';
        this.initializeState();
        const lines = sourceCode.split(/\r?\n/);
        this.collectDeclarations(lines);
        lines.forEach(line => this.processLine(line));
        this.closeRemainingBlocks();
        return this.state.outputLines.join('\n');
    }
    initializeState() {
        this.state = {
            indentationLevels: [0],
            currentBlockTypes: [],
            outputLines: [],
            declarations: new Set(),
            isTryBlockOpen: false,
            tryBlockIndentationString: null,
        };
    }
    collectDeclarations(lines) {
        // For IGCSE, we don't pre-declare variables
        // Variables are declared inline when first assigned
        // Pre-scan for dictionary fields to ensure complete TYPE definitions
        this.prescanDictionaryFields(lines);
    }
    prescanDictionaryFields(lines) {
        if (!this.state.typeFields) {
            this.state.typeFields = new Map();
        }
        lines.forEach(line => {
            // Check for dictionary literal
            const dictLiteralMatch = line.match(patterns_1.PATTERNS.DICTIONARY_LITERAL);
            if (dictLiteralMatch) {
                const [, variable, content] = dictLiteralMatch;
                if (!this.state.typeFields.has(variable)) {
                    this.state.typeFields.set(variable, new Set());
                }
                const pairs = content.split(',').map(pair => {
                    const [key] = pair.split(':').map(s => s.trim());
                    return key.replace(/["']/g, '');
                });
                pairs.forEach(key => {
                    this.state.typeFields.get(variable).add(key);
                });
            }
            // Check for dictionary assignment
            const dictAssignMatch = line.match(patterns_1.PATTERNS.DICTIONARY_ASSIGNMENT);
            if (dictAssignMatch) {
                const [, variable, key] = dictAssignMatch;
                const cleanKey = key.replace(/["']/g, '');
                if (!this.state.typeFields.has(variable)) {
                    this.state.typeFields.set(variable, new Set());
                }
                this.state.typeFields.get(variable).add(cleanKey);
            }
        });
    }
    processLine(line) {
        console.log('[processLine] Start. Line:', `"${line}"`, 'currentBlockTypes:', JSON.stringify(this.state.currentBlockTypes), 'indentationLevels:', JSON.stringify(this.state.indentationLevels));
        const trimmed = line.trim();
        if (!trimmed) {
            this.state.outputLines.push('');
            console.log('[processLine] Empty line processed.');
            return;
        }
        if (trimmed.startsWith('#')) {
            const leadingWhitespace = (0, utils_1.getLeadingWhitespace)(line);
            this.state.outputLines.push(`${leadingWhitespace}// ${trimmed.slice(1).trim()}`);
            // console.log('[processLine] Comment processed:', this.state.outputLines[this.state.outputLines.length - 1]);
            return;
        }
        const currentIndentation = (0, utils_1.getLineIndentationLevel)(line);
        console.log(`[processLine] currentIndentation for "${trimmed}": ${currentIndentation}`);
        // 1. Close any blocks whose indentation level is greater than the current line's indentation.
        //    This must happen BEFORE processing the current line's block type, especially for ELSE/ELIF.
        this.closeBlocksForIndentation(currentIndentation);
        console.log(`[processLine] After closeBlocksForIndentation. currentBlockTypes: ${JSON.stringify(this.state.currentBlockTypes)}, indentationLevels: ${JSON.stringify(this.state.indentationLevels)}`);
        // 2. Determine an initial indentation string (this might be refined later)
        let initialPseudocodeIndentLevel = 0;
        // Use indentationLevels *before* processing the current line's block structure
        if (this.state.indentationLevels.length > 0) {
            initialPseudocodeIndentLevel = Math.max(0, this.state.indentationLevels.length - 1);
        }
        const initialIndentationString = ' '.repeat(initialPseudocodeIndentLevel * constants_1.INDENT_SIZE);
        // console.log(`[processLine] Initial indentationString: "${initialIndentationString}" (length ${initialIndentationString.length}), initialPseudocodeIndentLevel: ${initialPseudocodeIndentLevel}, initial indentationLevels: ${JSON.stringify(this.state.indentationLevels)}`);
        // 3. Handle inline comments (comments at the end of a line)
        let lineToConvert = trimmed;
        let inlineComment = '';
        const commentIndex = trimmed.indexOf('#');
        if (commentIndex > 0) {
            // Check if the # is not inside a string
            const beforeComment = trimmed.substring(0, commentIndex);
            const singleQuotes = (beforeComment.match(/'/g) || []).length;
            const doubleQuotes = (beforeComment.match(/"/g) || []).length;
            // If quotes are balanced, the # is likely a comment
            if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
                lineToConvert = beforeComment.trim();
                inlineComment = '  // ' + trimmed.substring(commentIndex + 1).trim();
            }
        }
        // 4. Convert the Python line to pseudocode.
        const conversionResult = this.convertLine(lineToConvert, initialIndentationString); // Pass initial indent, converters might use it
        // console.log(`[processLine] Raw Converted line: "${conversionResult.convertedLine}", Original: "${trimmed}", BlockType from converter: ${conversionResult.blockType ? conversionResult.blockType.type : 'null'}`);
        // 5. Manage the block type stack (currentBlockTypes) and indentation level stack (indentationLevels).
        // This section updates this.state.indentationLevels based on conversionResult.blockType
        if (conversionResult.blockType) {
            const newBlockType = conversionResult.blockType.type;
            console.log(`[processLine] Processing new blockType: ${newBlockType}`);
            if (newBlockType === constants_1.BLOCK_TYPES.ELSE || newBlockType === constants_1.BLOCK_TYPES.ELIF) {
                const lastBlockOnStack = this.state.currentBlockTypes.length > 0 ? this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1] : null;
                if (lastBlockOnStack && (lastBlockOnStack.type === constants_1.BLOCK_TYPES.IF || lastBlockOnStack.type === constants_1.BLOCK_TYPES.ELIF)) {
                    console.log(`[processLine] ${newBlockType} is replacing ${lastBlockOnStack.type} on stack.`);
                    this.state.currentBlockTypes.pop(); // Remove the IF/ELIF.
                    this.state.currentBlockTypes.push(conversionResult.blockType); // Add the new ELSE/ELIF.
                }
                else {
                    // This case can happen if an ELSE/ELIF appears without a preceding IF/ELIF at the same or higher indent level
                    // or if the preceding block was already closed by dedent.
                    console.warn(`[processLine] State Warning: Encountered ${newBlockType} but stack top is ${lastBlockOnStack ? lastBlockOnStack.type : 'empty'} or not IF/ELIF. Line: "${trimmed}". Pushing anyway.`);
                    this.state.currentBlockTypes.push(conversionResult.blockType);
                }
                // ELSE/ELIF do not start a new indentation level themselves. They continue the parent IF's level.
                // The indentationLevels stack should have been adjusted by closeBlocksForIndentation if currentIndentation changed.
            }
            else {
                // For new blocks like IF, FOR, WHILE, FUNCTION, PROCEDURE, CLASS.
                this.state.currentBlockTypes.push(conversionResult.blockType);
                console.log(`[processLine] Pushed ${newBlockType} to currentBlockTypes. Stack: ${JSON.stringify(this.state.currentBlockTypes)}`);
                // Only push to indentationLevels if this block type *starts* a new indent level
                // AND the current line's indentation is actually greater than the previous level.
                if (INDENTING_BLOCK_TYPES_LIST.includes(newBlockType)) {
                    const lastStoredIndentationLevel = this.state.indentationLevels[this.state.indentationLevels.length - 1];
                    if (currentIndentation > lastStoredIndentationLevel) {
                        this.state.indentationLevels.push(currentIndentation);
                        console.log(`[processLine] Pushed new indentation level ${currentIndentation}. Stack: ${JSON.stringify(this.state.indentationLevels)}`);
                    }
                    else if (currentIndentation === lastStoredIndentationLevel) {
                        // This handles cases like an IF at indent 0, then content at indent 0.
                        // Or, if an IF is at indent N, and its content is also at indent N (which is unusual for Python but could happen).
                        // We only push if the stack is at base [0] and currentIndentation > 0, meaning first actual indent.
                        if (this.state.indentationLevels.length === 1 && lastStoredIndentationLevel === 0 && currentIndentation > 0) {
                            this.state.indentationLevels.push(currentIndentation);
                            console.log(`[processLine] Pushed initial indentation level ${currentIndentation} from base [0]. Stack: ${JSON.stringify(this.state.indentationLevels)}`);
                        }
                        else {
                            console.log(`[processLine] New block ${newBlockType} at same or lesser indentation ${currentIndentation} as previous ${lastStoredIndentationLevel}. Not pushing to indentationLevels.`);
                        }
                    }
                    else {
                        console.log(`[processLine] New block ${newBlockType} at lesser indentation ${currentIndentation} than previous ${lastStoredIndentationLevel}. Not pushing to indentationLevels (should have been handled by closeBlocksForIndentation).`);
                    }
                }
            }
        }
        // 6. Recalculate correct indentation based on *updated* indentationLevels and IGCSE rules
        let correctPseudocodeIndentLevel = 0;
        // currentPythonBlockDepth is 0 for top-level, 1 for first nesting, etc., based on *updated* indentationLevels
        const currentPythonBlockDepth = Math.max(0, this.state.indentationLevels.length - 1);
        const blockType = conversionResult.blockType ? conversionResult.blockType.type : null;
        if (blockType &&
            (blockType === constants_1.BLOCK_TYPES.IF || blockType === constants_1.BLOCK_TYPES.FOR || blockType === constants_1.BLOCK_TYPES.WHILE || blockType === constants_1.BLOCK_TYPES.REPEAT ||
                blockType === constants_1.BLOCK_TYPES.FUNCTION || blockType === constants_1.BLOCK_TYPES.PROCEDURE || blockType === constants_1.BLOCK_TYPES.CLASS ||
                blockType === constants_1.BLOCK_TYPES.ELSE || blockType === constants_1.BLOCK_TYPES.ELIF ||
                blockType === constants_1.BLOCK_TYPES.ENDIF || blockType === constants_1.BLOCK_TYPES.NEXT || blockType === constants_1.BLOCK_TYPES.ENDWHILE ||
                blockType === constants_1.BLOCK_TYPES.ENDFUNCTION || blockType === constants_1.BLOCK_TYPES.ENDCLASS || blockType === constants_1.BLOCK_TYPES.RETURN ||
                blockType === constants_1.BLOCK_TYPES.TRY || blockType === constants_1.BLOCK_TYPES.EXCEPT || blockType === constants_1.BLOCK_TYPES.FINALLY)) {
            correctPseudocodeIndentLevel = currentPythonBlockDepth;
        }
        else { // Line inside a block or simple top-level statement
            if (this.state.indentationLevels.length <= 1 && !blockType) { // Top-level simple statement (e.g. x = 1) or if indentationLevels is unexpectedly empty
                correctPseudocodeIndentLevel = 0;
            }
            else { // Line inside a block (e.g. OUTPUT, assignment inside IF)
                // currentPythonBlockDepth is the depth of the *current* block itself.
                // Lines *inside* this block should be indented one level further in pseudocode.
                correctPseudocodeIndentLevel = currentPythonBlockDepth;
                // For lines that are *not* new block declarations (IF, ELSE, etc.) but are *inside* a block,
                // they need an additional indent level compared to their parent block's declaration line.
                if (!blockType) { // e.g. OUTPUT "foo" inside an IF block
                    correctPseudocodeIndentLevel = Math.max(0, this.state.indentationLevels.length - 1) + 1; // indent one more than the current block's declaration
                }
                else if (blockType &&
                    !(blockType === constants_1.BLOCK_TYPES.IF || blockType === constants_1.BLOCK_TYPES.FOR || blockType === constants_1.BLOCK_TYPES.WHILE ||
                        blockType === constants_1.BLOCK_TYPES.FUNCTION || blockType === constants_1.BLOCK_TYPES.PROCEDURE || blockType === constants_1.BLOCK_TYPES.CLASS ||
                        blockType === constants_1.BLOCK_TYPES.ELSE || blockType === constants_1.BLOCK_TYPES.ELIF ||
                        blockType === constants_1.BLOCK_TYPES.ENDIF || blockType === constants_1.BLOCK_TYPES.NEXT || blockType === constants_1.BLOCK_TYPES.ENDWHILE ||
                        blockType === constants_1.BLOCK_TYPES.ENDFUNCTION || blockType === constants_1.BLOCK_TYPES.ENDCLASS || blockType === constants_1.BLOCK_TYPES.RETURN ||
                        blockType === constants_1.BLOCK_TYPES.TRY || blockType === constants_1.BLOCK_TYPES.EXCEPT || blockType === constants_1.BLOCK_TYPES.FINALLY)) {
                    // This case handles custom block types that might exist and are not structural keywords.
                    // Assume they behave like simple statements within the current block's indentation.
                    correctPseudocodeIndentLevel = Math.max(0, this.state.indentationLevels.length - 1) + 1;
                }
            }
        }
        correctPseudocodeIndentLevel = Math.max(0, correctPseudocodeIndentLevel);
        const correctIndentationString = ' '.repeat(correctPseudocodeIndentLevel * constants_1.INDENT_SIZE);
        // Remove initial indentation (if any) from conversionResult.convertedLine and prepend correctIndentationString
        let lineContent = conversionResult.convertedLine;
        if (initialIndentationString.length > 0 && lineContent.startsWith(initialIndentationString)) {
            lineContent = lineContent.substring(initialIndentationString.length);
        }
        else {
            // If initialIndentationString was empty, or line didn't start with it (e.g. converter didn't use it), trim leading spaces that might be there by mistake.
            // This is a bit of a fallback.
            lineContent = lineContent.trimStart();
        }
        const finalConvertedLine = correctIndentationString + lineContent + inlineComment;
        this.state.outputLines.push(finalConvertedLine);
        console.log(`[processLine] Indent: InitialLvl=${initialPseudocodeIndentLevel}, CorrectLvl=${correctPseudocodeIndentLevel}. InitialStr="${initialIndentationString}", CorrectStr="${correctIndentationString}"`);
        console.log(`[processLine] Line content: "${lineContent}", Final line: "${finalConvertedLine}"`);
        console.log(`[processLine] End. currentBlockTypes: ${JSON.stringify(this.state.currentBlockTypes)} indentationLevels: ${JSON.stringify(this.state.indentationLevels)} Output lines count: ${this.state.outputLines.length}`);
    }
    closeBlocksForIndentation(currentIndentation) {
        while (this.state.indentationLevels.length > 1 &&
            currentIndentation < this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
            this.closeCurrentBlock();
        }
    }
    closeCurrentBlock() {
        console.log(`[closeCurrentBlock] Start. currentBlockTypes: ${JSON.stringify(this.state.currentBlockTypes)}, indentationLevels: ${JSON.stringify(this.state.indentationLevels)}`);
        // Pop indentation level only if we are not at the base level (length > 1)
        if (this.state.indentationLevels.length > 1) {
            this.state.indentationLevels.pop();
            console.log(`[closeCurrentBlock] Popped from indentationLevels. New levels: ${JSON.stringify(this.state.indentationLevels)}`);
        }
        else if (this.state.indentationLevels.length === 1 && this.state.currentBlockTypes.length > 0) {
            // We are at the base indentation level (e.g., [0]), but there are still blocks to close.
            // This is expected when closing the outermost blocks of the code.
            // Do not pop from indentationLevels, but proceed to close the block.
            console.log('[closeCurrentBlock] At base indentation level, but blocks remain. Proceeding to close block.');
        }
        else if (this.state.indentationLevels.length === 0) {
            console.error('[closeCurrentBlock] Error: indentationLevels is empty. This should not happen.');
            // Avoid RangeError by not proceeding if indentationLevels is critically short
            if (this.state.currentBlockTypes.length === 0)
                return; // No block to close anyway
        }
        const blockFrame = this.state.currentBlockTypes.pop();
        console.log('[closeCurrentBlock] blockFrame after pop:', JSON.stringify(blockFrame));
        if (!blockFrame) {
            console.error('[closeCurrentBlock] Error: blockFrame is undefined after pop. currentBlockTypes was empty.');
            const baseIndentCount = this.state.indentationLevels.length > 0 ? this.state.indentationLevels.length - 1 : 0;
            this.state.outputLines.push(' '.repeat(baseIndentCount * constants_1.INDENT_SIZE) + 'ERROR_UNDEFINED_BLOCKFRAME');
            return;
        }
        const baseIndentationCount = this.state.indentationLevels.length > 0 ? this.state.indentationLevels.length - 1 : 0;
        console.log(`[closeCurrentBlock] baseIndentationCount for closing keyword: ${baseIndentationCount}`);
        const indentationString = ' '.repeat(baseIndentationCount * constants_1.INDENT_SIZE);
        const closeKeyword = this.getCloseKeyword(blockFrame);
        this.state.outputLines.push(`${indentationString}${closeKeyword}`);
        // Reset try block state when closing TRY block
        if (blockFrame.type === constants_1.BLOCK_TYPES.TRY) {
            this.state.isTryBlockOpen = false;
            this.state.tryBlockIndentationString = null;
        }
        console.log(`[closeCurrentBlock] End. currentBlockTypes: ${JSON.stringify(this.state.currentBlockTypes)}, indentationLevels: ${JSON.stringify(this.state.indentationLevels)}`);
    }
    getCloseKeyword(blockFrame) {
        console.log('[getCloseKeyword] blockFrame:', JSON.stringify(blockFrame));
        const closeMap = {
            function: constants_1.KEYWORDS.END_FUNCTION,
            procedure: constants_1.KEYWORDS.END_PROCEDURE,
            class: constants_1.KEYWORDS.END_CLASS,
            if: constants_1.KEYWORDS.END_IF,
            elif: constants_1.KEYWORDS.END_IF,
            else: constants_1.KEYWORDS.END_IF,
            for: blockFrame.ident ? `${constants_1.KEYWORDS.NEXT} ${blockFrame.ident}` : constants_1.KEYWORDS.NEXT,
            while: constants_1.KEYWORDS.END_WHILE,
            repeat: `${constants_1.KEYWORDS.UNTIL} <condition>`,
            try: 'ENDIF',
            except: '', // except doesn't need a closing keyword
            finally: '', // finally doesn't need a closing keyword
        };
        return closeMap[blockFrame.type] || `END ${blockFrame.type.toUpperCase()}`;
    }
    closeRemainingBlocks() {
        while (this.state.currentBlockTypes.length > 0) {
            this.closeCurrentBlock();
        }
    }
    convertLine(line, indentation) {
        for (const converter of converters_1.ALL_CONVERTERS) {
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
exports.IGCSEPseudocodeParser = IGCSEPseudocodeParser;

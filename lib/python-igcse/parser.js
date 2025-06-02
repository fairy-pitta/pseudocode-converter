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
    constants_1.BLOCK_TYPES.CONSTRUCTOR,
    constants_1.BLOCK_TYPES.METHOD,
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
            functionHasReturn: new Map(),
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
        // Check if this line is ELIF or ELSE before closing blocks
        const isElif = /^elif\s+.+:$/i.test(trimmed);
        const isElse = /^else\s*:$/i.test(trimmed);
        const skipBlockClosing = isElif || isElse;
        // 1. Close any blocks whose indentation level is greater than the current line's indentation.
        //    This must happen BEFORE processing the current line's block type, especially for ELSE/ELIF.
        //    But skip for ELIF/ELSE to prevent premature END IF generation
        this.closeBlocksForIndentation(currentIndentation, skipBlockClosing);
        console.log(`[processLine] After closeBlocksForIndentation. currentBlockTypes: ${JSON.stringify(this.state.currentBlockTypes)}, indentationLevels: ${JSON.stringify(this.state.indentationLevels)}`);
        // Update indentationLevels based on Python's physical indentation
        const lastStoredIndentationLevel = this.state.indentationLevels[this.state.indentationLevels.length - 1];
        if (currentIndentation > lastStoredIndentationLevel) {
            this.state.indentationLevels.push(currentIndentation);
            console.log(`[processLine] Pushed new Python indentation level ${currentIndentation}. Stack: ${JSON.stringify(this.state.indentationLevels)}`);
        }
        // 2. Determine an initial indentation string (this might be refined later)
        // This initial indentation is less critical now as we recalculate precisely later,
        // but converters might still use it as a hint.
        let initialPseudocodeIndentLevel = 0;
        if (this.state.indentationLevels.length > 0) {
            initialPseudocodeIndentLevel = Math.max(0, this.state.indentationLevels.length - 1);
        }
        const initialIndentationString = ' '.repeat(initialPseudocodeIndentLevel * constants_1.INDENT_SIZE);
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
            console.log(`[processLine] Skipping line: "${trimmed}" (converter returned null)`);
            return;
        }
        // 5. Manage the block type stack (currentBlockTypes).
        // IndentationLevels stack is now managed based on physical Python indent.
        if (conversionResult.blockType) {
            const newBlockType = conversionResult.blockType.type;
            console.log(`[processLine] Processing new blockType: ${newBlockType}`);
            if (newBlockType === constants_1.BLOCK_TYPES.ELSE || newBlockType === constants_1.BLOCK_TYPES.ELIF) {
                const lastBlockOnStack = this.state.currentBlockTypes.length > 0 ? this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1] : null;
                if (lastBlockOnStack && (lastBlockOnStack.type === constants_1.BLOCK_TYPES.IF || lastBlockOnStack.type === constants_1.BLOCK_TYPES.ELIF)) {
                    console.log(`[processLine] ${newBlockType} is replacing ${lastBlockOnStack.type} on stack.`);
                    this.state.currentBlockTypes.pop();
                    this.state.currentBlockTypes.push(conversionResult.blockType);
                }
                else {
                    console.warn(`[processLine] State Warning: Encountered ${newBlockType} but stack top is ${lastBlockOnStack ? lastBlockOnStack.type : 'empty'} or not IF/ELIF. Line: "${trimmed}". Pushing anyway.`);
                    this.state.currentBlockTypes.push(conversionResult.blockType);
                }
            }
            else {
                this.state.currentBlockTypes.push(conversionResult.blockType);
                console.log(`[processLine] Pushed ${newBlockType} to currentBlockTypes. Stack: ${JSON.stringify(this.state.currentBlockTypes)}`);
                // The INDENTING_BLOCK_TYPES_LIST check and associated indentationLevels.push
                // is removed here as indentationLevels is now managed by physical Python indent.
            }
        }
        else if (conversionResult.blockType) {
            console.log(`[processLine] Skipped pushing ${conversionResult.blockType} (STATEMENT type)`);
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
        // Handle additional lines if present
        if (conversionResult.additionalLines) {
            for (const additionalLine of conversionResult.additionalLines) {
                this.state.outputLines.push(additionalLine);
            }
        }
        console.log(`[processLine] Indent: InitialLvl=${initialPseudocodeIndentLevel}, CorrectLvl=${correctPseudocodeIndentLevel}. InitialStr="${initialIndentationString}", CorrectStr="${correctIndentationString}"`);
        console.log(`[processLine] Line content: "${lineContent}", Final line: "${finalConvertedLine}"`);
        console.log(`[processLine] End. currentBlockTypes: ${JSON.stringify(this.state.currentBlockTypes)} indentationLevels: ${JSON.stringify(this.state.indentationLevels)} Output lines count: ${this.state.outputLines.length}`);
    }
    closeBlocksForIndentation(currentIndentation, skipForElif = false) {
        // Skip closing blocks if this is an ELIF/ELSE at the same level as the preceding IF
        if (skipForElif) {
            console.log('[closeBlocksForIndentation] Skipping block closure for ELIF/ELSE');
            return;
        }
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
        // Handle function block closure - convert TEMP_FUNCTION to proper FUNCTION/PROCEDURE
        if (blockFrame.type === constants_1.BLOCK_TYPES.FUNCTION && blockFrame.ident) {
            this.finalizeFunctionDefinition(blockFrame.ident);
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
        // Special handling for function blocks
        if (blockFrame.type === constants_1.BLOCK_TYPES.FUNCTION && blockFrame.ident) {
            const hasReturn = this.state.functionHasReturn.get(blockFrame.ident) || false;
            return hasReturn ? constants_1.KEYWORDS.END_FUNCTION : constants_1.KEYWORDS.END_PROCEDURE;
        }
        const closeMap = {
            function: constants_1.KEYWORDS.END_FUNCTION,
            procedure: constants_1.KEYWORDS.END_PROCEDURE,
            class: constants_1.KEYWORDS.END_CLASS,
            constructor: constants_1.KEYWORDS.END_PROCEDURE, // Constructor uses ENDPROCEDURE
            method: constants_1.KEYWORDS.END_PROCEDURE, // Method uses ENDPROCEDURE
            if: constants_1.KEYWORDS.END_IF,
            elif: constants_1.KEYWORDS.END_IF,
            else: constants_1.KEYWORDS.END_IF,
            for: blockFrame.ident ? `${constants_1.KEYWORDS.NEXT} ${blockFrame.ident}` : constants_1.KEYWORDS.NEXT,
            while: constants_1.KEYWORDS.END_WHILE,
            file_while: constants_1.KEYWORDS.END_WHILE,
            repeat: `${constants_1.KEYWORDS.UNTIL} <condition>`,
            try: 'ENDIF',
            except: '', // except doesn't need a closing keyword
            finally: '', // finally doesn't need a closing keyword
            return: '', // return doesn't need a closing keyword
            with: this.state.currentFile ? `CLOSEFILE "${this.state.currentFile}"` : 'END WITH',
        };
        return closeMap[blockFrame.type] || `END ${blockFrame.type?.toUpperCase() || 'BLOCK'}`;
    }
    inferReturnType(functionName) {
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
        if (functionStartIndex === -1)
            return 'INTEGER';
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
    finalizeFunctionDefinition(functionName) {
        const hasReturn = this.state.functionHasReturn.get(functionName) || false;
        const pascalCaseName = functionName.charAt(0).toUpperCase() + functionName.slice(1);
        // Find and update the function definition line
        for (let i = 0; i < this.state.outputLines.length; i++) {
            const line = this.state.outputLines[i];
            if (line.includes(`TEMP_FUNCTION ${pascalCaseName}`)) {
                if (hasReturn) {
                    // Convert to FUNCTION with RETURNS
                    this.state.outputLines[i] = line.replace(/TEMP_FUNCTION (\w+)\(([^)]*)\)/, (match, name, params) => {
                        // Add RETURNS with inferred type if not already present
                        if (!this.state.outputLines[i].includes('RETURNS')) {
                            const returnType = this.inferReturnType(functionName);
                            return `${constants_1.KEYWORDS.FUNCTION} ${name}(${params}) RETURNS ${returnType}`;
                        }
                        return `${constants_1.KEYWORDS.FUNCTION} ${name}(${params})`;
                    });
                }
                else {
                    // Convert to PROCEDURE
                    this.state.outputLines[i] = line.replace(`TEMP_FUNCTION ${pascalCaseName}`, `${constants_1.KEYWORDS.PROCEDURE} ${pascalCaseName}`);
                }
                break;
            }
        }
    }
    closeRemainingBlocks() {
        while (this.state.currentBlockTypes.length > 0) {
            this.closeCurrentBlock();
        }
    }
    convertLine(line, indentation) {
        for (const converter of converters_1.ALL_CONVERTERS) {
            const result = converter(line, indentation, this.state);
            if (result && result.convertedLine !== line) {
                return result;
            }
        }
        // If no converter handled the line, add a TODO comment
        return {
            convertedLine: `${indentation}// TODO: ${line.trim()}`,
            blockType: null
        };
    }
}
exports.IGCSEPseudocodeParser = IGCSEPseudocodeParser;

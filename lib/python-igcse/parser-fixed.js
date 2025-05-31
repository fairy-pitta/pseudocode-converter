"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGCSEPseudocodeParser = void 0;
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var converters_1 = require("./converters");
var IGCSEPseudocodeParser = /** @class */ (function () {
    function IGCSEPseudocodeParser() {
        this.state = {
            outputLines: [],
            currentBlockTypes: [],
            indentationLevels: [0],
            declarations: new Set(),
            typeFields: new Map(),
        };
    }
    IGCSEPseudocodeParser.prototype.parse = function (pythonCode) {
        this.initializeState();
        var lines = pythonCode.split('\n');
        // Pre-scan for dictionary field declarations
        this.prescanDictionaryFields(lines);
        // Collect all variable declarations first
        this.collectDeclarations(lines);
        // Process each line
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            this.processLine(line);
        }
        // Close any remaining blocks
        this.closeRemainingBlocks();
        return this.state.outputLines.join('\n');
    };
    IGCSEPseudocodeParser.prototype.initializeState = function () {
        var _a;
        this.state.outputLines = [];
        this.state.currentBlockTypes = [];
        this.state.indentationLevels = [0];
        this.state.declarations.clear();
        (_a = this.state.typeFields) === null || _a === void 0 ? void 0 : _a.clear();
    };
    IGCSEPseudocodeParser.prototype.collectDeclarations = function (lines) {
        for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
            var line = lines_2[_i];
            var trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                // Look for variable assignments
                var assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
                if (assignMatch) {
                    this.state.declarations.add(assignMatch[1]);
                }
            }
        }
    };
    IGCSEPseudocodeParser.prototype.prescanDictionaryFields = function (lines) {
        for (var _i = 0, lines_3 = lines; _i < lines_3.length; _i++) {
            var line = lines_3[_i];
            var trimmed = line.trim();
            var dictFieldMatch = trimmed.match(/([a-zA-Z_][a-zA-Z0-9_]*)\[(['"])([^'"]+)\2\]\s*=/);
            if (dictFieldMatch) {
                var dictName = dictFieldMatch[1];
                var fieldName = dictFieldMatch[3];
                if (!this.state.typeFields) {
                    this.state.typeFields = new Map();
                }
                if (!this.state.typeFields.has(dictName)) {
                    this.state.typeFields.set(dictName, new Set());
                }
                this.state.typeFields.get(dictName).add(fieldName);
            }
        }
    };
    IGCSEPseudocodeParser.prototype.processLine = function (line) {
        var trimmed = line.trim();
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }
        var currentIndentation = (0, utils_1.getLineIndentationLevel)(line);
        // Handle elif specially - convert to nested ELSE/IF structure
        if (trimmed.startsWith('elif ')) {
            // Add ELSE at the same level as the original IF
            this.state.outputLines.push('ELSE');
            // Replace current block with ELSE
            this.state.currentBlockTypes.pop();
            this.state.currentBlockTypes.push({ type: constants_1.BLOCK_TYPES.ELSE });
            // Convert elif to IF and add with proper indentation
            var elifCondition = trimmed.substring(5, trimmed.length - 1); // Remove 'elif ' and ':'
            var convertedCondition = this.convertCondition(elifCondition);
            var indentString = this.getIndentationString();
            this.state.outputLines.push("".concat(indentString, "IF ").concat(convertedCondition, " THEN"));
            // Add IF block
            this.state.currentBlockTypes.push({ type: constants_1.BLOCK_TYPES.IF });
            return;
        }
        // Handle else specially
        if (trimmed === 'else:') {
            // Add ELSE with proper indentation
            var indentString = this.getIndentationString();
            if (this.state.currentBlockTypes.length > 1) {
                this.state.outputLines.push("".concat(indentString, "ELSE"));
            }
            else {
                this.state.outputLines.push('ELSE');
            }
            // Replace current block with ELSE
            this.state.currentBlockTypes.pop();
            this.state.currentBlockTypes.push({ type: constants_1.BLOCK_TYPES.ELSE });
            return;
        }
        // Close blocks if indentation decreased
        this.closeBlocksForIndentation(currentIndentation);
        // Update indentation stack if increased
        if (currentIndentation > this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
            this.state.indentationLevels.push(currentIndentation);
        }
        // Convert and add the line
        var result = this.convertLineWithConverters(trimmed);
        var indentationString = this.getIndentationString();
        this.state.outputLines.push("".concat(indentationString).concat(result.convertedLine));
        // Add block type if this line starts a new block
        if (result.blockType) {
            this.state.currentBlockTypes.push(result.blockType);
        }
    };
    IGCSEPseudocodeParser.prototype.convertCondition = function (condition) {
        // Convert Python comparison operators to pseudocode
        return condition
            .replace(/==/g, '=')
            .replace(/!=/g, '≠')
            .replace(/<=/g, '≤')
            .replace(/>=/g, '≥')
            .replace(/\band\b/g, 'AND')
            .replace(/\bor\b/g, 'OR')
            .replace(/\bnot\b/g, 'NOT');
    };
    IGCSEPseudocodeParser.prototype.convertLineWithConverters = function (line) {
        var indentationString = this.getIndentationString();
        for (var _i = 0, ALL_CONVERTERS_1 = converters_1.ALL_CONVERTERS; _i < ALL_CONVERTERS_1.length; _i++) {
            var converter = ALL_CONVERTERS_1[_i];
            var result = converter(line, indentationString, this.state);
            if (result.convertedLine !== line) {
                return result;
            }
        }
        // If no converter matched, return the line as-is
        return {
            convertedLine: line,
            blockType: null
        };
    };
    IGCSEPseudocodeParser.prototype.getIndentationString = function () {
        if (this.state.currentBlockTypes.length === 0) {
            return '';
        }
        // Always use 3 spaces per indentation level
        var blockCount = this.state.currentBlockTypes.length;
        return ' '.repeat(blockCount * constants_1.INDENT_SIZE);
    };
    IGCSEPseudocodeParser.prototype.closeBlocksForIndentation = function (currentIndentation) {
        while (this.state.indentationLevels.length > 1 &&
            currentIndentation < this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
            this.closeCurrentBlock();
        }
    };
    IGCSEPseudocodeParser.prototype.closeCurrentBlock = function () {
        this.state.indentationLevels.pop();
        var blockFrame = this.state.currentBlockTypes.pop();
        // Determine correct indentation for ENDIF
        var indentationString = '';
        var remainingBlocks = this.state.currentBlockTypes.length;
        if (remainingBlocks === 1) {
            indentationString = '   '; // 3 spaces for nested ENDIF
        }
        else if (remainingBlocks === 0) {
            indentationString = ''; // No indentation for outermost ENDIF
        }
        else {
            indentationString = ' '.repeat(remainingBlocks * constants_1.INDENT_SIZE);
        }
        var closeKeyword = this.getCloseKeyword(blockFrame);
        this.state.outputLines.push("".concat(indentationString).concat(closeKeyword));
    };
    IGCSEPseudocodeParser.prototype.getCloseKeyword = function (blockFrame) {
        var closeMap = {
            function: constants_1.KEYWORDS.END_FUNCTION,
            procedure: constants_1.KEYWORDS.END_PROCEDURE,
            class: constants_1.KEYWORDS.END_CLASS,
            if: constants_1.KEYWORDS.END_IF,
            elif: constants_1.KEYWORDS.END_IF,
            else: constants_1.KEYWORDS.END_IF,
            for: blockFrame.ident ? "".concat(constants_1.KEYWORDS.NEXT, " ").concat(blockFrame.ident) : constants_1.KEYWORDS.NEXT,
            while: constants_1.KEYWORDS.END_WHILE,
            repeat: "".concat(constants_1.KEYWORDS.UNTIL, " <condition>"),
        };
        return closeMap[blockFrame.type] || "END ".concat(blockFrame.type.toUpperCase());
    };
    IGCSEPseudocodeParser.prototype.closeRemainingBlocks = function () {
        while (this.state.currentBlockTypes.length > 0) {
            this.closeCurrentBlock();
        }
    };
    return IGCSEPseudocodeParser;
}());
exports.IGCSEPseudocodeParser = IGCSEPseudocodeParser;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGCSEPseudocodeParser = void 0;
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var IGCSEPseudocodeParser = /** @class */ (function () {
    function IGCSEPseudocodeParser() {
        this.state = this.initializeState();
    }
    IGCSEPseudocodeParser.prototype.initializeState = function () {
        return {
            outputLines: [],
            currentBlockTypes: [],
            indentationLevels: [0],
            declarations: new Set(),
            typeFields: new Map()
        };
    };
    IGCSEPseudocodeParser.prototype.parse = function (code) {
        this.state = this.initializeState();
        var lines = code.split('\n');
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            this.processLine(line);
        }
        // Close any remaining blocks
        this.closeRemainingBlocks();
        return this.state.outputLines.join('\n');
    };
    IGCSEPseudocodeParser.prototype.processLine = function (line) {
        var trimmed = line.trim();
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }
        var currentIndentation = (0, utils_1.getLineIndentationLevel)(line);
        // Close blocks if indentation decreased
        this.closeBlocksForIndentation(currentIndentation);
        // Handle different statement types
        if (trimmed.startsWith('if ')) {
            this.handleIf(trimmed);
        }
        else if (trimmed.startsWith('elif ')) {
            this.handleElif(trimmed);
        }
        else if (trimmed === 'else:') {
            this.handleElse();
        }
        else {
            this.handleRegularStatement(trimmed, currentIndentation);
        }
    };
    IGCSEPseudocodeParser.prototype.handleIf = function (line) {
        var condition = this.convertCondition(line.substring(3, line.length - 1));
        var indentString = this.getIndentationString();
        this.state.outputLines.push("".concat(indentString, "IF ").concat(condition, " THEN"));
        this.state.currentBlockTypes.push({ type: constants_1.BLOCK_TYPES.IF });
    };
    IGCSEPseudocodeParser.prototype.handleElif = function (line) {
        // Convert elif to nested ELSE/IF structure
        // First, get the current indentation level (before popping)
        var currentIndentString = this.getIndentationString();
        // Add ELSE at the same level as the current IF
        this.state.outputLines.push('ELSE');
        // Replace current IF block with ELSE
        this.state.currentBlockTypes.pop();
        this.state.currentBlockTypes.push({ type: constants_1.BLOCK_TYPES.ELSE });
        // Add nested IF with proper indentation
        var condition = this.convertCondition(line.substring(5, line.length - 1));
        this.state.outputLines.push("   IF ".concat(condition, " THEN"));
        this.state.currentBlockTypes.push({ type: constants_1.BLOCK_TYPES.IF });
    };
    IGCSEPseudocodeParser.prototype.handleElse = function () {
        // For nested structure, ELSE should be indented
        if (this.state.currentBlockTypes.length > 1) {
            this.state.outputLines.push('   ELSE');
        }
        else {
            this.state.outputLines.push('ELSE');
        }
        // Replace current block with ELSE
        this.state.currentBlockTypes.pop();
        this.state.currentBlockTypes.push({ type: constants_1.BLOCK_TYPES.ELSE });
    };
    IGCSEPseudocodeParser.prototype.handleRegularStatement = function (line, currentIndentation) {
        // Update indentation stack if increased
        if (currentIndentation > this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
            this.state.indentationLevels.push(currentIndentation);
        }
        // Convert the statement
        var convertedLine = this.convertStatement(line);
        var indentString = this.getIndentationString();
        this.state.outputLines.push("".concat(indentString).concat(convertedLine));
    };
    IGCSEPseudocodeParser.prototype.convertStatement = function (line) {
        // Convert print statements
        if (line.startsWith('print(')) {
            var content = line.substring(6, line.length - 1);
            return "OUTPUT ".concat(content);
        }
        return line;
    };
    IGCSEPseudocodeParser.prototype.convertCondition = function (condition) {
        return condition
            .replace(/==/g, '=')
            .replace(/!=/g, '≠')
            .replace(/<=/g, '≤')
            .replace(/>=/g, '≥')
            .replace(/\band\b/g, 'AND')
            .replace(/\bor\b/g, 'OR')
            .replace(/\bnot\b/g, 'NOT');
    };
    IGCSEPseudocodeParser.prototype.getIndentationString = function () {
        // For IGCSE pseudocode:
        // - Main IF content: 3 spaces
        // - Nested IF content: 6 spaces
        // - ELSE at same level as IF: no extra indentation
        var blockCount = this.state.currentBlockTypes.length;
        if (blockCount === 0) {
            return '';
        }
        else if (blockCount === 1) {
            return '   '; // 3 spaces for first level
        }
        else {
            return '      '; // 6 spaces for nested level
        }
    };
    IGCSEPseudocodeParser.prototype.closeBlocksForIndentation = function (currentIndentation) {
        while (this.state.indentationLevels.length > 1 &&
            currentIndentation < this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
            this.closeCurrentBlock();
        }
    };
    IGCSEPseudocodeParser.prototype.closeCurrentBlock = function () {
        if (this.state.currentBlockTypes.length > 0) {
            var blockType = this.state.currentBlockTypes.pop();
            this.state.indentationLevels.pop();
            if ((blockType === null || blockType === void 0 ? void 0 : blockType.type) === constants_1.BLOCK_TYPES.IF) {
                var indentString = this.getIndentationString();
                this.state.outputLines.push("".concat(indentString, "ENDIF"));
            }
        }
    };
    IGCSEPseudocodeParser.prototype.closeRemainingBlocks = function () {
        while (this.state.currentBlockTypes.length > 0) {
            this.closeCurrentBlock();
        }
    };
    return IGCSEPseudocodeParser;
}());
exports.IGCSEPseudocodeParser = IGCSEPseudocodeParser;

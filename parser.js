"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGCSEPseudocodeParser = void 0;
var patterns_1 = require("./patterns");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var converters_1 = require("./converters");
var IGCSEPseudocodeParser = /** @class */ (function () {
    function IGCSEPseudocodeParser() {
    }
    IGCSEPseudocodeParser.prototype.parse = function (sourceCode) {
        var _this = this;
        if (!sourceCode.trim())
            return '';
        this.initializeState();
        var lines = sourceCode.split(/\r?\n/);
        this.collectDeclarations(lines);
        lines.forEach(function (line) { return _this.processLine(line); });
        this.closeRemainingBlocks();
        return this.state.outputLines.join('\n');
    };
    IGCSEPseudocodeParser.prototype.initializeState = function () {
        this.state = {
            indentationLevels: [0],
            currentBlockTypes: [],
            outputLines: [],
            declarations: new Set(),
        };
    };
    IGCSEPseudocodeParser.prototype.collectDeclarations = function (lines) {
        // For IGCSE, we don't pre-declare variables
        // Variables are declared inline when first assigned
        // Pre-scan for dictionary fields to ensure complete TYPE definitions
        this.prescanDictionaryFields(lines);
    };
    IGCSEPseudocodeParser.prototype.prescanDictionaryFields = function (lines) {
        var _this = this;
        if (!this.state.typeFields) {
            this.state.typeFields = new Map();
        }
        lines.forEach(function (line) {
            // Check for dictionary literal
            var dictLiteralMatch = line.match(patterns_1.PATTERNS.DICTIONARY_LITERAL);
            if (dictLiteralMatch) {
                var variable_1 = dictLiteralMatch[1], content = dictLiteralMatch[2];
                if (!_this.state.typeFields.has(variable_1)) {
                    _this.state.typeFields.set(variable_1, new Set());
                }
                var pairs = content.split(',').map(function (pair) {
                    var key = pair.split(':').map(function (s) { return s.trim(); })[0];
                    return key.replace(/["']/g, '');
                });
                pairs.forEach(function (key) {
                    _this.state.typeFields.get(variable_1).add(key);
                });
            }
            // Check for dictionary assignment
            var dictAssignMatch = line.match(patterns_1.PATTERNS.DICTIONARY_ASSIGNMENT);
            if (dictAssignMatch) {
                var variable = dictAssignMatch[1], key = dictAssignMatch[2];
                var cleanKey = key.replace(/["']/g, '');
                if (!_this.state.typeFields.has(variable)) {
                    _this.state.typeFields.set(variable, new Set());
                }
                _this.state.typeFields.get(variable).add(cleanKey);
            }
        });
    };
    IGCSEPseudocodeParser.prototype.processLine = function (line) {
        var trimmed = line.trim();
        // Handle empty lines
        if (!trimmed) {
            this.state.outputLines.push('');
            return;
        }
        // Handle comments
        if (trimmed.startsWith('#')) {
            var leadingWhitespace = (0, utils_1.getLeadingWhitespace)(line);
            this.state.outputLines.push("".concat(leadingWhitespace, "// ").concat(trimmed.slice(1).trim()));
            return;
        }
        var currentIndentation = (0, utils_1.getLineIndentationLevel)(line);
        // Close blocks if indentation decreased (but handle else and elif specially)
        if (trimmed === 'else:') {
            // For else, don't close blocks based on indentation - just replace IF/ELIF with ELSE
            var lastBlock = this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1];
            if (lastBlock && (lastBlock.type === constants_1.BLOCK_TYPES.IF || lastBlock.type === constants_1.BLOCK_TYPES.ELIF)) {
                // Replace the IF/ELIF block with ELSE block at the same level
                this.state.currentBlockTypes.pop();
            }
        }
        else if (trimmed.startsWith('elif ')) {
            // For elif, we need to close the current IF/ELIF block and start a new nested structure
            var lastBlock = this.state.currentBlockTypes[this.state.currentBlockTypes.length - 1];
            if (lastBlock && (lastBlock.type === constants_1.BLOCK_TYPES.IF || lastBlock.type === constants_1.BLOCK_TYPES.ELIF)) {
                // Add ELSE at the same level as the original IF (no indentation)
                this.state.outputLines.push(constants_1.KEYWORDS.ELSE);
                // Replace the current block with ELSE
                this.state.currentBlockTypes.pop();
                this.state.currentBlockTypes.push({ type: constants_1.BLOCK_TYPES.ELSE });
                // Set indentation for the nested IF to be 3 spaces
                this.state.indentationLevels[this.state.indentationLevels.length - 1] = constants_1.INDENT_SIZE;
            }
        }
        else {
            // Normal indentation handling for non-else/elif statements
            this.closeBlocksForIndentation(currentIndentation);
        }
        // Update indentation stack if increased
        if (currentIndentation > this.state.indentationLevels[this.state.indentationLevels.length - 1]) {
            this.state.indentationLevels.push(currentIndentation);
        }
        var indentationString = ' '.repeat((this.state.indentationLevels.length - 1) * constants_1.INDENT_SIZE);
        var result = this.convertLine(trimmed, indentationString);
        this.state.outputLines.push(result.convertedLine);
        if (result.blockType) {
            this.state.currentBlockTypes.push(result.blockType);
        }
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
        var indentationString = ' '.repeat((this.state.indentationLevels.length - 1) * constants_1.INDENT_SIZE);
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
    IGCSEPseudocodeParser.prototype.convertLine = function (line, indentation) {
        for (var _i = 0, ALL_CONVERTERS_1 = converters_1.ALL_CONVERTERS; _i < ALL_CONVERTERS_1.length; _i++) {
            var converter = ALL_CONVERTERS_1[_i];
            var result = converter(line, indentation, this.state);
            if (result.convertedLine !== line) {
                return result;
            }
        }
        // Fallback for unrecognized patterns
        return {
            convertedLine: "".concat(indentation, "// TODO: ").concat(line),
            blockType: null,
        };
    };
    return IGCSEPseudocodeParser;
}());
exports.IGCSEPseudocodeParser = IGCSEPseudocodeParser;

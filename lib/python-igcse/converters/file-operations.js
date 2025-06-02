"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileOperationConverters = exports.handleFileClose = exports.convertSimpleOpen = exports.convertFileIteration = exports.convertFileRead = exports.convertFileWrite = exports.convertWithOpen = void 0;
/**
 * Convert Python 'with open()' statements to IGCSE pseudocode file operations
 */
const convertWithOpen = (line, indentation, state) => {
    // Match: with open("filename", "mode") as variable:
    const withOpenMatch = line.match(/^with\s+open\s*\(\s*["']([^"']+)["']\s*,\s*["']([rwa])["']\s*\)\s+as\s+(\w+)\s*:/);
    if (withOpenMatch) {
        const [, filename, mode, variable] = withOpenMatch;
        const modeMap = {
            'r': 'READ',
            'w': 'WRITE',
            'a': 'APPEND'
        };
        const pseudocodeMode = modeMap[mode] || 'READ';
        // Store file context for later use
        if (!state.openFiles) {
            state.openFiles = new Set();
        }
        state.openFiles.add(filename);
        state.currentFile = filename;
        state.currentFileMode = pseudocodeMode;
        return {
            convertedLine: `${indentation}OPENFILE "${filename}" FOR ${pseudocodeMode}`,
            blockType: { type: 'with' }
        };
    }
    return null;
};
exports.convertWithOpen = convertWithOpen;
/**
 * Convert Python file.write() to IGCSE WRITEFILE
 */
const convertFileWrite = (line, indentation, state) => {
    // Match: file.write(content) or variable.write(content)
    const writeMatch = line.match(/^(\w+)\.write\s*\((.+)\)/);
    if (writeMatch) {
        const [, variable, content] = writeMatch;
        // Clean up the content - remove quotes if it's a string literal
        let cleanContent = content.trim();
        // Handle str() conversion
        if (cleanContent.startsWith('str(') && cleanContent.endsWith(')')) {
            cleanContent = cleanContent.slice(4, -1);
        }
        // Use current file from context or default
        const filename = state.currentFile || 'file';
        return {
            convertedLine: `${indentation}WRITEFILE "${filename}", ${cleanContent}`,
            blockType: null
        };
    }
    return null;
};
exports.convertFileWrite = convertFileWrite;
/**
 * Convert Python file.read() to IGCSE READFILE
 */
const convertFileRead = (line, indentation, state) => {
    // Match: variable = file.read()
    const readMatch = line.match(/^(\w+)\s*=\s*(\w+)\.read\s*\(\)/);
    if (readMatch) {
        const [, variable, fileVar] = readMatch;
        // Use current file from context or default
        const filename = state.currentFile || 'file';
        return {
            convertedLine: `${indentation}READFILE "${filename}", ${variable}`,
            blockType: null
        };
    }
    return null;
};
exports.convertFileRead = convertFileRead;
/**
 * Convert Python 'for line in file:' to IGCSE WHILE NOT EOF pattern
 */
const convertFileIteration = (line, indentation, state) => {
    // Match: for line in file:
    const iterMatch = line.match(/^for\s+(\w+)\s+in\s+(\w+)\s*:/);
    if (iterMatch) {
        const [, variable, fileVar] = iterMatch;
        // Use current file from context or default
        const filename = state.currentFile || 'file';
        // Store the loop variable for later use
        state.fileLoopVariable = variable;
        return {
            convertedLine: `${indentation}WHILE NOT EOF("${filename}")`,
            blockType: { type: 'file_while' },
            additionalLines: [`${indentation}   READFILE "${filename}", ${variable}`]
        };
    }
    return null;
};
exports.convertFileIteration = convertFileIteration;
/**
 * Convert simple open() statements to IGCSE OPENFILE
 */
const convertSimpleOpen = (line, indentation, state) => {
    // Match: file = open("filename")
    const openMatch = line.match(/^(\w+)\s*=\s*open\s*\(\s*["']([^"']+)["']\s*\)/);
    if (openMatch) {
        const [, variable, filename] = openMatch;
        // Store file context
        if (!state.openFiles) {
            state.openFiles = new Set();
        }
        state.openFiles.add(filename);
        state.currentFile = filename;
        state.currentFileMode = 'READ'; // Default mode
        return {
            convertedLine: `${indentation}OPENFILE "${filename}" FOR READ`,
            blockType: null
        };
    }
    return null;
};
exports.convertSimpleOpen = convertSimpleOpen;
/**
 * Handle end of with block - add CLOSEFILE
 */
const handleFileClose = (line, indentation, state) => {
    // This is a special handler that should be called when exiting a with block
    // or at the end of file operations
    if (state.currentFile && state.needsClose) {
        const filename = state.currentFile;
        state.currentFile = null;
        state.needsClose = false;
        return {
            convertedLine: `${indentation}CLOSEFILE "${filename}"`,
            blockType: null
        };
    }
    return null;
};
exports.handleFileClose = handleFileClose;
exports.fileOperationConverters = {
    convertWithOpen: exports.convertWithOpen,
    convertFileWrite: exports.convertFileWrite,
    convertFileRead: exports.convertFileRead,
    convertFileIteration: exports.convertFileIteration,
    convertSimpleOpen: exports.convertSimpleOpen,
    handleFileClose: exports.handleFileClose
};

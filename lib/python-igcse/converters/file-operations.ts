import { ConverterFunction, ParseResult, ParserState } from '../types';

/**
 * Convert Python 'with open()' statements to IGCSE pseudocode file operations
 */
export const convertWithOpen: ConverterFunction = (line: string, indentation: string, state: ParserState): ParseResult | null => {
  // Match: with open("filename", "mode") as variable:
  const withOpenMatch = line.match(/^with\s+open\s*\(\s*["']([^"']+)["']\s*,\s*["']([rwa])["']\s*\)\s+as\s+(\w+)\s*:/);
  
  if (withOpenMatch) {
    const [, filename, mode, variable] = withOpenMatch;
    const modeMap: { [key: string]: string } = {
      'r': 'READ',
      'w': 'WRITE',
      'a': 'APPEND'
    };
    
    const pseudocodeMode = modeMap[mode] || 'READ';
    
    // Store file context for later use
    if (!(state as any).openFiles) {
      (state as any).openFiles = new Set();
    }
    (state as any).openFiles.add(filename);
    (state as any).currentFile = filename;
    (state as any).currentFileMode = pseudocodeMode;
    
    return {
      convertedLine: `${indentation}OPENFILE "${filename}" FOR ${pseudocodeMode}`,
      blockType: { type: 'with' as any }
    };
  }
  
  return null;
};

/**
 * Convert Python file.write() to IGCSE WRITEFILE
 */
export const convertFileWrite: ConverterFunction = (line: string, indentation: string, state: ParserState): ParseResult | null => {
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
    const filename = (state as any).currentFile || 'file';
    
    return {
      convertedLine: `${indentation}WRITEFILE "${filename}", ${cleanContent}`,
      blockType: null
    };
  }
  
  return null;
};

/**
 * Convert Python file.read() to IGCSE READFILE
 */
export const convertFileRead: ConverterFunction = (line: string, indentation: string, state: ParserState): ParseResult | null => {
  // Match: variable = file.read()
  const readMatch = line.match(/^(\w+)\s*=\s*(\w+)\.read\s*\(\)/);
  
  if (readMatch) {
    const [, variable, fileVar] = readMatch;
    
    // Use current file from context or default
    const filename = (state as any).currentFile || 'file';
    
    return {
      convertedLine: `${indentation}READFILE "${filename}", ${variable}`,
      blockType: null
    };
  }
  
  return null;
};

/**
 * Convert Python 'for line in file:' to IGCSE WHILE NOT EOF pattern
 */
export const convertFileIteration: ConverterFunction = (line: string, indentation: string, state: ParserState): ParseResult | null => {
  // Match: for line in file:
  const iterMatch = line.match(/^for\s+(\w+)\s+in\s+(\w+)\s*:/);
  
  if (iterMatch) {
    const [, variable, fileVar] = iterMatch;
    
    // Use current file from context or default
    const filename = (state as any).currentFile || 'file';
    
    // Store the loop variable for later use
    (state as any).fileLoopVariable = variable;
    
    return {
      convertedLine: `${indentation}WHILE NOT EOF("${filename}")`,
      blockType: { type: 'file_while' as any },
      additionalLines: [`${indentation}   READFILE "${filename}", ${variable}`]
    };
  }
  
  return null;
};

/**
 * Convert simple open() statements to IGCSE OPENFILE
 */
export const convertSimpleOpen: ConverterFunction = (line: string, indentation: string, state: ParserState): ParseResult | null => {
  // Match: file = open("filename")
  const openMatch = line.match(/^(\w+)\s*=\s*open\s*\(\s*["']([^"']+)["']\s*\)/);
  
  if (openMatch) {
    const [, variable, filename] = openMatch;
    
    // Store file context
    if (!(state as any).openFiles) {
      (state as any).openFiles = new Set();
    }
    (state as any).openFiles.add(filename);
    (state as any).currentFile = filename;
    (state as any).currentFileMode = 'READ'; // Default mode
    
    return {
      convertedLine: `${indentation}OPENFILE "${filename}" FOR READ`,
      blockType: null
    };
  }
  
  return null;
};

/**
 * Handle end of with block - add CLOSEFILE
 */
export const handleFileClose: ConverterFunction = (line: string, indentation: string, state: ParserState): ParseResult | null => {
  // This is a special handler that should be called when exiting a with block
  // or at the end of file operations
  if ((state as any).currentFile && (state as any).needsClose) {
    const filename = (state as any).currentFile;
    (state as any).currentFile = null;
    (state as any).needsClose = false;
    return {
      convertedLine: `${indentation}CLOSEFILE "${filename}"`,
      blockType: null
    };
  }
  
  return null;
};

export const fileOperationConverters = {
  convertWithOpen,
  convertFileWrite,
  convertFileRead,
  convertFileIteration,
  convertSimpleOpen,
  handleFileClose
};
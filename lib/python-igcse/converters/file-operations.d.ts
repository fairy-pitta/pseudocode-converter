import { ConverterFunction } from '../types';
/**
 * Convert Python 'with open()' statements to IGCSE pseudocode file operations
 */
export declare const convertWithOpen: ConverterFunction;
/**
 * Convert Python file.write() to IGCSE WRITEFILE
 */
export declare const convertFileWrite: ConverterFunction;
/**
 * Convert Python file.read() to IGCSE READFILE
 */
export declare const convertFileRead: ConverterFunction;
/**
 * Convert Python 'for line in file:' to IGCSE WHILE NOT EOF pattern
 */
export declare const convertFileIteration: ConverterFunction;
/**
 * Convert simple open() statements to IGCSE OPENFILE
 */
export declare const convertSimpleOpen: ConverterFunction;
/**
 * Handle end of with block - add CLOSEFILE
 */
export declare const handleFileClose: ConverterFunction;
export declare const fileOperationConverters: {
    convertWithOpen: ConverterFunction;
    convertFileWrite: ConverterFunction;
    convertFileRead: ConverterFunction;
    convertFileIteration: ConverterFunction;
    convertSimpleOpen: ConverterFunction;
    handleFileClose: ConverterFunction;
};

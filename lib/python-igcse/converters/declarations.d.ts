import { ParseResult, ParserState } from '../types';
export declare const convertFunctionDef: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertClassDef: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertConstructorDef: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const declarationConverters: {
    convertFunctionDef: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertClassDef: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertConstructorDef: (line: string, indentation: string, state: ParserState) => ParseResult;
};

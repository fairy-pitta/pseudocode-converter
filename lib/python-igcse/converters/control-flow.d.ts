import { ParserState, ParseResult } from '../types';
export declare const convertIf: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertElif: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertElse: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertForRange: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertForCollection: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertWhile: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertBreak: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertContinue: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const controlFlowConverters: {
    convertIf: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertElif: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertElse: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertForRange: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertForCollection: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertWhile: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertBreak: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertContinue: (line: string, indentation: string, state: ParserState) => ParseResult;
};

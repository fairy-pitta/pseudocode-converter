import { ParseResult, ParserState } from '../types';
export declare const convertObjectInstantiation: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertMethodCall: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertMethodAssignment: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertSelfAssignment: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const objectOrientedConverters: {
    convertObjectInstantiation: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertMethodCall: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertMethodAssignment: (line: string, indentation: string, state: ParserState) => ParseResult;
    convertSelfAssignment: (line: string, indentation: string, state: ParserState) => ParseResult;
};

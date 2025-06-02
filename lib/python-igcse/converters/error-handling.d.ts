import { ParseResult, ParserState } from '../types';
export declare const convertTry: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertExcept: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertFinally: (line: string, indentation: string, state: ParserState) => ParseResult;

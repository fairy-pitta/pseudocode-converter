import { ParseResult, ParserState } from '../types';
export declare const convertListDeclaration: (line: string, indentation: string, state: ParserState) => ParseResult | null;
export declare const convertListAccess: (line: string, indentation: string, state: ParserState) => ParseResult;
export declare const convertListAssignment: (line: string, indentation: string, state: ParserState) => ParseResult;

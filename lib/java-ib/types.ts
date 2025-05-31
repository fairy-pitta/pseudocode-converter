export type Block =
  | "function"
  | "procedure"
  | "class"
  | "if"
  | "elif"
  | "else"
  | "for"
  | "while"
  | "repeat"
  | "try"
  | "catch"
  | "finally";

export interface ParseResult {
  code: string;
  block: Block | null;
  changed: boolean;
}

export interface Frame {
  type: Block;
  ident?: string;
}

export interface St {
  ind: number[];
  stack: Frame[];
  out: string[];
}

export type UnsupportedSyntaxCallback = (
  kind: string,
  text: string,
  line: number,
) => void;
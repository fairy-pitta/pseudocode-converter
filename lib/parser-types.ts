export interface UnsupportedSyntaxCallback {
  (syntaxType: string, originalCode: string, lineNumber?: number): void;
}

export interface ParserOptions {
  onUnsupportedSyntax?: UnsupportedSyntaxCallback;
}
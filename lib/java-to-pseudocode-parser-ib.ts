import { ParseResult, St, Frame, Block, UnsupportedSyntaxCallback } from './java-ib/types';
import { IND } from './java-ib/constants';
import { leadingWhitespace, extractLoopVar } from './java-ib/utils';
import { classConverter } from './java-ib/converters/class';
import { methodConverter } from './java-ib/converters/method';
import { controlFlowConverters } from './java-ib/converters/control-flow';
import { statementConverters } from './java-ib/converters/statements';
import { declarationConverters } from './java-ib/converters/declarations';
import { expressionConverters } from './java-ib/converters/expressions';

export class Java2IB {
  private st!: St;
  private onUnsupportedSyntax?: UnsupportedSyntaxCallback;
  private currentLineNumber = 0;

  constructor(opts?: { onUnsupportedSyntax?: UnsupportedSyntaxCallback }) {
    this.onUnsupportedSyntax = opts?.onUnsupportedSyntax;
  }

  parse(src: string): string {
    if (!src.trim()) return "";
    this.st = { ind: [0], stack: [], out: [] };

    const lines = src.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      this.currentLineNumber = i + 1;
      const nextTrimmed = i + 1 < lines.length ? lines[i + 1].trim() : "";
      this.processLine(lines[i], nextTrimmed);
    }

    while (this.st.stack.length) this.endBlock();
    return this.st.out.join("\n");
  }

  private processLine(raw: string, nextTrimmed: string = ""): void {
    const trimmed = raw.trim();
    if (!trimmed) { this.st.out.push(""); return; }
    if (trimmed.startsWith("//")) { this.st.out.push(raw); return; }

    const ws = leadingWhitespace(raw);
    const curIndent = ws.length;
    
    // Handle closing brace with lookahead for else if/else
    if (trimmed === "}") {
      const isNextElseIf = nextTrimmed.match(/^else\s+if\s*\((.+)\)\s*\{/);
      const isNextElse = nextTrimmed.match(/^else\s*\{/);
      
      if (isNextElseIf || isNextElse) {
        // Next line is else if/else, so just pop the if/elif block without END IF
        const lastBlock = this.st.stack.at(-1);
        if (lastBlock && (lastBlock.type === 'if' || lastBlock.type === 'elif')) {
          this.st.stack.pop();
          this.st.ind.pop();
        }
      } else {
        // Normal block ending
        this.endBlock();
      }
      return;
    }
    
    // Handle else if and else specially
    const isElseIf = trimmed.match(/^else\s+if\s*\((.+)\)\s*\{/);
    const isElse = trimmed.match(/^else\s*\{/);
    
    if (isElseIf || isElse) {
      // Pop the previous if/elif block without calling endBlock
      const lastBlock = this.st.stack.at(-1);
      if (lastBlock && (lastBlock.type === 'if' || lastBlock.type === 'elif')) {
        this.st.stack.pop();
      }
      
      // Adjust indent to match current line's indentation
      while (this.st.ind.length > 1 && curIndent < this.st.ind.at(-1)!) {
        this.st.ind.pop();
      }
      
      // Use the current line's indentation for else if/else
      const pad = " ".repeat(curIndent);
      const { code, block } = this.dispatch(trimmed, pad);
      if (code) this.st.out.push(code);
      if (block) {
        const ident = block === 'for' ? extractLoopVar(trimmed) : undefined;
        this.st.stack.push({ type: block, ident });
      }
      return;
    }
    
    // Normal processing for other lines
    while (this.st.ind.length > 1 && curIndent < this.st.ind.at(-1)!) this.endBlock();
    
    if (curIndent > this.st.ind.at(-1)!) this.st.ind.push(curIndent);
    const pad = " ".repeat((this.st.ind.length - 1) * IND);

    const { code, block } = this.dispatch(trimmed, pad);
    if (code) this.st.out.push(code);
    if (block) {
      const ident = block === 'for' ? extractLoopVar(trimmed) : undefined;
      this.st.stack.push({ type: block, ident });
    }
  }

  private dispatch(s: string, pad: string): ParseResult {
    const converters = [
      classConverter,
      methodConverter,
      ...Object.values(controlFlowConverters),
      ...Object.values(statementConverters),
      ...Object.values(declarationConverters),
      ...Object.values(expressionConverters),
    ];

    for (const converter of converters) {
      const result = converter(s, pad);
      if (result.changed) return result;
    }

    if (s === '{' || s === '}') return { code: '', block: null, changed: true };
    
    this.onUnsupportedSyntax?.('Java', s, this.currentLineNumber);
    return { code: `${pad}// Unsupported: ${s}`, block: null, changed: true };
  }

  private endBlock(): void {
    const f = this.st.stack.at(-1);
    if (!f) return;

    this.st.ind.pop();
    this.st.stack.pop();

    const pad = " ".repeat((this.st.ind.length - 1) * IND);
    const ends: Record<Block, string> = {
      function: "END FUNCTION",
      procedure: "END PROCEDURE",
      class: "END CLASS",
      if: "END IF",
      elif: "", // Don't output END IF for elif - will be handled by the final if/else
      else: "END IF", // Output END IF for else as it's the end of the chain
      for: "END FOR",
      while: "END WHILE",
      repeat: "END REPEAT",
      try: "END TRY",
      catch: "END TRY",
      finally: "END TRY",
    };

    const endText = ends[f.type];
    if (endText) {
      this.st.out.push(pad + endText);
    }
  }
}
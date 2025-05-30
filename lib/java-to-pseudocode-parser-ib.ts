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
  changed: boolean; // true if this converter handled the line
}

interface Frame {
  type: Block;
  ident?: string;
}

interface St {
  ind: number[];       // indentation stack
  stack: Frame[];      // open blocks
  out: string[];       // output lines
}

const IND = 4,
  ARW = "←",
  OP = {
    EQ: "=",
    NE: "≠",
    LE: "≤",
    GE: "≥",
    AND: "AND",
    OR: "OR",
    NOT: "NOT",
    DIV: "DIV",
    MOD: "MOD",
    POW: "^",
  } as const,
  CMP = [
    ["+=", "+"],
    ["-=", "-"],
    ["*=", "*"],
    ["/=", "/"],
    ["%=" , OP.MOD],
  ] as const;

type UnsupportedSyntaxCallback = (
  kind: string,
  text: string,
  line: number,
) => void;

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

    src.split(/\r?\n/).forEach((raw, idx) => {
      this.currentLineNumber = idx + 1;
      this.processLine(raw);
    });

    // close remaining
    while (this.st.stack.length) this.endBlock();

    return this.st.out.join("\n");
  }

  private processLine(raw: string): void {
    const trimmed = raw.trim();
    if (!trimmed) { this.st.out.push(""); return; }
    if (trimmed.startsWith("//")) { this.st.out.push(raw); return; }

    const ws = this.leadingWhitespace(raw);
    const curIndent = ws.length;
    while (this.st.ind.length > 1 && curIndent < this.st.ind.at(-1)!) this.endBlock();
    if (curIndent > this.st.ind.at(-1)!) this.st.ind.push(curIndent);
    const pad = " ".repeat((this.st.ind.length - 1) * IND);

    const { code, block } = this.dispatch(trimmed, pad);
    if (code) this.st.out.push(code);
    if (block) {
      const ident = block === 'for' ? this.extractLoopVar(trimmed) : undefined;
      this.st.stack.push({ type: block, ident });
    }
  }

  private endBlock(): void {
    this.st.ind.pop();
    const f = this.st.stack.pop();
    if (!f) return;
    const pad = " ".repeat((this.st.ind.length - 1) * IND);
    const ends: Record<Block,string> = {
      function: "END FUNCTION",
      procedure: "END PROCEDURE",
      class: "END CLASS",
      if: "END IF",
      elif: "END IF",
      else: "END IF",
      for: "END FOR",
      while: "END WHILE",
      repeat: "END REPEAT",
      try: "END TRY",
      catch: "END TRY",
      finally: "END TRY",
    };
    this.st.out.push(pad + ends[f.type]);
  }

  private leadingWhitespace(s: string): string {
    return s.match(/^(\s*)/)?.[1] ?? "";
  }

  private extractLoopVar(s: string): string {
    const m = s.match(/for\s*\(.*?(\w+)\+\+/);
    return m ? m[1] : '';
  }

  private cond(expr: string): string {
    return expr
      .replace(/==/g, OP.EQ)
      .replace(/!=/g, OP.NE)
      .replace(/<=/g, OP.LE)
      .replace(/>=/g, OP.GE)
      .replace(/&&/g, ` ${OP.AND} `)
      .replace(/\|\|/g, ` ${OP.OR} `)
      .replace(/!([A-Za-z_\(])/g, `${OP.NOT} $1`)
      .replace(/\btrue\b/gi, "TRUE")
      .replace(/\bfalse\b/gi, "FALSE")
      .replace(/Math\.pow\(([^,]+),\s*([^\)]+)\)/g, "$1 ^ $2");
  }

  private dispatch(s: string, pad: string): ParseResult {
    const convs = [
      this.cls,
      this.methodDecl,
      this.ifBlock,
      this.elifBlock,
      this.elseBlock,
      this.forCount,
      this.forEach,
      this.whileBlock,
      this.doWhileBlock,
      this.tryBlock,
      this.catchBlock,
      this.finallyBlock,
      this.returnStmt,
      this.printStmt,
      this.inputStmt,
      this.constDecl,
      this.varDecl,
      this.arrayDecl,
      this.mathExpr,
      this.compAssign,
      this.assignStmt,
    ] as const;
    for (const fn of convs) {
      const res = fn.call(this, s, pad);
      if (res.changed) return res;
    }
    if (s === '{' || s === '}') return { code:'', block:null, changed:true };
    this.onUnsupportedSyntax?.('Java', s, this.currentLineNumber);
    return { code: `${pad}// Unsupported: ${s}`, block:null, changed:true };
  }

  private ok(code:string, block:Block|null):ParseResult { return { code, block, changed:true }}
  private ng():ParseResult { return { code:'', block:null, changed:false }}

  private cls(s:string, i:string):ParseResult {
    const m = s.match(/^(?:public\s+)?class\s+(\w+)/);
    return m ? this.ok(`${i}CLASS ${m[1]}`, 'class') : this.ng();
  }

  private methodDecl(s:string,i:string):ParseResult {
    const m = s.match(/^(?:public|private)?\s*(static\s+)?(void|int|double|boolean|String|float|long|byte|char)\s+(\w+)\(([^)]*)\)\s*\{/);
    if (!m) return this.ng();
    const isVoid = m[2] === 'void';
    const keyword = isVoid ? 'PROCEDURE' : 'FUNCTION';
    return this.ok(`${i}${keyword} ${m[3]}(${m[4]})`, isVoid ? 'procedure' : 'function');
  }

  private ifBlock(s:string,i:string):ParseResult {
    const m = s.match(/^if\s*\((.+)\)\s*\{/);
    return m ? this.ok(`${i}IF ${this.cond(m[1])} THEN`, 'if') : this.ng();
  }
  private elifBlock(s:string,i:string):ParseResult {
    const m = s.match(/^else\s+if\s*\((.+)\)\s*\{/);
    return m ? this.ok(`${i}ELSE IF ${this.cond(m[1])} THEN`, 'elif') : this.ng();
  }
  private elseBlock(s:string,i:string):ParseResult {
    return /^else\s*\{/.test(s) ? this.ok(`${i}ELSE`, 'else') : this.ng();
  }

  private forCount(s:string,i:string):ParseResult {
    const m = s.match(/^for\s*\((?:int|long|byte)\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*(<|<=)\s*(\d+)\s*;\s*\1\+\+\)\s*\{/);
    if (!m) return this.ng();
    const start = +m[2];
    const end = m[3]==='<=' ? +m[4] : +m[4]-1;
    return this.ok(`${i}FOR ${m[1]} FROM ${start} TO ${end} DO`, 'for');
  }

  private forEach(s:string,i:string):ParseResult {
    const m = s.match(/^for\s*\((\w+)\s*:\s*(\w+)\)\s*\{/);
    return m ? this.ok(`${i}FOR EACH ${m[1]} IN ${m[2]} DO`, 'for') : this.ng();
  }

  private whileBlock(s:string,i:string):ParseResult {
    const m = s.match(/^while\s*\((.+)\)\s*\{/);
    return m ? this.ok(`${i}WHILE ${this.cond(m[1])} DO`, 'while') : this.ng();
  }

  private doWhileBlock(s:string,i:string):ParseResult {
    return /^do\s*\{/.test(s) ? this.ok(`${i}REPEAT`, 'repeat') : this.ng();
  }

  private tryBlock(s:string,i:string):ParseResult {
    return /^try\s*\{/.test(s)? this.ok(`${i}TRY`, 'try') : this.ng();
  }

  private catchBlock(s:string,i:string):ParseResult {
    const m = s.match(/^catch\s*\(([^\s]+)\s+(\w+)\)\s*\{/);
    return m ? this.ok(`${i}CATCH ${m[2]}`, 'catch') : this.ng();
  }

  private finallyBlock(s:string,i:string):ParseResult {
    return /^finally\s*\{/.test(s)? this.ok(`${i}FINALLY`, 'finally') : this.ng();
  }

  private returnStmt(s:string,i:string):ParseResult {
    const m = s.match(/^return\s*(.*);/);
    return m ? this.ok(`${i}RETURN${m[1]? ' '+m[1] : ''}`, null) : this.ng();
  }

  private printStmt(s:string,i:string):ParseResult {
    const m = s.match(/^System\.out\.(?:println|print)\((.*?)\);?$/);
    return m ? this.ok(`${i}OUTPUT ${m[1]}`, null) : this.ng();
  }

  private inputStmt(s:string,i:string):ParseResult {
    const m = s.match(/^(\w+)\s*=\s*(\w+)\.(nextInt|nextDouble|nextLine|nextBoolean|nextFloat|nextLong|nextByte)\(\);/);
    if (!m) return this.ng();
    return this.ok(`${i}INPUT ${m[1]}`, null);
  }

  private constDecl(s:string,i:string):ParseResult {
    const m = s.match(/^final\s+(?:int|double|boolean|String|float|char|long|byte)\s+(\w+)\s*=\s*([^;]+);/);
    return m ? this.ok(`${i}CONSTANT ${m[1]} ${ARW} ${m[2]}`, null) : this.ng();
  }

  private varDecl(s:string,i:string):ParseResult {
    const m = s.match(/^(?:int|double|boolean|String|float|char|long|byte)\s+(\w+)(?:\s*=\s*([^;]+))?;/);
    return m ? this.ok(`${i}DECLAR E ${m[1]}${m[2]? ` ${ARW} ${m[2]}` : ''}`, null) : this.ng();
  }

  private arrayDecl(s:string,i:string):ParseResult {
    const lit = s.match(/^([\w<>]+)\[\]\s+(\w+)\s*=\s*\{([^}]*)\};/);
    if (lit) return this.ok(`${i}DECLARE ${lit[2]} ${ARW} [${lit[3]}]`, null);
    const sized = s.match(/^([\w<>]+)\[\]\s+(\w+)\s*=\s*new\s+\1\[(\d+)\];/);
    if (sized) return this.ok(`${i}DECLARE ${sized[2]} : ARRAY[${sized[3]}] OF ${sized[1].toUpperCase()}`, null);
    return this.ng();
  }

  private mathExpr(s:string,i:string):ParseResult {
    let r = s
      .replace(/Math\.sqrt\(([^)]+)\)/g, "√($1)")
      .replace(/Math\.abs\(([^)]+)\)/g, "ABS($1)")
      .replace(/Math\.max\(([^,]+),\s*([^)]+)\)/g, "MAX($1, $2)")
      .replace(/Math\.min\(([^,]+),\s*([^)]+)\)/g, "MIN($1, $2)")
      .replace(/Math\.pow\(([^,]+),\s*([^\)]+)\)/g, "$1 ^ $2");
    if (r === s) return this.ng();
    const m = r.match(/^(\w+)\s*=\s*(.+);/);
    return m ? this.ok(`${i}${m[1]} ${ARW} ${m[2]}`, null) : this.ok(`${i}${r}`, null);
  }

  private compAssign(s:string,i:string):ParseResult {
    for (const [op, sym] of CMP) if (s.includes(op)) {
      const [l,r] = s.split(op);
      return this.ok(`${i}${l.trim()} ${ARW} ${l.trim()} ${sym} ${r.replace(/;$/,'').trim()}`, null);
    }
    return this.ng();
  }

  private assignStmt(s:string,i:string):ParseResult {
    const m = s.match(/^([A-Za-z_]\w*)\s*=\s*([^=].*);/);
    return m ? this.ok(`${i}${m[1]} ${ARW} ${m[2].trim()}`, null) : this.ng();
  }
}
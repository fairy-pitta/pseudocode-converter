export type Block =
  | "function"
  | "procedure"
  | "class"
  | "if"
  | "elif"
  | "else"
  | "for"
  | "while"
  | "do"
  | "try"
  | "catch"
  | "finally";

export interface ParseResult {
  converted: string;
  block: Frame | null;
  changed: boolean;
}

interface Frame {
  type: Block;
  ident?: string;
}

interface State {
  ind: number[];
  stack: Frame[];
  out: string[];
  decl: Set<string>;
}

const TAB = 3,
  ARW = "←",
  OP = {
    EQ: "=",
    NE: "<>",
    LE: "<=",
    GE: ">=",
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
    ["* =", "*"],
    ["/=", "/"],
    ["%=", OP.MOD],
  ] as const;

type UnsupportedSyntaxCallback = (
  kind: string,
  text: string,
  line: number,
) => void;

export class Java2IG {
  private st!: State;
  private onUnsupportedSyntax?: UnsupportedSyntaxCallback;
  private currentLineNumber = 0;

  constructor(opts?: { onUnsupportedSyntax?: UnsupportedSyntaxCallback }) {
    this.onUnsupportedSyntax = opts?.onUnsupportedSyntax;
  }

  parse(src: string): string {
    if (!src.trim()) return "";
    this.init();

    const lines = src.split(/\r?\n/);
    this.collect(lines);

    lines.forEach((l, idx) => {
      this.currentLineNumber = idx + 1;
      this.handle(l);
    });

    this.closeAll();
    return this.st.out.join("\n");
  }

  private init() {
    this.st = { ind: [0], stack: [], out: [], decl: new Set() };
  }

  private collect(lines: string[]): void {
    lines.forEach((l) => {
      const t = l.trim();
      const base = /^(?:final\s+)?(int|double|String|boolean|char|long|byte|float|short)/;

      const single = t.match(new RegExp(`${base.source}\s+([A-Za-z_]\\w*)`));
      if (single) this.st.decl.add(single[2]);

      const arr = t.match(
        new RegExp(`${base.source}\[\]\s+([A-Za-z_]\\w*)`),
      );
      if (arr) this.st.decl.add(arr[2]);

      const multi = t.match(
        new RegExp(
          `${base.source}\s+([A-Za-z_]\\w*(?:\\s*,\\s*[A-Za-z_]\\w*)*)`,
        ),
      );
      if (multi)
        multi[2]
          .split(",")
          .forEach((v) => this.st.decl.add(v.trim()));

      const forVar = t.match(/for\s*\(.*?\s+([A-Za-z_]\\w*)/);
      if (forVar) this.st.decl.add(forVar[1]);
    });

    if (this.st.decl.size) {
      this.st.out.push("// DECLARE (default INTEGER)");
      [...this.st.decl]
        .sort()
        .forEach((v) => this.st.out.push(`DECLARE ${v} : INTEGER`));
      this.st.out.push("");
    }
  }

  private handle(raw: string): void {
    const txt = raw.trim();
    const curIndent = this.leading(raw);

    if (!txt) {
      this.st.out.push("");
      return;
    }
    if (txt.startsWith("//")) {
      this.st.out.push(raw);
      return;
    }

    if (txt === "}" || txt === "{") return;

    while (this.st.ind.length > 1 && curIndent < this.st.ind.at(-1)!) this.popBlock();
    if (curIndent > this.st.ind.at(-1)!) this.st.ind.push(curIndent);

    const pad = " ".repeat((this.st.ind.length - 1) * TAB);
    const { converted, block } = this.convert(txt, pad);
    if (converted) this.st.out.push(converted);
    if (block) this.st.stack.push(block);
  }

  private popBlock(): void {
    this.st.ind.pop();
    const f = this.st.stack.pop();
    if (!f) return;

    const pad = " ".repeat((this.st.ind.length - 1) * TAB);
    const endTok: Record<Block, string> = {
      function: "ENDFUNCTION",
      procedure: "ENDPROCEDURE",
      class: "ENDCLASS",
      if: "ENDIF",
      elif: "ENDIF",
      else: "ENDIF",
      for: `NEXT ${f.ident ?? ""}`.trim(),
      while: "ENDWHILE",
      do: "UNTIL <condition>",
      try: "ENDTRY",
      catch: "ENDTRY",
      finally: "ENDFINALLY",
    };
    this.st.out.push(pad + endTok[f.type]);
  }

  private closeAll() {
    while (this.st.stack.length) this.popBlock();
  }

  private convert(s: string, pad: string): ParseResult {
    const chain = [
      this.cls,
      this.method,
      this.varDecl,
      this.arrDecl,
      this.arrInit,
      this.ifBlk,
      this.elifBlk,
      this.elseBlk,
      this.forCount,
      this.forEach,
      this.whileBlk,
      this.doBlk,
      this.tryBlk,
      this.catchBlk,
      this.finallyBlk,
      this.returnStmt,
      this.printStmt, // now uses PRINT
      this.inputStmt, // now uses READ
      this.mathFunc,
      this.compAssign,
      this.assign,
    ] as const;

    for (const fn of chain) {
      const r = fn.call(this, s, pad);
      if (r.changed) return r;
    }

    this.onUnsupportedSyntax?.("Java syntax", s, this.currentLineNumber);
    return {
      converted: `${pad}// Unsupported: ${s}`,
      block: null,
      changed: true,
    };
  }

  private ok(converted: string, block: Frame | null = null): ParseResult {
    return { converted, block, changed: true };
  }
  private ng(): ParseResult {
    return { converted: "", block: null, changed: false };
  }

  private cls(s: string, i: string): ParseResult {
    const m = s.match(/^(?:public\s+)?class\s+(\w+)/);
    return m ? this.ok(`${i}CLASS ${m[1]}`, { type: "class" }) : this.ng();
  }

  private method(s: string, i: string): ParseResult {
    const m = s.match(/^(?:public|private)?\s*(?:static)?\s*(?:void|int|double|boolean|String|char|long|byte|float|short)\s+(\w+)\(([^)]*)\)\s*\{/);
    return m ? this.ok(`${i}PROCEDURE ${m[1]}(${m[2]})`, { type: "function" }) : this.ng();
  }

  private varDecl(s: string, i: string): ParseResult {
    const full = s.match(/^(?:final\s+)?(?:int|double|String|boolean|char|long|byte|float|short)\s+([A-Za-z_]\\w*)\s*=\s*([^;]+);/);
    if (full) return this.ok(`${i}${full[1]} ${ARW} ${full[2]}`);

    const multi = s.match(/^(?:final\\s+)?(?:int|double|String|boolean|char|long|byte|float|short)\\s+([A-Za-z_]\\w*(?:\\s*,\\s*[A-Za-z_]\\w*)*);/);
    if (multi) {
      return this.ok(`${i}// DECLARE ${multi[1].replace(/\\s+/g, "").split(",").join(", ")}`);
    }
    return this.ng();
  }

  private arrDecl(s: string, i: string): ParseResult {
    const m = s.match(/^([\w<>]+)\[\]\s+([A-Za-z_]\\w*)\s*=\s*new\\s+\\1\\[(\\d+)\\];/);
    return m ? this.ok(`${i}DECLARE ${m[2]} : ARRAY[1:${m[3]}] OF INTEGER`) : this.ng();
  }

  private arrInit(s: string, i: string): ParseResult {
    const m = s.match(/^([\w<>]+)\[\]\s+([A-Za-z_]\\w*)\s*=\s*\\{([^}]+)\\};/);
    return m ? this.ok(`${i}${m[2]} ${ARW} [${m[3].split(/\\s*,\\s*/).join(", ")} ]`) : this.ng();
  }

  private ifBlk(s: string, i: string): ParseResult {
    const m = s.match(/^if\\s*\\((.+)\\)\\s*\\{/);
    return m ? this.ok(`${i}IF ${this.cond(m[1])} THEN`, { type: "if" }) : this.ng();
  }

  private elifBlk(s: string, i: string): ParseResult {
    const m = s.match(/^else if\\s*\\((.+)\\)\\s*\\{/);
    return m ? this.ok(`${i}ELSE IF ${this.cond(m[1])} THEN`, { type: "elif" }) : this.ng();
  }

  private elseBlk(s: string, i: string): ParseResult {
    return /^else\\s*\\{/.test(s) ? this.ok(`${i}ELSE`, { type: "else" }) : this.ng();
  }

  private forCount(s: string, i: string): ParseResult {
    const m = s.match(
/^for\s*\((?:int|long|byte|short)\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*(?:<|<=)\s*(\d+)\s*;\s*\1\+\+\)\s*\{/
    );
    if (!m) return this.ng();
    const end = s.includes("<=") ? +m[3] : +m[3] - 1;
    return this.ok(`${i}FOR ${m[1]} ${ARW} ${m[2]} TO ${end}`, {
      type: "for",
      ident: m[1],
    });
  }

  private forEach(s: string, i: string): ParseResult {
    const m = s.match(/^for\\s*\\((\\w+)\\s*:\\s*(\\w+)\\)\\s*\\{/);
    return m ? this.ok(`${i}FOR EACH ${m[1]} IN ${m[2]}`, { type: "for", ident: m[1] }) : this.ng();
  }

  private whileBlk(s: string, i: string): ParseResult {
    const m = s.match(/^while\\s*\\((.+)\\)\\s*\\{/);
    return m ? this.ok(`${i}WHILE ${this.cond(m[1])} DO`, { type: "while" }) : this.ng();
  }

  private doBlk(s: string, i: string): ParseResult {
    return /^do\\s*\\{/.test(s) ? this.ok(`${i}REPEAT`, { type: "do" }) : this.ng();
  }

  private tryBlk(s: string, i: string): ParseResult {
    return /^try\\s*\\{/.test(s) ? this.ok(`${i}TRY`, { type: "try" }) : this.ng();
  }

  private catchBlk(s: string, i: string): ParseResult {
    const m = s.match(/^catch\\s*\\((?:[^\\s]+\\s+)(\\w+)\\)\\s*\\{/);
    return m ? this.ok(`${i}CATCH ${m[1]}`, { type: "catch" }) : this.ng();
  }

  private finallyBlk(s: string, i: string): ParseResult {
    return /^finally\\s*\\{/.test(s) ? this.ok(`${i}FINALLY`, { type: "finally" }) : this.ng();
  }

  private returnStmt(s: string, i: string): ParseResult {
    const m = s.match(/^return\\s*(.*);/);
    return m ? this.ok(`${i}RETURN${m[1] ? " " + m[1] : ""}`) : this.ng();
  }

  private printStmt(s: string, i: string): ParseResult {
    const m = s.match(/^System\.out\.(?:println|print)\\((.*?)\\);/);
    return m ? this.ok(`${i}PRINT ${m[1]}`) : this.ng();
  }

  private inputStmt(s: string, i: string): ParseResult {
    const m = s.match(/^(\\w+)\\s*=\\s*sc\\.(nextInt|nextDouble|nextLine|next|nextBoolean)\\(\\);/);
    return m ? this.ok(`${i}READ ${m[1]}`) : this.ng();
  }

  private mathFunc(s: string, i: string): ParseResult {
    let r = s
      .replace(/Math\.abs\\(([^)]+)\\)/g, "ABS($1)")
      .replace(/Math\.sqrt\\(([^)]+)\\)/g, "SQRT($1)")
      .replace(/Math\.pow\\(([^,]+),\\s*([^)]+)\\)/g, "$1 ^ $2")
      .replace(/Math\.max\\(([^,]+),\\s*([^)]+)\\)/g, "MAX($1, $2)")
      .replace(/Math\.min\\(([^,]+),\\s*([^)]+)\\)/g, "MIN($1, $2)")
      .replace(/Math\.random\\(\\)/g, "RANDOM()");

    if (r === s) return this.ng();
    const m = r.match(/^(\\w+)\\s*=\\s*(.+);/);
    return m ? this.ok(`${i}${m[1]} ${ARW} ${m[2]}`) : this.ok(`${i}${r}`);
  }

  private compAssign(s: string, i: string): ParseResult {
    for (const [q, sym] of CMP) if (s.includes(q)) {
      const [l, r] = s.split(q);
      return this.ok(`${i}${l.trim()} ${ARW} ${l.trim()} ${sym} ${r.replace(/;$/, "").trim()}`);
    }
    return this.ng();
  }

  private assign(s: string, i: string): ParseResult {
    const m = s.match(/^([A-Za-z_]\\w*)\\s*=\\s*([^=].*);/);
    return m ? this.ok(`${i}${m[1]} ${ARW} ${m[2].trim()}`) : this.ng();
  }

  private cond(x: string) {
    return x
      .replace(/==/g, OP.EQ)
      .replace(/!=/g, OP.NE)
      .replace(/<=/g, OP.LE)
      .replace(/>=/g, OP.GE)
      .replace(/&&/g, ` ${OP.AND} `)
      .replace(/\|\|/g, ` ${OP.OR} `)
      .replace(/!([A-Za-z_\(])/g, `${OP.NOT} $1`)
      .replace(/\btrue\b/gi, "TRUE")
      .replace(/\bfalse\b/gi, "FALSE")
      .replace(/\bMath\.pow\\(([^,]+),\\s*([^\)]+)\\)/g, "$1 ^ $2");
  }

  private leading(r: string): number {
    return r.match(/^(\\s*)/)?.[1].length ?? 0;
  }
}
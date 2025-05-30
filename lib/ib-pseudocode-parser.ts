export type BlockType = "function"|"procedure"|"class"|"if"|"elif"|"else"|"for"|"while"|"repeat"|"case"|"try"|"finally";
export interface ParseResult { convertedLine: string; blockType: BlockType | null }
interface State { indent: number[]; blocks: BlockType[]; out: string[]; openTry: boolean }

const IND = 4, OP = { ASSIGN: "←", EQ: "=", NE: "≠", LE: "≤", GE: "≥", AND: "AND", OR: "OR", NOT: "NOT", DIV: "div", MOD: "mod" } as const,
CMP = [ { op: "+=", sym: "+" }, { op: "-=", sym: "-" }, { op: "*=", sym: "*" }, { op: "/=", sym: "/" }, { op: "%=", sym: "mod" }, { op: "//=", sym: "div" }, { op: "**=", sym: "^" } ];

export class IBParser {
  private s: State = { indent: [0], blocks: [], out: [], openTry: false };
  parse(src: string): string {
    if (!src || typeof src !== "string") return "";
    this.s = { indent: [0], blocks: [], out: [], openTry: false };
    for (const ln of src.split("\n")) this.proc(ln);
    while (this.s.blocks.length) this.close();
    return this.s.out.join("\n");
  }
  private proc(line: string) {
    const t = line.trim(); if (!t) { this.s.out.push("​"); return; }
    if (t.startsWith("#")) { this.s.out.push(this.indStr(line) + "// " + t.slice(1).trim()); return; }
    const cur = this.indLvl(line);
    while (this.s.indent.length > 1 && cur < this.s.indent.at(-1)!) this.close();
    if (cur > this.s.indent.at(-1)!) this.s.indent.push(cur);
    const ind = " ".repeat((this.s.indent.length - 1) * IND);
    const r = this.conv(t, ind);
    if (r.convertedLine) { this.s.out.push(r.convertedLine); if (r.blockType) this.s.blocks.push(r.blockType); }
  }
  private close() {
    this.s.indent.pop(); const bt = this.s.blocks.pop(); const ind = " ".repeat((this.s.indent.length - 1) * IND);
    if (bt === "finally") this.s.out.push(ind + "END TRY");
    else if (bt === "case") this.s.out.push(ind + "END CASE");
    else if (bt === "for" || bt === "repeat") this.s.out.push(ind + "end loop");
    else if (bt === "while") this.s.out.push(ind + "END WHILE");
    else if (["if", "elif", "else"].includes(bt!)) this.s.out.push(ind + "END IF");
    else if (bt === "function") this.s.out.push(ind + "END FUNCTION");
    else if (bt === "procedure") this.s.out.push(ind + "END PROCEDURE");
    else if (bt === "class") this.s.out.push(ind + "END CLASS");
  }
  private indLvl(l: string) { return (l.match(/^(\s*)/)?.[1].length) || 0 }
  private indStr(l: string) { return l.match(/^(\s*)/)?.[1] || "" }
  private conv(s: string, i: string): ParseResult {
    const chain = [ this.print, this.fun, this.procDec, this.cls, this.ifc, this.elif, this.els, this.forRange, this.forColl, this.whilec, this.repeat, this.matchStart, this.matchCase, this.tryb, this.exceptb, this.finallyb, this.ret, this.input, this.compAssign, this.assign ];
    for (const fn of chain) { const r = fn.bind(this)(s, i); if (r.convertedLine !== s) return r; }
    return { convertedLine: i + s, blockType: null };
  }
  private fun(s: string, i: string) { const m = s.match(/^def\s+(\w+)\((.*?)\)\s*:/); return m ? { convertedLine: `${i}FUNCTION ${m[1]}(${m[2]})`, blockType: "function" } : { convertedLine: s, blockType: null }; }
  private procDec(s: string, i: string) { if (!s.includes("# procedure")) return { convertedLine: s, blockType: null }; const m = s.match(/^def\s+(\w+)\((.*?)\)/); return m ? { convertedLine: `${i}PROCEDURE ${m[1]}(${m[2]})`, blockType: "procedure" } : { convertedLine: s, blockType: null }; }
  private cls(s: string, i: string) { const m = s.match(/^class\s+(\w+)(?:\((\w+)\))?\s*:/); return m ? { convertedLine: `${i}CLASS ${m[1]}${m[2] ? ` EXTENDS ${m[2]}` : ""}`, blockType: "class" } : { convertedLine: s, blockType: null }; }
  private ifc(s: string, i: string) { return s.startsWith("if ") ? { convertedLine: `${i}IF ${this.cond(s.slice(3, -1))} THEN`, blockType: "if" } : { convertedLine: s, blockType: null }; }
  private elif(s: string, i: string) { return s.startsWith("elif ") ? { convertedLine: `${i}ELSE IF ${this.cond(s.slice(5, -1))} THEN`, blockType: "elif" } : { convertedLine: s, blockType: null }; }
  private els(s: string, i: string) { return s === "else:" ? { convertedLine: `${i}ELSE`, blockType: "else" } : { convertedLine: s, blockType: null }; }
  private forRange(s: string, i: string) {
    if (!s.startsWith("for ") || !s.includes("range(")) return { convertedLine: s, blockType: null };
    const m = s.match(/for\s+(\w+)\s+in\s+range\(([^)]*)\)\s*:/); if (!m) return { convertedLine: s, blockType: null };
    const [_, v, arg] = m; const args = arg.split(",").map(a => a.trim());
    if (args.length === 1) { const end = parseInt(args[0]); return { convertedLine: `${i}loop ${v} from 0 to ${end - 1}`, blockType: "for" }; }
    else if (args.length >= 2) { const start = parseInt(args[0]), end = parseInt(args[1]); return { convertedLine: `${i}loop ${v} from ${start} to ${end - 1}`, blockType: "for" }; }
    return { convertedLine: s, blockType: null };
  }
  private forColl(s: string, i: string) { const m = s.match(/for\s+(\w+)\s+in\s+(\w+)\s*:/); if (!m) return { convertedLine: s, blockType: null }; const [_, v, col] = m; this.s.out.push(`${i}${col}.resetNext()`); this.s.out.push(`${i}loop while ${col}.hasNext()`); this.s.out.push(`${i}    ${v} ${OP.ASSIGN} ${col}.getNext()`); return { convertedLine: "", blockType: "for" }; }
  private whilec(s: string, i: string) { return s.startsWith("while ") ? { convertedLine: `${i}WHILE ${this.cond(s.slice(6, -1))} DO`, blockType: "while" } : { convertedLine: s, blockType: null }; }
  private repeat(s: string, i: string) { return s.includes("# repeat") ? { convertedLine: `${i}REPEAT`, blockType: "repeat" } : { convertedLine: s, blockType: null }; }
  private matchStart(s: string, i: string) { const m = s.match(/^match\s+(\w+)\s*:/); return m ? { convertedLine: `${i}CASE OF ${m[1]}`, blockType: "case" } : { convertedLine: s, blockType: null }; }
  private matchCase(s: string, i: string) { const m = s.match(/^case\s+(.+?)\s*:/); return m ? { convertedLine: `${i}${m[1]} :`, blockType: null } : { convertedLine: s, blockType: null }; }
  private tryb(s: string, i: string) { if (s !== "try:") return { convertedLine: s, blockType: null }; this.s.openTry = true; return { convertedLine: `${i}TRY`, blockType: "try" }; }
  private exceptb(s: string, i: string) { if (!s.startsWith("except")) return { convertedLine: s, blockType: null }; const m = s.match(/^except(?:\s+(\w+))?\s*:/); return { convertedLine: `${i}CATCH${m?.[1] ? " " + m[1] : ""}`, blockType: null }; }
  private finallyb(s: string, i: string) { return s === "finally:" ? { convertedLine: `${i}FINALLY`, blockType: "finally" } : { convertedLine: s, blockType: null }; }
  private ret(s: string, i: string) { return s.startsWith("return") ? { convertedLine: `${i}RETURN${s.slice(6).trim() ? " " + s.slice(6).trim() : ""}`, blockType: null } : { convertedLine: s, blockType: null }; }
  private print(s: string, i: string) { if (!/^print\(.*\)$/.test(s)) return { convertedLine: s, blockType: null }; return { convertedLine: `${i}OUTPUT ${s.slice(6, -1)}`, blockType: null }; }
  private input(s: string, i: string) { const m = s.match(/(\w+)\s*=\s*input/); return m ? { convertedLine: `${i}INPUT ${m[1]}`, blockType: null } : { convertedLine: s, blockType: null }; }
  private compAssign(s: string, i: string) { for (const { op, sym } of CMP) if (s.includes(op)) { const [p1, p2] = s.split(op); return { convertedLine: `${i}${p1.trim()} ${OP.ASSIGN} ${p1.trim()} ${sym} ${p2.trim()}`, blockType: null }; } return { convertedLine: s, blockType: null }; }
  private assign(s: string, i: string) { if (!s.includes(" = ") || /[!=<>]=/.test(s)) return { convertedLine: s, blockType: null }; const [va, val] = s.split(" = "); return { convertedLine: `${i}${va.trim()} ${OP.ASSIGN} ${val.trim()}`, blockType: null }; }
  private cond(c: string) { return c.replace(/==/g, OP.EQ).replace(/!=/g, OP.NE).replace(/<=/g, OP.LE).replace(/>=/g, OP.GE).replace(/\band\b/g, OP.AND).replace(/\bor\b/g, OP.OR).replace(/\bnot\b/g, OP.NOT).replace(/\/\//g, " " + OP.DIV + " ").replace(/%/g, " " + OP.MOD + " "); }
}

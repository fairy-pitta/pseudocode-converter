"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CambridgePseudocodeParser = void 0;
exports.pythonToIGCSEPseudocode = pythonToIGCSEPseudocode;
const INDENT_SIZE = 3, ARROW = "←";
const OP = { EQ: "=", NE: "<>", LE: "<=", GE: ">=", AND: "AND", OR: "OR", NOT: "NOT", DIV: "DIV", MOD: "MOD", POW: "^" };
const COMPOUND = [["+=", "+"], ["-=", "-"], ["*=", "*"], ["/=", "/"], ["%=", OP.MOD], ["//=", OP.DIV], ["**=", OP.POW]];
class CambridgePseudocodeParser {
    parse(src) { if (!src.trim())
        return ""; this.init(); const ls = src.split(/\r?\n/); this.collect(ls); ls.forEach(l => this.line(l)); this.flush(); return this.st.result.join("\n"); }
    init() { this.st = { indentStack: [0], blockStack: [], result: [], declarations: new Set() }; }
    collect(ls) { ls.forEach(r => { const t = r.trim(); if (/^[A-Za-z_]\w*\s*=\s*[^=]/.test(t))
        this.st.declarations.add(t.split("=")[0].trim()); const m = t.match(/^for\s+(\w+)\s+in/); if (m)
        this.st.declarations.add(m[1]); }); if (this.st.declarations.size) {
        this.st.result.push("// Variable declarations (default INTEGER)");
        [...this.st.declarations].sort().forEach(v => this.st.result.push(`DECLARE ${v} : INTEGER`));
        this.st.result.push("");
    } }
    line(r) {
        const t = r.trim();
        if (!t) {
            this.st.result.push("");
            return;
        }
        if (t.startsWith("#")) {
            this.st.result.push(`${this.ws(r)}// ${t.slice(1).trim()}`);
            return;
        }
        const ind = this.ind(r);
        while (this.st.indentStack.length > 1 && ind < this.st.indentStack.at(-1))
            this.endBlk();
        if (ind > this.st.indentStack.at(-1))
            this.st.indentStack.push(ind);
        const pad = " ".repeat((this.st.indentStack.length - 1) * INDENT_SIZE);
        const res = this.conv(t, pad);
        this.st.result.push(res.convertedLine);
        if (res.blockType)
            this.st.blockStack.push(res.blockType);
    }
    endBlk() { this.st.indentStack.pop(); const f = this.st.blockStack.pop(); const pad = " ".repeat((this.st.indentStack.length - 1) * INDENT_SIZE); const close = { function: "ENDFUNCTION", procedure: "ENDPROCEDURE", class: "ENDCLASS", if: "ENDIF", elif: "ENDIF", else: "ENDIF", for: `NEXT ${f.ident ?? ""}`.trim(), while: "ENDWHILE", repeat: "UNTIL <condition>" }[f.type]; this.st.result.push(`${pad}${close}`); }
    flush() { while (this.st.blockStack.length)
        this.endBlk(); }
    // converters chain
    conv(s, i) { const c = [this.fDef, this.cls, this.ifc, this.elif, this.els, this.forR, this.forEach, this.whl, this.ret, this.prn, this.inp, this.comp, this.asg]; for (const fn of c) {
        const r = fn.call(this, s, i);
        if (r.convertedLine !== s)
            return r;
    } return { convertedLine: `${i}// TODO: ${s}`, blockType: null }; }
    // definitions
    fDef(s, i) { const m = s.match(/^def\s+(\w+)\(([^)]*)\)\s*:/); return m ? { convertedLine: `${i}PROCEDURE ${m[1]}(${m[2]})`, blockType: { type: "function" } } : { convertedLine: s, blockType: null }; }
    cls(s, i) { const m = s.match(/^class\s+(\w+)/); return m ? { convertedLine: `${i}CLASS ${m[1]}`, blockType: { type: "class" } } : { convertedLine: s, blockType: null }; }
    // conditionals
    ifc(s, i) { if (!/^if\s+.+:$/i.test(s))
        return { convertedLine: s, blockType: null }; return { convertedLine: `${i}IF ${this.cond(s.slice(3, -1))} THEN`, blockType: { type: "if" } }; }
    elif(s, i) { if (!/^elif\s+.+:$/i.test(s))
        return { convertedLine: s, blockType: null }; return { convertedLine: `${i}ELSE IF ${this.cond(s.slice(5, -1))} THEN`, blockType: { type: "elif" } }; }
    els(s, i) { return s === "else:" ? { convertedLine: `${i}ELSE`, blockType: { type: "else" } } : { convertedLine: s, blockType: null }; }
    // loops
    forR(s, i) { const m = s.match(/^for\s+(\w+)\s+in\s+range\(([^)]*)\)\s*:/); if (!m)
        return { convertedLine: s, blockType: null }; const [_, v, arg] = m; const p = arg.split(/\s*,\s*/); let from = "0", to, step = "1"; if (p.length === 1) {
        to = this.incEnd(p[0]);
    }
    else {
        from = p[0];
        to = this.incEnd(p[1]);
        if (p[2])
            step = p[2];
    } const st = step === "1" ? "" : ` STEP ${step}`; return { convertedLine: `${i}FOR ${v} ${ARROW} ${from} TO ${to}${st}`, blockType: { type: "for", ident: v } }; }
    forEach(s, i) { const m = s.match(/^for\s+(\w+)\s+in\s+(.+)\s*:/); if (!m || m[2].startsWith("range("))
        return { convertedLine: s, blockType: null }; return { convertedLine: `${i}FOR EACH ${m[1]} IN ${m[2]}`, blockType: { type: "for", ident: m[1] } }; }
    whl(s, i) { const m = s.match(/^while\s+(.+):$/); return m ? { convertedLine: `${i}WHILE ${this.cond(m[1])} DO`, blockType: { type: "while" } } : { convertedLine: s, blockType: null }; }
    // I/O and return
    ret(s, i) { if (!s.startsWith("return"))
        return { convertedLine: s, blockType: null }; const v = s.replace(/^return\s*/, ""); return { convertedLine: `${i}RETURN${v ? " " + v : ""}`, blockType: null }; }
    prn(s, i) { return s.startsWith("print(") ? { convertedLine: `${i}output ${s.slice(6, -1)}`, blockType: null } : { convertedLine: s, blockType: null }; }
    inp(s, i) { const m = s.match(/^(\w+)\s*=\s*input\(/); return m ? { convertedLine: `${i}input ${m[1]}`, blockType: null } : { convertedLine: s, blockType: null }; }
    // assignments
    comp(s, i) { for (const [op, sym] of COMPOUND) {
        if (s.includes(op)) {
            const [l, r] = s.split(op);
            return { convertedLine: `${i}${l.trim()} ${ARROW} ${l.trim()} ${sym} ${r.trim()}`, blockType: null };
        }
    } return { convertedLine: s, blockType: null }; }
    asg(s, i) { if (!/^[A-Za-z_]\w*\s*=\s*[^=]/.test(s))
        return { convertedLine: s, blockType: null }; const [l, r] = s.split(/\s*=\s*/, 2); return { convertedLine: `${i}${l.trim()} ${ARROW} ${r.trim()}`, blockType: null }; }
    // helpers
    cond(c) { return c.replace(/==/g, OP.EQ).replace(/!=/g, OP.NE).replace(/<=/g, OP.LE).replace(/>=/g, OP.GE).replace(/\band\b/gi, OP.AND).replace(/\bor\b/gi, OP.OR).replace(/\bnot\b/gi, OP.NOT).replace(/\bTrue\b/g, "TRUE").replace(/\bFalse\b/g, "FALSE").replace(/\*\*/g, ` ${OP.POW} `).replace(/\/\//g, ` ${OP.DIV} `).replace(/%/g, ` ${OP.MOD} `); }
    incEnd(v) { const n = Number(v); return Number.isFinite(n) ? String(n - 1) : `${v} - 1`; }
    ws(r) { return r.match(/^(\s*)/)?.[1] ?? ""; }
    ind(r) { return r.match(/^(\s*)/)?.[1].length ?? 0; }
}
exports.CambridgePseudocodeParser = CambridgePseudocodeParser;
// Export function for tests
function pythonToIGCSEPseudocode(pythonCode) {
    const parser = new CambridgePseudocodeParser();
    return parser.parse(pythonCode);
}

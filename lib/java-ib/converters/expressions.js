"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionConverters = exports.compAssign = exports.mathExpr = void 0;
const constants_1 = require("../constants");
const mathExpr = (s, i) => {
    let r = s
        .replace(/Math\.sqrt\(([^)]+)\)/g, "√($1)")
        .replace(/Math\.abs\(([^)]+)\)/g, "ABS($1)")
        .replace(/Math\.max\(([^,]+),\s*([^)]+)\)/g, "MAX($1, $2)")
        .replace(/Math\.min\(([^,]+),\s*([^)]+)\)/g, "MIN($1, $2)")
        .replace(/Math\.pow\(([^,]+),\s*([^\)]+)\)/g, "$1 ^ $2");
    if (r === s)
        return { code: '', block: null, changed: false };
    const m = r.match(/^(\w+)\s*=\s*(.+);/);
    return m
        ? { code: `${i}${m[1]} ${constants_1.ARW} ${m[2]}`, block: null, changed: true }
        : { code: `${i}${r}`, block: null, changed: true };
};
exports.mathExpr = mathExpr;
const compAssign = (s, i) => {
    for (const [op, sym] of constants_1.CMP) {
        if (s.includes(op)) {
            const [l, r] = s.split(op);
            return {
                code: `${i}${l.trim()} ${constants_1.ARW} ${l.trim()} ${sym} ${r.replace(/;$/, '').trim()}`,
                block: null,
                changed: true
            };
        }
    }
    return { code: '', block: null, changed: false };
};
exports.compAssign = compAssign;
exports.expressionConverters = {
    mathExpr: exports.mathExpr,
    compAssign: exports.compAssign,
};

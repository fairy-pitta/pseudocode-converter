"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statementConverters = exports.compAssign = exports.mathExpr = exports.arrayDecl = exports.constDecl = exports.varDecl = exports.assignStmt = exports.inputStmt = exports.returnStmt = exports.printStmt = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const printStmt = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.PRINT);
    return m
        ? { code: `${i}OUTPUT ${m[1]}`, block: null, changed: true }
        : { code: '', block: null, changed: false };
};
exports.printStmt = printStmt;
const returnStmt = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.RETURN);
    return m
        ? { code: `${i}RETURN${m[1] ? ' ' + m[1] : ''}`, block: null, changed: true }
        : { code: '', block: null, changed: false };
};
exports.returnStmt = returnStmt;
const inputStmt = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.INPUT);
    return m
        ? { code: `${i}INPUT ${m[1]}`, block: null, changed: true }
        : { code: '', block: null, changed: false };
};
exports.inputStmt = inputStmt;
const assignStmt = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.ASSIGN);
    return m
        ? { code: `${i}${m[1]} ${constants_1.ARW} ${m[2].trim()}`, block: null, changed: true }
        : { code: '', block: null, changed: false };
};
exports.assignStmt = assignStmt;
const varDecl = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.VAR_DECL);
    return m
        ? { code: `${i}DECLARE ${m[2]}${m[3] ? ' ' + constants_1.ARW + ' ' + m[3] : ''}`, block: null, changed: true }
        : { code: '', block: null, changed: false };
};
exports.varDecl = varDecl;
const constDecl = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.CONST_DECL);
    return m
        ? { code: `${i}CONSTANT ${m[2]} ${constants_1.ARW} ${m[3]}`, block: null, changed: true }
        : { code: '', block: null, changed: false };
};
exports.constDecl = constDecl;
const arrayDecl = (s, i) => {
    // 配列リテラル宣言
    const litMatch = s.match(patterns_1.PATTERNS.ARRAY_LIT);
    if (litMatch) {
        return { code: `${i}DECLARE ${litMatch[2]} ${constants_1.ARW} [${litMatch[3]}]`, block: null, changed: true };
    }
    // 配列サイズ宣言
    const sizedMatch = s.match(patterns_1.PATTERNS.ARRAY_SIZED);
    if (sizedMatch) {
        const type = sizedMatch[1].toUpperCase();
        return { code: `${i}DECLARE ${sizedMatch[2]} : ARRAY[${sizedMatch[3]}] OF ${type}`, block: null, changed: true };
    }
    return { code: '', block: null, changed: false };
};
exports.arrayDecl = arrayDecl;
const mathExpr = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.MATH_EXPR);
    if (!m)
        return { code: '', block: null, changed: false };
    const func = m[2];
    const args = m[3];
    let result = '';
    switch (func) {
        case 'pow':
            const [base, exp] = args.split(',').map(arg => arg.trim());
            result = `${base} ^ ${exp}`;
            break;
        case 'sqrt':
            result = `SQRT(${args})`;
            break;
        case 'abs':
            result = `ABS(${args})`;
            break;
        default:
            result = `${func.toUpperCase()}(${args})`;
    }
    return { code: `${i}${m[1]} ${constants_1.ARW} ${result}`, block: null, changed: true };
};
exports.mathExpr = mathExpr;
const compAssign = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.COMP_ASSIGN);
    if (!m)
        return { code: '', block: null, changed: false };
    const variable = m[1];
    const operator = m[2].slice(0, -1); // += -> +
    const value = m[3];
    return { code: `${i}${variable} ${constants_1.ARW} ${variable} ${operator} ${value}`, block: null, changed: true };
};
exports.compAssign = compAssign;
exports.statementConverters = {
    printStmt: exports.printStmt,
    returnStmt: exports.returnStmt,
    inputStmt: exports.inputStmt,
    assignStmt: exports.assignStmt,
    varDecl: exports.varDecl,
    constDecl: exports.constDecl,
    arrayDecl: exports.arrayDecl,
    mathExpr: exports.mathExpr,
    compAssign: exports.compAssign,
};

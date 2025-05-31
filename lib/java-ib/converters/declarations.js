"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declarationConverters = exports.arrayDecl = exports.varDecl = exports.constDecl = void 0;
const patterns_1 = require("../patterns");
const constants_1 = require("../constants");
const constDecl = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.CONST_DECL);
    return m
        ? { code: `${i}CONSTANT ${m[1]} ${constants_1.ARW} ${m[2]}`, block: null, changed: true }
        : { code: '', block: null, changed: false };
};
exports.constDecl = constDecl;
const varDecl = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.VAR_DECL);
    return m
        ? { code: `${i}DECLARE ${m[1]}${m[2] ? ` ${constants_1.ARW} ${m[2]}` : ''}`, block: null, changed: true }
        : { code: '', block: null, changed: false };
};
exports.varDecl = varDecl;
const arrayDecl = (s, i) => {
    const lit = s.match(patterns_1.PATTERNS.ARRAY_LIT);
    if (lit) {
        return { code: `${i}DECLARE ${lit[2]} ${constants_1.ARW} [${lit[3]}]`, block: null, changed: true };
    }
    const sized = s.match(patterns_1.PATTERNS.ARRAY_SIZED);
    if (sized) {
        return {
            code: `${i}DECLARE ${sized[2]} : ARRAY[${sized[3]}] OF ${sized[1].toUpperCase()}`,
            block: null,
            changed: true
        };
    }
    return { code: '', block: null, changed: false };
};
exports.arrayDecl = arrayDecl;
exports.declarationConverters = {
    constDecl: exports.constDecl,
    varDecl: exports.varDecl,
    arrayDecl: exports.arrayDecl,
};

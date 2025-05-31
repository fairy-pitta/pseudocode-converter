"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cond = exports.extractLoopVar = exports.leadingWhitespace = void 0;
const constants_1 = require("./constants");
const leadingWhitespace = (s) => {
    return s.match(/^(\s*)/)?.[1] ?? "";
};
exports.leadingWhitespace = leadingWhitespace;
const extractLoopVar = (s) => {
    const m = s.match(/for\s*\(.*?(\w+)\+\+/);
    return m ? m[1] : '';
};
exports.extractLoopVar = extractLoopVar;
const cond = (expr) => {
    return expr
        .replace(/==/g, constants_1.OP.EQ)
        .replace(/!=/g, constants_1.OP.NE)
        .replace(/<=/g, constants_1.OP.LE)
        .replace(/>=/g, constants_1.OP.GE)
        .replace(/&&/g, ` ${constants_1.OP.AND} `)
        .replace(/\|\|/g, ` ${constants_1.OP.OR} `)
        .replace(/!([A-Za-z_\(])/g, `${constants_1.OP.NOT} $1`)
        .replace(/\btrue\b/gi, "TRUE")
        .replace(/\bfalse\b/gi, "FALSE")
        .replace(/Math\.pow\(([^,]+),\s*([^\)]+)\)/g, "$1 ^ $2");
};
exports.cond = cond;

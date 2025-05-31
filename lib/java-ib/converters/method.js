"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodConverter = void 0;
const patterns_1 = require("../patterns");
const methodConverter = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.METHOD);
    if (!m)
        return { code: '', block: null, changed: false };
    const isVoid = m[2] === 'void';
    const keyword = isVoid ? 'PROCEDURE' : 'FUNCTION';
    const blockType = isVoid ? 'procedure' : 'function';
    return {
        code: `${i}${keyword} ${m[3]}(${m[4]})`,
        block: blockType,
        changed: true
    };
};
exports.methodConverter = methodConverter;

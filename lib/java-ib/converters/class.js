"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classConverter = void 0;
const patterns_1 = require("../patterns");
const classConverter = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.CLASS);
    return m
        ? { code: `${i}CLASS ${m[1]}`, block: 'class', changed: true }
        : { code: '', block: null, changed: false };
};
exports.classConverter = classConverter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlFlowConverters = exports.finallyBlock = exports.catchBlock = exports.tryBlock = exports.doWhileBlock = exports.doBlock = exports.whileBlock = exports.forEach = exports.forCount = exports.elseOnlyBlock = exports.elseBlock = exports.elifOnlyBlock = exports.elifBlock = exports.ifBlock = void 0;
const patterns_1 = require("../patterns");
const utils_1 = require("../utils");
const ifBlock = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.IF);
    return m
        ? { code: `${i}IF ${(0, utils_1.cond)(m[1])} THEN`, block: 'if', changed: true }
        : { code: '', block: null, changed: false };
};
exports.ifBlock = ifBlock;
const elifBlock = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.ELIF);
    return m
        ? { code: `${i}ELSE IF ${(0, utils_1.cond)(m[1])} THEN`, block: 'elif', changed: true }
        : { code: '', block: null, changed: false };
};
exports.elifBlock = elifBlock;
const elifOnlyBlock = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.ELIF_ONLY);
    return m
        ? { code: `${i}ELSE IF ${(0, utils_1.cond)(m[1])} THEN`, block: 'elif', changed: true }
        : { code: '', block: null, changed: false };
};
exports.elifOnlyBlock = elifOnlyBlock;
const elseBlock = (s, i) => {
    return patterns_1.PATTERNS.ELSE.test(s)
        ? { code: `${i}ELSE`, block: 'else', changed: true }
        : { code: '', block: null, changed: false };
};
exports.elseBlock = elseBlock;
const elseOnlyBlock = (s, i) => {
    return patterns_1.PATTERNS.ELSE_ONLY.test(s)
        ? { code: `${i}ELSE`, block: 'else', changed: true }
        : { code: '', block: null, changed: false };
};
exports.elseOnlyBlock = elseOnlyBlock;
const forCount = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.FOR_COUNT);
    if (!m)
        return { code: '', block: null, changed: false };
    const start = +m[2];
    const operator = m[3];
    const endValue = m[4];
    // Check if endValue is a number or variable
    const isNumber = /^\d+$/.test(endValue);
    let end;
    if (isNumber) {
        const endNum = +endValue;
        end = endNum.toString(); // FOR ... TO ... DO includes the end value
    }
    else {
        // For variables, keep the variable name as is
        end = endValue;
    }
    return {
        code: `${i}FOR ${m[1]} FROM ${start} TO ${end} DO`,
        block: 'for',
        changed: true
    };
};
exports.forCount = forCount;
const forEach = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.FOR_EACH);
    return m
        ? { code: `${i}FOR EACH ${m[1]} IN ${m[2]} DO`, block: 'for', changed: true }
        : { code: '', block: null, changed: false };
};
exports.forEach = forEach;
const whileBlock = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.WHILE);
    return m
        ? { code: `${i}WHILE ${(0, utils_1.cond)(m[1])} DO`, block: 'while', changed: true }
        : { code: '', block: null, changed: false };
};
exports.whileBlock = whileBlock;
const doBlock = (s, i) => {
    return patterns_1.PATTERNS.DO.test(s)
        ? { code: `${i}REPEAT`, block: 'repeat', changed: true }
        : { code: '', block: null, changed: false };
};
exports.doBlock = doBlock;
exports.doWhileBlock = exports.doBlock;
const tryBlock = (s, i) => {
    return patterns_1.PATTERNS.TRY.test(s)
        ? { code: `${i}TRY`, block: 'try', changed: true }
        : { code: '', block: null, changed: false };
};
exports.tryBlock = tryBlock;
const catchBlock = (s, i) => {
    const m = s.match(patterns_1.PATTERNS.CATCH);
    return m
        ? { code: `${i}CATCH ${m[1]}`, block: 'catch', changed: true }
        : { code: '', block: null, changed: false };
};
exports.catchBlock = catchBlock;
const finallyBlock = (s, i) => {
    return patterns_1.PATTERNS.FINALLY.test(s)
        ? { code: `${i}FINALLY`, block: 'finally', changed: true }
        : { code: '', block: null, changed: false };
};
exports.finallyBlock = finallyBlock;
exports.controlFlowConverters = {
    ifBlock: exports.ifBlock,
    elifBlock: exports.elifBlock,
    elifOnlyBlock: exports.elifOnlyBlock,
    elseBlock: exports.elseBlock,
    elseOnlyBlock: exports.elseOnlyBlock,
    forCount: exports.forCount,
    forEach: exports.forEach,
    whileBlock: exports.whileBlock,
    doBlock: exports.doBlock,
    doWhileBlock: exports.doWhileBlock,
    tryBlock: exports.tryBlock,
    catchBlock: exports.catchBlock,
    finallyBlock: exports.finallyBlock,
};

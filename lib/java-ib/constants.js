"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMP = exports.OP = exports.ARW = exports.IND = void 0;
exports.IND = 4;
exports.ARW = "←";
exports.OP = {
    EQ: "=",
    NE: "≠",
    LE: "≤",
    GE: "≥",
    AND: "AND",
    OR: "OR",
    NOT: "NOT",
    DIV: "DIV",
    MOD: "MOD",
    POW: "^",
};
exports.CMP = [
    ["+=", "+"],
    ["-=", "-"],
    ["*=", "*"],
    ["/=", "/"],
    ["%=", exports.OP.MOD],
];

export const IND = 4;
export const ARW = "←";

export const OP = {
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
} as const;

export const CMP = [
  ["+=", "+"],
  ["-=", "-"],
  ["*=", "*"],
  ["/=", "/"],
  ["%=", OP.MOD],
] as const;
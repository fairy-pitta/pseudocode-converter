import { OP } from './constants';

export const leadingWhitespace = (s: string): string => {
  return s.match(/^(\s*)/)?.[1] ?? "";
};

export const extractLoopVar = (s: string): string => {
  const m = s.match(/for\s*\(.*?(\w+)\+\+/);
  return m ? m[1] : '';
};

export const cond = (expr: string): string => {
  return expr
    .replace(/==/g, OP.EQ)
    .replace(/!=/g, OP.NE)
    .replace(/<=/g, OP.LE)
    .replace(/>=/g, OP.GE)
    .replace(/&&/g, ` ${OP.AND} `)
    .replace(/\|\|/g, ` ${OP.OR} `)
    .replace(/!([A-Za-z_\(])/g, `${OP.NOT} $1`)
    .replace(/\btrue\b/gi, "TRUE")
    .replace(/\bfalse\b/gi, "FALSE")
    .replace(/Math\.pow\(([^,]+),\s*([^\)]+)\)/g, "$1 ^ $2");
};
import { ParseResult } from '../types';
import { ARW, CMP } from '../constants';

export const mathExpr = (s: string, i: string): ParseResult => {
  let r = s
    .replace(/Math\.sqrt\(([^)]+)\)/g, "√($1)")
    .replace(/Math\.abs\(([^)]+)\)/g, "ABS($1)")
    .replace(/Math\.max\(([^,]+),\s*([^)]+)\)/g, "MAX($1, $2)")
    .replace(/Math\.min\(([^,]+),\s*([^)]+)\)/g, "MIN($1, $2)")
    .replace(/Math\.pow\(([^,]+),\s*([^\)]+)\)/g, "$1 ^ $2");
    
  if (r === s) return { code: '', block: null, changed: false };
  
  const m = r.match(/^(\w+)\s*=\s*(.+);/);
  return m 
    ? { code: `${i}${m[1]} ${ARW} ${m[2]}`, block: null, changed: true }
    : { code: `${i}${r}`, block: null, changed: true };
};

export const compAssign = (s: string, i: string): ParseResult => {
  for (const [op, sym] of CMP) {
    if (s.includes(op)) {
      const [l, r] = s.split(op);
      return {
        code: `${i}${l.trim()} ${ARW} ${l.trim()} ${sym} ${r.replace(/;$/, '').trim()}`,
        block: null,
        changed: true
      };
    }
  }
  return { code: '', block: null, changed: false };
};

export const expressionConverters = {
  mathExpr,
  compAssign,
};
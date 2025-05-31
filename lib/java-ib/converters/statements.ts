import { ParseResult } from '../types';
import { PATTERNS } from '../patterns';
import { ARW } from '../constants';

export const printStmt = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.PRINT);
  return m 
    ? { code: `${i}OUTPUT ${m[1]}`, block: null, changed: true }
    : { code: '', block: null, changed: false };
};

export const returnStmt = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.RETURN);
  return m 
    ? { code: `${i}RETURN${m[1] ? ' ' + m[1] : ''}`, block: null, changed: true }
    : { code: '', block: null, changed: false };
};

export const inputStmt = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.INPUT);
  return m 
    ? { code: `${i}INPUT ${m[1]}`, block: null, changed: true }
    : { code: '', block: null, changed: false };
};

export const assignStmt = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.ASSIGN);
  return m 
    ? { code: `${i}${m[1]} ${ARW} ${m[2].trim()}`, block: null, changed: true }
    : { code: '', block: null, changed: false };
};

export const varDecl = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.VAR_DECL);
  return m 
    ? { code: `${i}DECLARE ${m[2]}${m[3] ? ' ' + ARW + ' ' + m[3] : ''}`, block: null, changed: true }
    : { code: '', block: null, changed: false };
};

export const constDecl = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.CONST_DECL);
  return m 
    ? { code: `${i}CONSTANT ${m[2]} ${ARW} ${m[3]}`, block: null, changed: true }
    : { code: '', block: null, changed: false };
};

export const arrayDecl = (s: string, i: string): ParseResult => {
  // 配列リテラル宣言
  const litMatch = s.match(PATTERNS.ARRAY_LIT);
  if (litMatch) {
    return { code: `${i}DECLARE ${litMatch[2]} ${ARW} [${litMatch[3]}]`, block: null, changed: true };
  }
  
  // 配列サイズ宣言
  const sizedMatch = s.match(PATTERNS.ARRAY_SIZED);
  if (sizedMatch) {
    const type = sizedMatch[1].toUpperCase();
    return { code: `${i}DECLARE ${sizedMatch[2]} : ARRAY[${sizedMatch[3]}] OF ${type}`, block: null, changed: true };
  }
  
  return { code: '', block: null, changed: false };
};

export const mathExpr = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.MATH_EXPR);
  if (!m) return { code: '', block: null, changed: false };
  
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
  
  return { code: `${i}${m[1]} ${ARW} ${result}`, block: null, changed: true };
};

export const compAssign = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.COMP_ASSIGN);
  if (!m) return { code: '', block: null, changed: false };
  
  const variable = m[1];
  const operator = m[2].slice(0, -1); // += -> +
  const value = m[3];
  
  return { code: `${i}${variable} ${ARW} ${variable} ${operator} ${value}`, block: null, changed: true };
};

export const statementConverters = {
  printStmt,
  returnStmt,
  inputStmt,
  assignStmt,
  varDecl,
  constDecl,
  arrayDecl,
  mathExpr,
  compAssign,
};
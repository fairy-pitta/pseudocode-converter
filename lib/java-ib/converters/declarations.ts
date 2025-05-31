import { ParseResult } from '../types';
import { PATTERNS } from '../patterns';
import { ARW } from '../constants';

export const constDecl = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.CONST_DECL);
  return m 
    ? { code: `${i}CONSTANT ${m[1]} ${ARW} ${m[2]}`, block: null, changed: true }
    : { code: '', block: null, changed: false };
};

export const varDecl = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.VAR_DECL);
  return m 
    ? { code: `${i}DECLARE ${m[1]}${m[2] ? ` ${ARW} ${m[2]}` : ''}`, block: null, changed: true }
    : { code: '', block: null, changed: false };
};

export const arrayDecl = (s: string, i: string): ParseResult => {
  const lit = s.match(PATTERNS.ARRAY_LIT);
  if (lit) {
    return { code: `${i}DECLARE ${lit[2]} ${ARW} [${lit[3]}]`, block: null, changed: true };
  }
  
  const sized = s.match(PATTERNS.ARRAY_SIZED);
  if (sized) {
    return { 
      code: `${i}DECLARE ${sized[2]} : ARRAY[${sized[3]}] OF ${sized[1].toUpperCase()}`, 
      block: null, 
      changed: true 
    };
  }
  
  return { code: '', block: null, changed: false };
};

export const declarationConverters = {
  constDecl,
  varDecl,
  arrayDecl,
};
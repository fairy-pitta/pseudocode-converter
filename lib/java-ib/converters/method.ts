import { ParseResult } from '../types';
import { PATTERNS } from '../patterns';

export const methodConverter = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.METHOD);
  if (!m) return { code: '', block: null, changed: false };
  
  const isVoid = m[2] === 'void';
  const keyword = isVoid ? 'PROCEDURE' : 'FUNCTION';
  const blockType = isVoid ? 'procedure' : 'function';
  
  return {
    code: `${i}${keyword} ${m[3]}(${m[4]})`,
    block: blockType as any,
    changed: true
  };
};
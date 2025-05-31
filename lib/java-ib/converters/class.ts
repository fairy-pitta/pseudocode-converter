import { ParseResult } from '../types';
import { PATTERNS } from '../patterns';

export const classConverter = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.CLASS);
  return m 
    ? { code: `${i}CLASS ${m[1]}`, block: 'class', changed: true }
    : { code: '', block: null, changed: false };
};
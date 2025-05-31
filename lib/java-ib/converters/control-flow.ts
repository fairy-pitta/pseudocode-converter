import { ParseResult } from '../types';
import { PATTERNS } from '../patterns';
import { cond } from '../utils';

export const ifBlock = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.IF);
  return m 
    ? { code: `${i}IF ${cond(m[1])} THEN`, block: 'if', changed: true }
    : { code: '', block: null, changed: false };
};

export const elifBlock = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.ELIF);
  return m 
    ? { code: `${i}ELSE IF ${cond(m[1])} THEN`, block: 'elif', changed: true }
    : { code: '', block: null, changed: false };
};

export const elifOnlyBlock = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.ELIF_ONLY);
  return m 
    ? { code: `${i}ELSE IF ${cond(m[1])} THEN`, block: 'elif', changed: true }
    : { code: '', block: null, changed: false };
};

export const elseBlock = (s: string, i: string): ParseResult => {
  return PATTERNS.ELSE.test(s) 
    ? { code: `${i}ELSE`, block: 'else', changed: true }
    : { code: '', block: null, changed: false };
};

export const elseOnlyBlock = (s: string, i: string): ParseResult => {
  return PATTERNS.ELSE_ONLY.test(s) 
    ? { code: `${i}ELSE`, block: 'else', changed: true }
    : { code: '', block: null, changed: false };
};

export const forCount = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.FOR_COUNT);
  if (!m) return { code: '', block: null, changed: false };
  
  const start = +m[2];
  const operator = m[3];
  const endValue = m[4];
  
  // Check if endValue is a number or variable
  const isNumber = /^\d+$/.test(endValue);
  let end: string;
  
  if (isNumber) {
    const endNum = +endValue;
    end = endNum.toString(); // FOR ... TO ... DO includes the end value
  } else {
    // For variables, keep the variable name as is
    end = endValue;
  }
  
  return {
    code: `${i}FOR ${m[1]} FROM ${start} TO ${end} DO`,
    block: 'for',
    changed: true
  };
};

export const forEach = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.FOR_EACH);
  return m 
    ? { code: `${i}FOR EACH ${m[1]} IN ${m[2]} DO`, block: 'for', changed: true }
    : { code: '', block: null, changed: false };
};

export const whileBlock = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.WHILE);
  return m 
    ? { code: `${i}WHILE ${cond(m[1])} DO`, block: 'while', changed: true }
    : { code: '', block: null, changed: false };
};

export const doBlock = (s: string, i: string): ParseResult => {
  return PATTERNS.DO.test(s) 
    ? { code: `${i}REPEAT`, block: 'repeat', changed: true }
    : { code: '', block: null, changed: false };
};

export const doWhileBlock = doBlock;

export const tryBlock = (s: string, i: string): ParseResult => {
  return PATTERNS.TRY.test(s) 
    ? { code: `${i}TRY`, block: 'try', changed: true }
    : { code: '', block: null, changed: false };
};

export const catchBlock = (s: string, i: string): ParseResult => {
  const m = s.match(PATTERNS.CATCH);
  return m 
    ? { code: `${i}CATCH ${m[1]}`, block: 'catch', changed: true }
    : { code: '', block: null, changed: false };
};

export const finallyBlock = (s: string, i: string): ParseResult => {
  return PATTERNS.FINALLY.test(s) 
    ? { code: `${i}FINALLY`, block: 'finally', changed: true }
    : { code: '', block: null, changed: false };
};

export const controlFlowConverters = {
  ifBlock,
  elifBlock,
  elifOnlyBlock,
  elseBlock,
  elseOnlyBlock,
  forCount,
  forEach,
  whileBlock,
  doBlock,
  doWhileBlock,
  tryBlock,
  catchBlock,
  finallyBlock,
};
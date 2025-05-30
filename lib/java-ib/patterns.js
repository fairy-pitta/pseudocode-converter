"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATTERNS = void 0;
exports.PATTERNS = {
    CLASS: /^(?:public\s+)?class\s+(\w+)/,
    METHOD: /^(?:public|private)?\s*(static\s+)?(void|int|double|boolean|String|float|long|byte|char)\s+(\w+)\(([^)]*)\)\s*\{/,
    IF: /^if\s*\((.+)\)\s*\{/,
    ELIF: /^(?:\}\s*)?else\s+if\s*\((.+)\)\s*\{/,
    ELIF_ONLY: /^else\s+if\s*\((.+)\)\s*\{/,
    ELSE: /^(?:\}\s*)?else\s*\{/,
    ELSE_ONLY: /^else\s*\{/,
    FOR_COUNT: /^for\s*\((?:int|long|byte)\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*(<|<=)\s*(\w+|\d+)\s*;\s*\1\+\+\)\s*\{/,
    FOR_EACH: /^for\s*\((\w+)\s*:\s*(\w+)\)\s*\{/,
    WHILE: /^while\s*\((.+)\)\s*\{/,
    DO: /^do\s*\{/,
    TRY: /^try\s*\{/,
    CATCH: /^catch\s*\(([^\s]+)\s+(\w+)\)\s*\{/,
    FINALLY: /^finally\s*\{/,
    RETURN: /^return\s*(.*);/,
    PRINT: /^System\.out\.(?:println|print)\((.*?)\);?$/,
    INPUT: /^(\w+)\s*=\s*(\w+)\.(nextInt|nextDouble|nextLine|nextBoolean|nextFloat|nextLong|nextByte)\(\);/,
    CONST_DECL: /^final\s+(int|double|boolean|String|float|char|long|byte)\s+(\w+)\s*=\s*([^;]+);/,
    VAR_DECL: /^(int|double|boolean|String|float|char|long|byte)\s+(\w+)(?:\s*=\s*([^;]+))?;/,
    ARRAY_LIT: /^([\w<>]+)\[\]\s+(\w+)\s*=\s*\{([^}]*)\};/,
    ARRAY_SIZED: /^([\w<>]+)\[\]\s+(\w+)\s*=\s*new\s+\1\[(\d+)\];/,
    ASSIGN: /^([A-Za-z_]\w*)\s*=\s*([^=].*);/,
    MATH_EXPR: /^(\w+)\s*=\s*Math\.(pow|sqrt|abs|floor|ceil|round)\(([^)]+)\);/,
    COMP_ASSIGN: /^(\w+)\s*(\+=|\-=|\*=|\/=|%=)\s*([^;]+);/,
    ARRAY_DECL: /^([\w<>]+)\[\]\s+(\w+)\s*=\s*(?:\{([^}]*)\}|new\s+\1\[(\d+)\]);/,
};

// トークンの種類を定義
export enum TokenType {
  // 基本的なリテラル
  NUMBER,        // 数値リテラル
  STRING,        // 文字列リテラル
  TRUE,          // true
  FALSE,         // false
  IDENTIFIER,    // 識別子（変数名など）
  
  // 演算子
  PLUS,          // +
  MINUS,         // -
  STAR,          // *
  SLASH,         // /
  PERCENT,       // %
  EQUAL,         // =
  EQUAL_EQUAL,   // ==
  NOT_EQUAL,     // !=
  LESS,          // <
  LESS_EQUAL,    // <=
  GREATER,       // >
  GREATER_EQUAL, // >=
  AND,           // &&
  OR,            // ||
  NOT,           // !
  
  // 括弧
  LEFT_PAREN,    // 左括弧 (
  RIGHT_PAREN,   // 右括弧 )
  LEFT_BRACE,    // 左波括弧 {
  RIGHT_BRACE,   // 右波括弧 }
  
  // キーワード
  IF,            // if
  ELSE,          // else
  FOR,           // for
  WHILE,         // while
  
  // 区切り文字
  SEMICOLON,     // セミコロン ;
  COMMA,         // カンマ ,
  DOT,           // ドット .
  
  // 終端
  EOF            // 終端
}

// トークンを表すクラス
export class Token {
  constructor(
    public type: TokenType,
    public value: string,
    public position: number
  ) {}

  toString(): string {
    return `Token(${TokenType[this.type]}, '${this.value}', ${this.position})`;
  }
}

// 演算子の優先順位を定義
export const OPERATOR_PRECEDENCE: Record<string, number> = {
  '!': 7,  // 単項NOT
  '*': 6,  // 乗算
  '/': 6,  // 除算
  '%': 6,  // 剰余
  '+': 5,  // 加算
  '-': 5,  // 減算
  '<': 4,  // 小なり
  '>': 4,  // 大なり
  '<=': 4, // 以下
  '>=': 4, // 以上
  '==': 3, // 等しい
  '!=': 3, // 等しくない
  '&&': 2, // 論理AND
  '||': 1, // 論理OR
};

// トークナイザークラス
export class Tokenizer {
  private input: string;
  private position: number = 0;
  private currentChar: string | null = null;

  constructor(input: string) {
    this.input = input;
    if (input.length > 0) {
      this.currentChar = input[0];
    } else {
      this.currentChar = null;
    }
  }

  // 次の文字に進む
  private advance(): void {
    this.position++;
    if (this.position < this.input.length) {
      this.currentChar = this.input[this.position];
    } else {
      this.currentChar = null;
    }
  }

  // 現在の文字を見る（進まない）
  private peek(): string | null {
    const peekPos = this.position + 1;
    if (peekPos >= this.input.length) {
      return null;
    }
    return this.input[peekPos];
  }

  // 空白をスキップ
  private skipWhitespace(): void {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  // 数値を解析
  private number(): Token {
    let result = '';
    const startPos = this.position;

    while (this.currentChar !== null && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    // 小数点以下の処理
    if (this.currentChar === '.' && this.peek() !== null && /\d/.test(this.peek()!)) {
      result += this.currentChar; // 小数点を追加
      this.advance();

      while (this.currentChar !== null && /\d/.test(this.currentChar)) {
        result += this.currentChar;
        this.advance();
      }
    }

    return new Token(TokenType.NUMBER, result, startPos);
  }

  // 識別子または予約語を解析
  private identifier(): Token {
    let result = '';
    const startPos = this.position;

    while (
      this.currentChar !== null &&
      /[a-zA-Z0-9_]/.test(this.currentChar)
    ) {
      result += this.currentChar;
      this.advance();
    }

    // キーワードのチェック
    switch (result.toLowerCase()) {
      case 'true':
        return new Token(TokenType.TRUE, result, startPos);
      case 'false':
        return new Token(TokenType.FALSE, result, startPos);
      case 'if':
        return new Token(TokenType.IF, result, startPos);
      case 'else':
        return new Token(TokenType.ELSE, result, startPos);
      case 'for':
        return new Token(TokenType.FOR, result, startPos);
      case 'while':
        return new Token(TokenType.WHILE, result, startPos);
      default:
        return new Token(TokenType.IDENTIFIER, result, startPos);
    }
  }

  // 文字列リテラルを解析
  private string(): Token {
    let result = '';
    const startPos = this.position;
    
    // 開始の引用符をスキップ
    this.advance();
    
    while (this.currentChar !== null && this.currentChar !== '"') {
      // エスケープシーケンスの処理
      if (this.currentChar === '\\' && this.peek() !== null) {
        this.advance(); // バックスラッシュをスキップ
        
        // エスケープシーケンスの処理
        if (this.currentChar !== null) {
          const char = this.currentChar as string;
          switch (char) {
            case 'n': result += '\n'; break;
            case 't': result += '\t'; break;
            case 'r': result += '\r'; break;
            case '"': result += '"'; break;
            case '\\': result += '\\'; break;
            default: result += char; // 未知のエスケープシーケンス
          }
        }
      } else {
        result += this.currentChar;
      }
      
      this.advance();
    }
    
    // 終了の引用符をスキップ
    if (this.currentChar === '"') {
      this.advance();
    }
    
    return new Token(TokenType.STRING, result, startPos);
  }

  // 演算子を解析
  private operator(): Token {
    const startPos = this.position;
    let value = this.currentChar!;
    let type: TokenType;
    
    // 複合演算子のチェック
    if (this.currentChar === '=' && this.peek() === '=') {
      value += this.peek();
      this.advance();
      this.advance();
      type = TokenType.EQUAL_EQUAL;
    } else if (this.currentChar === '!' && this.peek() === '=') {
      value += this.peek();
      this.advance();
      this.advance();
      type = TokenType.NOT_EQUAL;
    } else if (this.currentChar === '<' && this.peek() === '=') {
      value += this.peek();
      this.advance();
      this.advance();
      type = TokenType.LESS_EQUAL;
    } else if (this.currentChar === '>' && this.peek() === '=') {
      value += this.peek();
      this.advance();
      this.advance();
      type = TokenType.GREATER_EQUAL;
    } else if (this.currentChar === '&' && this.peek() === '&') {
      value += this.peek();
      this.advance();
      this.advance();
      type = TokenType.AND;
    } else if (this.currentChar === '|' && this.peek() === '|') {
      value += this.peek();
      this.advance();
      this.advance();
      type = TokenType.OR;
    } else {
      // 単一の演算子
      switch (this.currentChar) {
        case '+':
          type = TokenType.PLUS;
          break;
        case '-':
          type = TokenType.MINUS;
          break;
        case '*':
          type = TokenType.STAR;
          break;
        case '/':
          type = TokenType.SLASH;
          break;
        case '%':
          type = TokenType.PERCENT;
          break;
        case '=':
          type = TokenType.EQUAL;
          break;
        case '<':
          type = TokenType.LESS;
          break;
        case '>':
          type = TokenType.GREATER;
          break;
        case '!':
          type = TokenType.NOT;
          break;
        default:
          throw new Error(`Unknown operator: ${this.currentChar}`);
      }
      this.advance();
    }
    
    return new Token(type, value, startPos);
  }

  // 次のトークンを取得
  public getNextToken(): Token {
    while (this.currentChar !== null) {
      // 空白をスキップ
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      // 数値
      if (/\d/.test(this.currentChar)) {
        return this.number();
      }

      // 識別子
      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.identifier();
      }

      // 文字列リテラル
      if (this.currentChar === '"') {
        return this.string();
      }

      // 括弧
      if (this.currentChar === '(') {
        const token = new Token(TokenType.LEFT_PAREN, '(', this.position);
        this.advance();
        return token;
      }

      if (this.currentChar === ')') {
        const token = new Token(TokenType.RIGHT_PAREN, ')', this.position);
        this.advance();
        return token;
      }

      if (this.currentChar === '{') {
        const token = new Token(TokenType.LEFT_BRACE, '{', this.position);
        this.advance();
        return token;
      }

      if (this.currentChar === '}') {
        const token = new Token(TokenType.RIGHT_BRACE, '}', this.position);
        this.advance();
        return token;
      }

      // 区切り文字
      if (this.currentChar === ';') {
        const token = new Token(TokenType.SEMICOLON, ';', this.position);
        this.advance();
        return token;
      }

      if (this.currentChar === ',') {
        const token = new Token(TokenType.COMMA, ',', this.position);
        this.advance();
        return token;
      }

      if (this.currentChar === '.') {
        const token = new Token(TokenType.DOT, '.', this.position);
        this.advance();
        return token;
      }

      // 演算子
      if (/[+\-*/%=!<>&|]/.test(this.currentChar)) {
        return this.operator();
      }

      throw new Error(`Unexpected character: ${this.currentChar} at position ${this.position}`);
    }

    // 入力の終わり
    return new Token(TokenType.EOF, '', this.position);
  }

  // すべてのトークンを取得
  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.getNextToken();
    
    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }
    
    tokens.push(token); // EOFトークンも追加
    return tokens;
  }
}
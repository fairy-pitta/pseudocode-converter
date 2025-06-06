import { Token, TokenType, OPERATOR_PRECEDENCE } from './tokenizer';

// ASTノードの種類を定義
export enum NodeType {
  // 式（Expression）ノード
  BINARY_OPERATION,  // 二項演算
  UNARY_OPERATION,   // 単項演算
  NUMBER,           // 数値リテラル
  STRING,           // 文字列リテラル
  BOOLEAN,          // 真偽値リテラル
  IDENTIFIER,       // 識別子
  GROUP,            // 括弧でグループ化された式
  
  // 文（Statement）ノード
  PROGRAM,          // プログラム全体
  VARIABLE_DECLARATION, // 変数宣言
  ASSIGNMENT,       // 代入
  IF_STATEMENT,     // if文
  FOR_LOOP,         // forループ
  WHILE_LOOP,       // whileループ
  BLOCK,            // ブロック
  PRINT_STATEMENT,  // System.out.println文
  EXPRESSION_STATEMENT, // 式文
}

// ASTノードの基本インターフェース
export interface ASTNode {
  type: NodeType;
}

// 二項演算ノード
export interface BinaryOperationNode extends ASTNode {
  type: NodeType.BINARY_OPERATION;
  left: ASTNode;
  operator: string;
  right: ASTNode;
}

// 単項演算ノード
export interface UnaryOperationNode extends ASTNode {
  type: NodeType.UNARY_OPERATION;
  operator: string;
  operand: ASTNode;
}

// 数値リテラルノード
export interface NumberNode extends ASTNode {
  type: NodeType.NUMBER;
  value: number;
}

// 文字列リテラルノード
export interface StringNode extends ASTNode {
  type: NodeType.STRING;
  value: string;
}

// 真偽値リテラルノード
export interface BooleanNode extends ASTNode {
  type: NodeType.BOOLEAN;
  value: boolean;
}

// 識別子ノード
export interface IdentifierNode extends ASTNode {
  type: NodeType.IDENTIFIER;
  name: string;
}

// グループ化された式ノード
export interface GroupNode extends ASTNode {
  type: NodeType.GROUP;
  expression: ASTNode;
}

// プログラム全体ノード
export interface ProgramNode extends ASTNode {
  type: NodeType.PROGRAM;
  statements: ASTNode[];
}

// 変数宣言ノード
export interface VariableDeclarationNode extends ASTNode {
  type: NodeType.VARIABLE_DECLARATION;
  dataType: string;
  identifier: string;
  initialValue?: ASTNode;
}

// 代入ノード
export interface AssignmentNode extends ASTNode {
  type: NodeType.ASSIGNMENT;
  identifier: string;
  value: ASTNode;
}

// if文ノード
export interface IfStatementNode extends ASTNode {
  type: NodeType.IF_STATEMENT;
  condition: ASTNode;
  thenBlock: ASTNode;
  elseBlock?: ASTNode;
}

// forループノード
export interface ForLoopNode extends ASTNode {
  type: NodeType.FOR_LOOP;
  initialization?: ASTNode;
  condition?: ASTNode;
  increment?: ASTNode;
  body: ASTNode;
}

// whileループノード
export interface WhileLoopNode extends ASTNode {
  type: NodeType.WHILE_LOOP;
  condition: ASTNode;
  body: ASTNode;
}

// ブロックノード
export interface BlockNode extends ASTNode {
  type: NodeType.BLOCK;
  statements: ASTNode[];
}

// System.out.println文ノード
export interface PrintStatementNode extends ASTNode {
  type: NodeType.PRINT_STATEMENT;
  expression: ASTNode;
}

// 式文ノード
export interface ExpressionStatementNode extends ASTNode {
  type: NodeType.EXPRESSION_STATEMENT;
  expression: ASTNode;
}

export class Parser {
  private tokens: Token[];
  private current: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  // 現在のトークンを取得
  private peek(): Token {
    return this.tokens[this.current];
  }

  // 現在のトークンを消費して次に進む
  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  // 前のトークンを取得
  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  // トークン列の終端に達したかチェック
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  // 指定されたトークンタイプと一致するかチェック
  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  // 指定されたトークンタイプのいずれかと一致するかチェック
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  // 指定されたトークンタイプを消費する（エラーハンドリング付き）
  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }
    throw new Error(message);
  }

  // プログラム全体をパースするエントリーポイント
  public parseProgram(): ProgramNode {
    const statements: ASTNode[] = [];
    
    while (!this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    return {
      type: NodeType.PROGRAM,
      statements
    };
  }

  // 文をパース
  private parseStatement(): ASTNode | null {
    try {
      if (this.check(TokenType.IF)) {
        return this.parseIfStatement();
      }
      
      if (this.check(TokenType.FOR)) {
        return this.parseForLoop();
      }
      
      if (this.check(TokenType.WHILE)) {
        return this.parseWhileLoop();
      }
      
      if (this.check(TokenType.LEFT_BRACE)) {
        return this.parseBlock();
      }
      
      // System.out.println の処理
      if (this.check(TokenType.IDENTIFIER) && this.peek().value === 'System') {
        return this.parsePrintStatement();
      }
      
      // 変数宣言または代入の処理
      if (this.check(TokenType.IDENTIFIER)) {
        return this.parseVariableOrAssignment();
      }
      
      // 式文
      const expr = this.parseExpression();
      this.consumeSemicolon();
      return {
        type: NodeType.EXPRESSION_STATEMENT,
        expression: expr
      } as ExpressionStatementNode;
    } catch (error) {
      // エラーが発生した場合、次のセミコロンまでスキップ
      this.synchronize();
      return null;
    }
  }

  // if文のパース
  private parseIfStatement(): IfStatementNode {
    this.advance(); // 'if' を消費
    
    if (!this.match(TokenType.LEFT_PAREN)) {
      throw new Error('Expected "(" after "if"');
    }
    
    const condition = this.parseExpression();
    
    if (!this.match(TokenType.RIGHT_PAREN)) {
      throw new Error('Expected ")" after if condition');
    }
    
    const thenBlock = this.parseStatement();
    let elseBlock: ASTNode | undefined;
    
    if (this.match(TokenType.ELSE)) {
      const elseStmt = this.parseStatement();
      elseBlock = elseStmt || undefined;
    }
    
    return {
      type: NodeType.IF_STATEMENT,
      condition,
      thenBlock: thenBlock!,
      elseBlock
    };
  }

  // forループのパース
  private parseForLoop(): ForLoopNode {
    this.advance(); // 'for' を消費
    
    if (!this.match(TokenType.LEFT_PAREN)) {
      throw new Error('Expected "(" after "for"');
    }
    
    // 初期化部分
    let initialization: ASTNode | undefined;
    if (!this.check(TokenType.SEMICOLON)) {
      initialization = this.parseVariableOrAssignment();
    } else {
      this.advance(); // セミコロンを消費
    }
    
    // 条件部分
    let condition: ASTNode | undefined;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.parseExpression();
    }
    if (!this.match(TokenType.SEMICOLON)) {
      throw new Error('Expected ";" after for condition');
    }
    
    // 更新部分
    let increment: ASTNode | undefined;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.parseExpression();
    }
    
    if (!this.match(TokenType.RIGHT_PAREN)) {
      throw new Error('Expected ")" after for clauses');
    }
    
    const body = this.parseStatement();
    
    return {
      type: NodeType.FOR_LOOP,
      initialization,
      condition,
      increment,
      body: body!
    };
  }

  // whileループのパース
  private parseWhileLoop(): WhileLoopNode {
    this.advance(); // 'while' を消費
    
    if (!this.match(TokenType.LEFT_PAREN)) {
      throw new Error('Expected "(" after "while"');
    }
    
    const condition = this.parseExpression();
    
    if (!this.match(TokenType.RIGHT_PAREN)) {
      throw new Error('Expected ")" after while condition');
    }
    
    const body = this.parseStatement();
    
    return {
      type: NodeType.WHILE_LOOP,
      condition,
      body: body!
    };
  }

  // ブロックのパース
  private parseBlock(): BlockNode {
    this.advance(); // '{' を消費
    
    const statements: ASTNode[] = [];
    
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    if (!this.match(TokenType.RIGHT_BRACE)) {
      throw new Error('Expected "}" after block');
    }
    
    return {
      type: NodeType.BLOCK,
      statements
    };
  }

  // System.out.println文のパース
  private parsePrintStatement(): PrintStatementNode {
    this.advance(); // 'System' を消費
    
    if (!this.match(TokenType.DOT)) {
      throw new Error('Expected "." after "System"');
    }
    
    if (!this.match(TokenType.IDENTIFIER) || this.previous().value !== 'out') {
      throw new Error('Expected "out" after "System."');
    }
    
    if (!this.match(TokenType.DOT)) {
      throw new Error('Expected "." after "out"');
    }
    
    if (!this.match(TokenType.IDENTIFIER) || this.previous().value !== 'println') {
      throw new Error('Expected "println" after "out."');
    }
    
    if (!this.match(TokenType.LEFT_PAREN)) {
      throw new Error('Expected "(" after "println"');
    }
    
    const expression = this.parseExpression();
    
    if (!this.match(TokenType.RIGHT_PAREN)) {
      throw new Error('Expected ")" after println argument');
    }
    
    this.consumeSemicolon();
    
    return {
      type: NodeType.PRINT_STATEMENT,
      expression
    };
  }

  // 変数宣言または代入のパース
  private parseVariableOrAssignment(): ASTNode {
    const currentToken = this.peek();

    // Check if the identifier is a type keyword for declaration
    if (currentToken.type === TokenType.IDENTIFIER && 
        (currentToken.value === 'int' || currentToken.value === 'String' || currentToken.value === 'boolean')) {
      // Variable Declaration with an explicit type
      const dataType = this.advance().value; // Consume the type keyword (e.g., 'int', 'String')
      
      const identifierToken = this.consume(TokenType.IDENTIFIER, `Expected variable name after type ${dataType}.`);
      const identifier = identifierToken.value;
      
      let initialValue: ASTNode | undefined;
      if (this.match(TokenType.EQUAL)) {
        initialValue = this.parseExpression();
      }
      
      this.consumeSemicolon();
      
      return {
        type: NodeType.VARIABLE_DECLARATION,
        dataType, // Store the actual type
        identifier,
        initialValue
      } as VariableDeclarationNode;

    } else if (currentToken.type === TokenType.IDENTIFIER) {
      // Assignment (identifier = expression)
      // This assumes if it's an identifier and not a type, and followed by '=', it's an assignment.
      // If not followed by '=', parseStatement's catch block and subsequent parseExpression will handle it.
      const identifier = this.advance().value; // Consume the identifier

      this.consume(TokenType.EQUAL, `Expected '=' after identifier '${identifier}' for assignment.`);
      const value = this.parseExpression();
      this.consumeSemicolon();
      return {
        type: NodeType.ASSIGNMENT,
        identifier,
        value
      } as AssignmentNode;
    } else {
      // Should not be reached if parseStatement checks for IDENTIFIER before calling
      throw new Error(`Expected type keyword or identifier for variable/assignment, got ${currentToken.type}`);
    }
  }

  // セミコロンを消費（オプション）
  private consumeSemicolon(): void {
    this.match(TokenType.SEMICOLON);
  }

  // エラー回復のための同期
  private synchronize(): void {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;
      
      switch (this.peek().type) {
        case TokenType.IF:
        case TokenType.FOR:
        case TokenType.WHILE:
          return;
      }
      
      this.advance();
    }
  }

  // 式をパースするエントリーポイント
  public parseExpression(): ASTNode {
    return this.logicalOr(); // Changed from this.equality()
  }

  // 論理OR演算子の処理
  private logicalOr(): ASTNode {
    let expr = this.logicalAnd();

    while (this.match(TokenType.OR)) { // TokenType.OR を使用
      const operator = this.previous().value;
      const right = this.logicalAnd();
      expr = {
        type: NodeType.BINARY_OPERATION,
        left: expr,
        operator,
        right
      } as BinaryOperationNode;
    }

    return expr;
  }

  // 論理AND演算子の処理
  private logicalAnd(): ASTNode {
    let expr = this.equality();

    while (this.match(TokenType.AND)) { // TokenType.AND を使用
      const operator = this.previous().value;
      const right = this.equality();
      expr = {
        type: NodeType.BINARY_OPERATION,
        left: expr,
        operator,
        right
      } as BinaryOperationNode;
    }

    return expr;
  }

  // 等価演算子の処理
  private equality(): ASTNode {
    let expr = this.comparison();

    while (this.match(TokenType.EQUAL_EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous().value;
      const right = this.comparison();
      expr = {
        type: NodeType.BINARY_OPERATION,
        left: expr,
        operator,
        right
      } as BinaryOperationNode;
    }

    return expr;
  }

  // 比較演算子の処理
  private comparison(): ASTNode {
    let expr = this.term();

    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this.previous().value;
      const right = this.term();
      expr = {
        type: NodeType.BINARY_OPERATION,
        left: expr,
        operator,
        right
      } as BinaryOperationNode;
    }

    return expr;
  }

  // 加算・減算の処理
  private term(): ASTNode {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous().value;
      const right = this.factor();
      expr = {
        type: NodeType.BINARY_OPERATION,
        left: expr,
        operator,
        right
      } as BinaryOperationNode;
    }

    return expr;
  }

  // 乗算・除算の処理
  private factor(): ASTNode {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR, TokenType.PERCENT)) {
      const operator = this.previous().value;
      const right = this.unary();
      expr = {
        type: NodeType.BINARY_OPERATION,
        left: expr,
        operator,
        right
      } as BinaryOperationNode;
    }

    return expr;
  }

  // 単項演算子の処理
  private unary(): ASTNode {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.previous().value;
      const operand = this.unary();
      return {
        type: NodeType.UNARY_OPERATION,
        operator,
        operand
      } as UnaryOperationNode;
    }

    return this.primary();
  }

  // 基本要素の処理
  private primary(): ASTNode {
    // true/false
    if (this.match(TokenType.TRUE)) {
      return {
        type: NodeType.BOOLEAN,
        value: true
      } as BooleanNode;
    }
    if (this.match(TokenType.FALSE)) {
      return {
        type: NodeType.BOOLEAN,
        value: false
      } as BooleanNode;
    }

    // 数値
    if (this.check(TokenType.NUMBER)) {
      const token = this.advance();
      return {
        type: NodeType.NUMBER,
        value: parseFloat(token.value)
      } as NumberNode;
    }

    // 文字列
    if (this.check(TokenType.STRING)) {
      const token = this.advance();
      return {
        type: NodeType.STRING,
        value: token.value
      } as StringNode;
    }

    // 識別子
    if (this.check(TokenType.IDENTIFIER)) {
      const token = this.advance();
      return {
        type: NodeType.IDENTIFIER,
        name: token.value
      } as IdentifierNode;
    }

    // 括弧でグループ化された式
    if (this.match(TokenType.LEFT_PAREN)) {
      const expression = this.parseExpression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
      return {
        type: NodeType.GROUP,
        expression
      } as GroupNode;
    }

    throw new Error(`Unexpected token: ${this.peek().value}`);
  }
}
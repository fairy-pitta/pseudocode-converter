import { createVisitor, ParseTree, Visitor, ConcreteVisitor } from 'java-ast';
import {
  CompilationUnitContext,
  ClassDeclarationContext,
  MethodDeclarationContext,
  BlockContext,
  StatementContext,
  MethodCallContext,
  ExpressionContext,
  LiteralContext,
  IdentifierContext,
  ParExpressionContext,
  LocalVariableDeclarationContext
} from 'java-ast';

// IB擬似コードへの変換器クラス
export class Transformer {
  // ASTノードをIB擬似コードに変換するエントリーポイント
  public transform(node: ParseTree): string {
    const indent = (text: string): string => {
      return text
        .split("\n")
        .map(line => (line ? "  " + line : line))
        .join("\n");
    };

    const visitor: ConcreteVisitor<string> = createVisitor<string>({
      visitCompilationUnit: (ctx: CompilationUnitContext) => {
      const types = ctx.typeDeclaration();
      return types.map(type => type.accept(visitor)).join('\n');
    },
      visitClassDeclaration: (ctx: ClassDeclarationContext) => {
         const className = ctx.identifier().text;
         const methods = ctx.classBody().classBodyDeclaration();
         const methodsCode = methods
           .filter(decl => decl.memberDeclaration()?.methodDeclaration())
           .map(decl => decl.memberDeclaration()!.methodDeclaration()!.accept(visitor))
           .join('\n\n');
         
         return `クラス ${className}:\n${indent(methodsCode)}`;
       },
      visitMethodDeclaration: (ctx: MethodDeclarationContext) => {
         const methodName = ctx.identifier().text;
         const params = ctx.formalParameters().formalParameterList();
         const paramList = params ? 
           params.formalParameter().map(p => p.variableDeclaratorId().text).join(', ') : 
           '';
         
         const body = ctx.methodBody()?.block();
         const bodyCode = body ? body.accept(visitor) : '';
         
         return `メソッド ${methodName}(${paramList}):\n${indent(bodyCode)}`;
       },

       visitBlock: (ctx: BlockContext) => {
         const statements = ctx.blockStatement();
         return statements.map(stmt => stmt.accept(visitor)).join('\n');
       },
      visitLocalVariableDeclaration: (ctx: LocalVariableDeclarationContext) => {
         const typeType = ctx.typeType();
         const type = typeType ? typeType.text : 'unknown';
         const variableDeclarators = ctx.variableDeclarators();
         if (!variableDeclarators) return '';
         const declarators = variableDeclarators.variableDeclarator();
         return declarators.map(decl => {
           const name = decl.variableDeclaratorId().text;
           const init = decl.variableInitializer();
           if (init) {
             const value: string = init.accept(visitor);
             return `${name} = ${value}`;
           }
           return `${name}を宣言`;
         }).join('\n');
       },

    visitStatement: (ctx: StatementContext) => {
      if (ctx.IF()) {
        const parExpr = ctx.parExpression();
        if (!parExpr) return '';
        const condition: string = parExpr.accept(visitor);
        const statements = ctx.statement();
        if (statements.length === 0) return '';
        const thenStmt: string = statements[0].accept(visitor);
        const elseStmt = statements.length > 1 ? statements[1].accept(visitor) : null;
        
        let result = `もし ${condition} なら:\n${indent(thenStmt)}`;
        if (elseStmt) {
          result += `\nそうでなければ:\n${indent(elseStmt)}`;
        }
        return result;
      } else if (ctx.FOR()) {
        // FOR文の処理は簡略化
        const statements = ctx.statement();
        if (statements.length === 0) return '';
        const body: string = statements[0].accept(visitor);
        return `繰り返し:\n${indent(body)}`;
      } else if (ctx.WHILE()) {
        const parExpr = ctx.parExpression();
        if (!parExpr) return '';
        const condition: string = parExpr.accept(visitor);
        const statements = ctx.statement();
        if (statements.length === 0) return '';
        const body: string = statements[0].accept(visitor);
        
        return `${condition}の間繰り返し:\n${indent(body)}`;
      } else if (ctx.expression()) {
        const expressions = ctx.expression();
        if (expressions && expressions.length > 0) {
            return expressions[0].accept(visitor);
        }
        return '';
      }
      return '';
    },
      visitMethodCall: (ctx: MethodCallContext) => {
        const identifier = ctx.identifier();
        const methodName = identifier ? identifier.text : '';
        if (methodName === 'println') {
          const args = ctx.arguments().expressionList();
          if (args) {
            const expressions = args.expression();
            const argList = expressions.map(expr => expr.accept(visitor)).join(', ');
            return `output ${argList}`;
          }
          return 'output';
        }
        // その他のメソッド呼び出しは、関数呼び出しとして変換
        const args = ctx.arguments().expressionList();
        const argList = args ? args.expression().map(expr => expr.accept(visitor)).join(', ') : '';
        return `${methodName.toUpperCase()}(${argList})`;
      },
      visitExpression: (ctx: ExpressionContext) => {
        // 代入式の処理
        if (ctx.ASSIGN && ctx.ASSIGN()) {
          const expressions = ctx.expression();
          if (expressions.length >= 2) {
            const left: string = expressions[0].accept(visitor);
            const right: string = expressions[1].accept(visitor);
            return `${left} <- ${right}`;
          }
        }
        
        // 算術演算子の処理
        const expressions = ctx.expression();
        if (expressions && expressions.length >= 2) {
          const left = expressions[0].accept(visitor);
          const right = expressions[1].accept(visitor);
          
          // 演算子を取得
          const text = ctx.text;
          if (text.includes('/')) {
            return `${left} div ${right}`;
          }
          if (text.includes('%')) {
            return `${left} mod ${right}`;
          }
          if (text.includes('+')) {
            return `${left} + ${right}`;
          }
          if (text.includes('-')) {
            return `${left} - ${right}`;
          }
          if (text.includes('*')) {
            return `${left} * ${right}`;
          }
        }
        
        // 単一の式の場合、テキストに演算子変換を適用
        let text = ctx.text;
        text = text.replace(/\//g, ' div ').replace(/%/g, ' mod ');
        if (text !== ctx.text) {
          return text;
        }
        
        // プライマリ式の処理
        if (ctx.primary()) {
          return ctx.primary()!.accept(visitor);
        }
        
        // メソッド呼び出しの処理
        if (ctx.methodCall()) {
          return ctx.methodCall()!.accept(visitor);
        }
        
        return ctx.text;
      },
      visitLiteral: (ctx: LiteralContext) => {
        const text = ctx.text;
        if (text === 'null') return 'NULL';
        if (text === 'true') return 'TRUE';
        if (text === 'false') return 'FALSE';
        if (text.startsWith('"') && text.endsWith('"')) {
          return text; // string literal
        }
        if (text.startsWith("'") && text.endsWith("'")) {
          return text; // char literal
        }
        return text; // number, etc.
      },
      visitIdentifier: (ctx: IdentifierContext) => {
        return ctx.text.toUpperCase();
      },
      visitParExpression: (ctx: ParExpressionContext) => {
        return `(${ctx.expression().accept(visitor)})`;
      },
      // デフォルトの結果を返すメソッド
      defaultResult: () => {
        return ''; // 未処理ノードは空文字列を返す
      },
      
      // 結果を集約するメソッド
      aggregateResult: (aggregate: string, nextResult: string) => {
        if (!aggregate) return nextResult;
        if (!nextResult) return aggregate;
        return aggregate + '\n' + nextResult;
      }
    });

    return node.accept(visitor);
  }

  private indent(text: string): string {
    return text
      .split("\n")
      .map(line => (line ? "  " + line : line))
      .join("\n");
  }
}
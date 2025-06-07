import { parse as parseJavaAst } from 'java-ast'; // java-astのparseをインポート
import * as util from 'util';
import { Transformer } from './transformer';
// import { Tokenizer } from './tokenizer'; // 元のTokenizerは不要になる可能性
// import { Parser } from './parser'; // 元のParserは不要になる可能性

/**
 * 複雑な式をIB擬似コードに変換するクラス
 * トークナイザー、パーサー、変換器を統合して使用する
 */
export class ExpressionParser {
  static parse(expression: string): string {
    console.log(`[ExpressionParser.parse] Parsing expression: ${expression}`);

    // Check for simple literals first
    if (/^\d+(\.\d+)?$/.test(expression)) { // Number literal
      return expression;
    }
    if (/^\"(?:[^\"\\]|\\.)*\"$/.test(expression)) { // String literal
      return expression;
    }
    if (expression.toLowerCase() === 'true') {
      return 'TRUE';
    }
    if (expression.toLowerCase() === 'false') {
      return 'FALSE';
    }

    try {
      // 式を一時的なJavaプログラムの文脈に配置して解析
      const wrappedExpression = `
        class Test {
          void method() {
            System.out.println(${expression});
          }
        }
      `;
      
      // java-ast を使用してプログラムを解析
      const ast = parseJavaAst(wrappedExpression);
      console.log('[ExpressionParser.parse] Raw AST from java-ast (wrapped with System.out.println):', util.inspect(ast, { showHidden: false, depth: 5, colors: false }));
      
      try {
        // ASTから式の部分を抽出 (ANTLR ASTナビゲーションを使用)
        console.log('[ExpressionParser.parse] Starting AST extraction (wrapped with System.out.println)...');
        const typeDeclaration = ast.typeDeclaration(0);
        if (!typeDeclaration) {
          throw new Error('Could not find typeDeclaration in AST');
        }
        
        const classDeclaration = typeDeclaration.classDeclaration();
        if (!classDeclaration) {
          throw new Error('Could not find classDeclaration in AST');
        }
        
        const classBody = classDeclaration.classBody();
        if (!classBody) {
          throw new Error('Could not find classBody in AST');
        }
        
        const classBodyDeclaration = classBody.classBodyDeclaration(0);
        if (!classBodyDeclaration) {
          throw new Error('Could not find classBodyDeclaration in AST');
        }
        
        const memberDeclaration = classBodyDeclaration.memberDeclaration(); // Assuming method is the first member
        if (!memberDeclaration) {
          throw new Error('Could not find memberDeclaration in AST');
        }
        
        const methodDeclaration = memberDeclaration.methodDeclaration();
        if (!methodDeclaration) {
          throw new Error('Could not find methodDeclaration in AST');
        }
        
        const methodBodyNode = methodDeclaration.methodBody();
        if (!methodBodyNode) {
          throw new Error('Could not find methodBody in AST');
        }
        
        const block = methodBodyNode.block();
        if (!block) {
          throw new Error('Could not find block in AST');
        }
        
        const blockStatement = block.blockStatement(0); // Assuming System.out.println is the first statement
        if (!blockStatement) {
          throw new Error('Could not find blockStatement in AST');
        }

        console.log('[ExpressionParser.parse] BlockStatement structure (wrapped with System.out.println):', util.inspect(blockStatement, { showHidden: false, depth: 5, colors: false }));

        let expressionAst: any;
        let statementExpression: any;

        // 新しいアプローチ: 発見された正しいAST構造に基づく
        // StatementContext → ExpressionContext → MethodCallContext → ArgumentsContext
        const statement = blockStatement.statement && blockStatement.statement();
        if (statement) {
          console.log('[ExpressionParser.parse] StatementContext found, searching for ExpressionContext');
          
          // StatementContextの子要素からExpressionContextを探す
          if ((statement as any).children) {
            for (let i = 0; i < (statement as any).children.length; i++) {
              const child = (statement as any).children[i];
              if (child.constructor.name === 'ExpressionContext') {
                console.log(`[ExpressionParser.parse] Found ExpressionContext at index ${i}`);
                
                // ExpressionContextの子要素からMethodCallContextを探す
                if ((child as any).children) {
                  for (let j = 0; j < (child as any).children.length; j++) {
                    const grandChild = (child as any).children[j];
                    if (grandChild.constructor.name === 'MethodCallContext') {
                      console.log(`[ExpressionParser.parse] Found MethodCallContext: "${grandChild.text}"`);
                      
                      // MethodCallContextの2番目の子要素がArgumentsContext
                      if ((grandChild as any).children && (grandChild as any).children.length > 1) {
                        const argumentsContext = (grandChild as any).children[1];
                        console.log(`[ExpressionParser.parse] ArgumentsContext: "${argumentsContext.text}"`);
                        
                        // ArgumentsContextから式を抽出
                        if (argumentsContext && typeof argumentsContext.expressionList === 'function') {
                          const expressionList = argumentsContext.expressionList();
                          if (expressionList && typeof expressionList.expression === 'function') {
                            const argExpression = expressionList.expression();
                            expressionAst = Array.isArray(argExpression) ? argExpression[0] : argExpression;
                            
                            console.log('[ExpressionParser.parse] Successfully extracted expression:');
                            console.log('[ExpressionParser.parse] text:', expressionAst ? expressionAst.text : 'undefined');
                            console.log('[ExpressionParser.parse] type:', expressionAst ? expressionAst.constructor.name : 'undefined');
                            break;
                          }
                        }
                      }
                    }
                  }
                }
                break;
              }
            }
          }
        }
          
        // フォールバック: 従来のロジック
        if (!expressionAst && statementExpression && typeof statementExpression.expression === 'function') {
          console.log('[ExpressionParser.parse] フォールバック: 従来のロジックを試行');
          const exprNode = statementExpression.expression();
          const methodInvocation = Array.isArray(exprNode) ? exprNode[0] : exprNode;
          if (methodInvocation && typeof methodInvocation.methodCall === 'function') {
            const methodCallResult = methodInvocation.methodCall();
            if (methodCallResult && typeof methodCallResult.arguments === 'function') {
              const argumentsResult = methodCallResult.arguments();
              if (argumentsResult && typeof argumentsResult.expressionList === 'function') {
                const expressionList = argumentsResult.expressionList();
                if (expressionList && typeof expressionList.expression === 'function') {
                  const argListExpression = expressionList.expression();
                  expressionAst = Array.isArray(argListExpression) ? argListExpression[0] : argListExpression;
                  console.log('[ExpressionParser.parse] Extracted expression from System.out.println wrapper (fallback):', util.inspect(expressionAst, { showHidden: false, depth: 5, colors: false }));
                }
              }
            }
          } else if (methodInvocation && typeof methodInvocation.primary === 'function') {
            // もし直接 primary() で式が取れる場合 (例: 単純なリテラルや変数)
            expressionAst = methodInvocation.primary(); 
            console.log('[ExpressionParser.parse] Extracted primary expression from System.out.println wrapper (fallback):', util.inspect(expressionAst, { showHidden: false, depth: 5, colors: false }));
          } else {
            // それでもダメなら、statementExpression.expression() 自体を試す
            expressionAst = statementExpression.expression();
            console.log('[ExpressionParser.parse] Fallback to statementExpression.expression() in System.out.println wrapper:', util.inspect(expressionAst, { showHidden: false, depth: 5, colors: false }));
          }
        }
        
        if (!expressionAst && (blockStatement as any)._statementExpression) {
          // こちらは blockStatement 直下に statementExpression がある場合 (以前のロジックに近い)
          console.log('[ExpressionParser.parse] Attempting to extract from direct statementExpression (should not happen with System.out.println wrapper)');
          const statementExpressionNode = (blockStatement as any)._statementExpression;
          if (statementExpressionNode && typeof statementExpressionNode.expression === 'function') {
            expressionAst = statementExpressionNode.expression();
            console.log('[ExpressionParser.parse] Extracted from direct statementExpression:', util.inspect(expressionAst, { showHidden: false, depth: 5, colors: false }));
          }
        }

        // 元の変数宣言からの抽出ロジックもフォールバックとして残す (ただし、ラップ方法が変わったので期待薄)
        if (!expressionAst && typeof (blockStatement as any).localVariableDeclaration === 'function') {
          console.log('[ExpressionParser.parse] Trying direct localVariableDeclaration (fallback)');
          const localVariableDeclaration = (blockStatement as any).localVariableDeclaration();
          if (localVariableDeclaration && typeof localVariableDeclaration.variableDeclarators === 'function') {
            const variableDeclarators = localVariableDeclaration.variableDeclarators();
            if (variableDeclarators && typeof variableDeclarators.variableDeclarator === 'function') {
              const variableDeclarator = variableDeclarators.variableDeclarator(0);
              if (variableDeclarator && typeof variableDeclarator.variableInitializer === 'function') {
                expressionAst = variableDeclarator.variableInitializer();
                console.log('[ExpressionParser.parse] Initializer result (fallback):', util.inspect(expressionAst, { showHidden: false, depth: 5, colors: false }));
              }
            }
          }
        } 

        console.log('[ExpressionParser.parse] Final expressionAst (wrapped with System.out.println):', util.inspect(expressionAst, { showHidden: false, depth: 5, colors: false }));

        if (!expressionAst) {
          throw new Error('Could not extract expression AST from the wrapped Java code.');
        }
        
        // 抽出した式のASTをIB擬似コードに変換
        console.log('[ExpressionParser.parse] Final AST before transformation (full depth):', util.inspect(expressionAst, { showHidden: false, depth: null, colors: false }));
        const transformer = new Transformer();
        const result = transformer.transform(expressionAst);
        console.log('[ExpressionParser.parse] Transformed result:', result);
        return result;
      } catch (error) {
        console.error(`[ExpressionParser.parse] Error during parsing expression: ${expression}`);
        console.error('[ExpressionParser.parse] Error details:', error);
        // エラーを再スローして、呼び出し元で処理できるようにする
        throw error;
      }
    } catch (outerError: any) {
      // この catch は parseJavaAst や、その前の処理でエラーが起きた場合
      console.error(`[ExpressionParser.parse] Error in outer try block for expression: ${expression}`);
      console.error('[ExpressionParser.parse] Outer error details:', outerError);
      // エラーを再スローして、呼び出し元で処理できるようにする
      throw outerError;
    }
  }

  /**
   * 条件式をIB擬似コードに変換する
   * 条件式は括弧で囲まれていることが多いため、括弧を取り除いて処理する
   * @param condition 変換する条件式
   * @returns IB擬似コード形式の条件式
   */
  public static parseCondition(condition: string): string {
    try {
      // 条件式が括弧で囲まれている場合は括弧を取り除く
      const trimmedCondition = condition.trim();
      if (trimmedCondition.startsWith('(') && trimmedCondition.endsWith(')')) {
        return this.parse(trimmedCondition.substring(1, trimmedCondition.length - 1));
      }
      
      return this.parse(trimmedCondition);
    } catch (error) {
      console.warn(`ExpressionParser.parseCondition failed for: ${condition}, using simple conversion`);
      // シンプルな変換を使用
      let result = condition.trim();
      if (result.startsWith('(') && result.endsWith(')')) {
        result = result.substring(1, result.length - 1);
      }
      // 変数名を大文字に変換
      result = result.replace(/\b[a-z][a-zA-Z0-9]*\b/g, match => match.toUpperCase());
      return result;
    }
  }
}
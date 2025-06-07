// Direct test for ExpressionParser using java-ast
import { parse } from 'java-ast';

console.log('=== ExpressionParser Direct Test ===');
console.log('Testing java-ast package...');

// Test basic Java parsing
const testCode = `
class Test {
    public static void main(String[] args) {
        System.out.println((p == q));
    }
}
`;

try {
    console.log('\nParsing test Java code...');
    const ast = parse(testCode);
    console.log('AST parsed successfully');
    console.log('AST type:', ast.constructor.name);
    
    // Navigate through the AST structure
    if (ast.children && ast.children.length > 0) {
        console.log('\nAST children count:', ast.children.length);
        
        // Print all top-level children
        ast.children.forEach((child, index) => {
            console.log(`Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
        });
        
        // Look for type declaration (which contains class declaration)
        const typeDecl = ast.children.find(child => 
            child.constructor.name === 'TypeDeclarationContext'
        );
        
        if (typeDecl) {
            console.log('\nFound TypeDeclarationContext');
            console.log('TypeDecl children count:', typeDecl.children ? typeDecl.children.length : 0);
            
            if (typeDecl.children) {
                typeDecl.children.forEach((child, index) => {
                    console.log(`  TypeDecl Child ${index}: ${child.constructor.name}`);
                });
            }
            
            // Look for class declaration within type declaration
            const classDecl = findInChildren(typeDecl, 'ClassDeclarationContext');
            
            if (classDecl) {
            console.log('\nFound ClassDeclarationContext');
            console.log('ClassDecl children count:', classDecl.children ? classDecl.children.length : 0);
            
            if (classDecl.children) {
                classDecl.children.forEach((child, index) => {
                    console.log(`  ClassDecl Child ${index}: ${child.constructor.name}`);
                });
            }
            
            // Look for method declaration
            const methodDecl = findInChildren(classDecl, 'MethodDeclarationContext');
            if (methodDecl) {
                console.log('\nFound MethodDeclarationContext');
                console.log('MethodDecl text:', methodDecl.text);
                
                // Look for method body
                const methodBody = findInChildren(methodDecl, 'MethodBodyContext');
                if (methodBody) {
                    console.log('\nFound MethodBodyContext');
                    
                    // Look for block statement
                    const blockStatement = findInChildren(methodBody, 'BlockContext');
                    if (blockStatement) {
                        console.log('\nFound BlockContext');
                        
                        // Look for statement
                        const statement = findInChildren(blockStatement, 'StatementContext');
                        if (statement) {
                            console.log('\nFound StatementContext');
                            console.log('Statement children count:', statement.children ? statement.children.length : 0);
                            
                            if (statement.children) {
                                statement.children.forEach((child, index) => {
                                    console.log(`  Statement Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
                                });
                            }
                            
                            // Look for expression context (found directly in statement)
                            const expressionContext = statement.children.find(child => 
                                child.constructor.name === 'ExpressionContext'
                            );
                            
                            if (expressionContext) {
                                console.log('\nFound ExpressionContext');
                                console.log('Expression text:', expressionContext.text);
                                console.log('Expression children count:', expressionContext.children ? expressionContext.children.length : 0);
                                
                                if (expressionContext.children) {
                                    expressionContext.children.forEach((child, index) => {
                                        console.log(`  Expression Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
                                    });
                                }
                                
                                // Test the extraction logic - look for method call in expression
                                const methodCall = findInChildren(expressionContext, 'MethodCallContext');
                                if (methodCall) {
                                    console.log('\n=== Testing extraction logic ===');
                                    console.log('MethodCallContext text:', methodCall.text);
                                    console.log('MethodCallContext type:', methodCall.constructor.name);
                                    console.log('MethodCall children count:', methodCall.children ? methodCall.children.length : 0);
                                    
                                    if (methodCall.children) {
                                        methodCall.children.forEach((child, index) => {
                                            console.log(`  MethodCall Child ${index}: ${child.constructor.name} - text: "${child.text}"`);
                                        });
                                    }
                                    
                                    if (methodCall.children && methodCall.children.length > 1) {
                                        const argumentsContext = methodCall.children[1];
                                        console.log('\nArgumentsContext text:', argumentsContext.text);
                                        console.log('ArgumentsContext type:', argumentsContext.constructor.name);
                                        
                                        if (argumentsContext && typeof argumentsContext.expressionList === 'function') {
                                            const expressionList = argumentsContext.expressionList();
                                            if (expressionList && typeof expressionList.expression === 'function') {
                                                const argExpression = expressionList.expression();
                                                const finalExpression = Array.isArray(argExpression) ? argExpression[0] : argExpression;
                                                
                                                console.log('\n=== Final Expression ===');
                                                console.log('Expression text:', finalExpression ? finalExpression.text : 'undefined');
                                                console.log('Expression type:', finalExpression ? finalExpression.constructor.name : 'undefined');
                                                
                                                // Test if this is the comparison expression
                                                if (finalExpression && (finalExpression.text === '(p==q)' || finalExpression.text === '(p == q)')) {
                                                    console.log('✅ Successfully extracted comparison expression!');
                                                    
                                                    // Test transformation with a simple mock transformer
                                                    console.log('\n=== Testing Transformation ===');
                                                    const transformedText = finalExpression.text.replace(/==/g, '=');
                                                    console.log('Original:', finalExpression.text);
                                                    console.log('Transformed:', transformedText);
                                                    
                                                    if (transformedText === '(p=q)') {
                                                        console.log('✅ Transformation successful!');
                                                    } else {
                                                        console.log('❌ Transformation failed');
                                                    }
                                                } else {
                                                    console.log('❌ Failed to extract expected comparison expression');
                                                    console.log('Expected: (p==q) or (p == q), Got:', finalExpression ? finalExpression.text : 'undefined');
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    console.log('❌ MethodCallContext not found in ExpressionContext');
                                }
                            } else {
                                console.log('❌ ExpressionContext not found');
                            }
                        } else {
                            console.log('❌ StatementContext not found');
                        }
                    } else {
                        console.log('❌ BlockContext not found');
                    }
                } else {
                    console.log('❌ MethodBodyContext not found');
                }
            } else {
                console.log('❌ MethodDeclarationContext not found');
            }
        } else {
            console.log('❌ ClassDeclarationContext not found');
        }
        } else {
            console.log('❌ TypeDeclarationContext not found');
        }
    }
    
} catch (error) {
    console.error('Error parsing Java code:', error.message);
}

// Helper function to find child by type
function findInChildren(node, typeName) {
    if (!node.children) return null;
    
    for (const child of node.children) {
        if (child.constructor.name === typeName) {
            return child;
        }
        // Recursively search in children
        const found = findInChildren(child, typeName);
        if (found) return found;
    }
    return null;
}

console.log('\n=== Test completed ===');
"use strict";
// Java to IB Pseudocode Parser
Object.defineProperty(exports, "__esModule", { value: true });
exports.Java2IB = void 0;
const java_ast_1 = require("java-ast");
const constants_1 = require("./constants");
class Java2IB {
    constructor(options = {}) {
        this.options = {
            indentSize: 4,
            preserveComments: false,
            ...options
        };
    }
    parse(javaCode) {
        try {
            const ast = (0, java_ast_1.parse)(javaCode);
            const context = {
                indentLevel: 0,
                variables: new Map(),
                inLoop: false
            };
            const pseudocode = this.convertNode(ast, context);
            return {
                success: true,
                pseudocode: pseudocode.trim(),
                errors: []
            };
        }
        catch (error) {
            return {
                success: false,
                pseudocode: '',
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
        }
    }
    convertNode(node, context) {
        if (!node)
            return '';
        // Handle java-ast node structure
        const nodeType = node.node || node.type;
        switch (nodeType) {
            case 'CompilationUnit':
            case 'ClassDeclaration':
                return this.convertChildren(node, context);
            case 'MethodDeclaration':
                return this.convertMethod(node, context);
            case 'Block':
                return this.convertBlock(node, context);
            case 'VariableDeclarationStatement':
                return this.convertVariableDeclaration(node, context);
            case 'ExpressionStatement':
                return this.convertExpressionStatement(node, context);
            case 'Assignment':
                return this.convertAssignment(node, context);
            case 'IfStatement':
                return this.convertIfStatement(node, context);
            case 'ForStatement':
                return this.convertForStatement(node, context);
            case 'WhileStatement':
                return this.convertWhileStatement(node, context);
            case 'InfixExpression':
                return this.convertBinaryExpression(node, context);
            case 'PrefixExpression':
            case 'PostfixExpression':
                return this.convertUnaryExpression(node, context);
            case 'MethodInvocation':
                return this.convertMethodInvocation(node, context);
            case 'SimpleName':
                return this.convertIdentifier(node.identifier || node.name);
            case 'NumberLiteral':
            case 'StringLiteral':
            case 'BooleanLiteral':
                return this.convertLiteral(node, context);
            default:
                // For unknown node types, try to convert children
                return this.convertChildren(node, context);
        }
    }
    convertChildren(node, context) {
        if (!node)
            return '';
        // Handle java-ast structure - children might be in different properties
        const children = node.children || node.body || node.statements || [];
        if (Array.isArray(children)) {
            return children
                .map((child) => this.convertNode(child, context))
                .filter((result) => result.trim() !== '')
                .join('\n');
        }
        return '';
    }
    convertClassDeclaration(node, context) {
        // Skip class declaration, only process the body
        const body = node.children.find((child) => child.type === 'class_body');
        if (body) {
            return this.convertNode(body, context);
        }
        return '';
    }
    convertMethod(node, context) {
        // Only process main method, skip others
        const methodName = node.name || (node.children && node.children.find((child) => child.type === 'identifier'));
        const name = methodName?.identifier || methodName?.text || methodName;
        if (name === 'main') {
            const body = node.body || (node.children && node.children.find((child) => child.type === 'block'));
            if (body) {
                return this.convertNode(body, context);
            }
        }
        return '';
    }
    convertLiteral(node, context) {
        const nodeType = node.node || node.type;
        switch (nodeType) {
            case 'NumberLiteral':
                return node.token || node.value || '';
            case 'StringLiteral':
                return node.escapedValue || node.token || node.value || '';
            case 'BooleanLiteral':
                const value = node.booleanValue || node.value;
                return value ? constants_1.BOOLEAN_VALUES.TRUE : constants_1.BOOLEAN_VALUES.FALSE;
            default:
                return node.token || node.value || node.text || '';
        }
    }
    convertBlock(node, context) {
        const statements = node.statements || node.body || node.children || [];
        const results = [];
        for (const statement of statements) {
            const converted = this.convertNode(statement, context);
            if (converted.trim()) {
                results.push(converted);
            }
        }
        return results.join('\n');
    }
    convertVariableDeclaration(node, context) {
        const results = [];
        // In java-ast, fragments contain the variable declarations
        const fragments = node.fragments || [];
        const type = node.type?.name || node.typeType?.name || '';
        for (const fragment of fragments) {
            const name = fragment.name?.identifier || '';
            const initializer = fragment.initializer;
            if (name) {
                const varName = this.convertIdentifier(name);
                context.variables.set(name, type);
                if (initializer) {
                    const value = this.convertNode(initializer, context);
                    results.push(`${varName} ${constants_1.OPERATORS.ASSIGN} ${value}`);
                }
                else {
                    results.push(`${varName} ${constants_1.OPERATORS.ASSIGN} ${this.getDefaultValue(type)}`);
                }
            }
        }
        return results.join('\n');
    }
    convertExpressionStatement(node, context) {
        if (node.children.length > 0) {
            return this.convertNode(node.children[0], context);
        }
        return '';
    }
    convertIfStatement(node, context) {
        let condition = '';
        let thenBlock = '';
        let elseBlock = '';
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (child.type === 'parenthesized_expression') {
                condition = this.convertNode(child.children[1], context); // Skip parentheses
            }
            else if (child.type === 'block' && !thenBlock) {
                const newContext = { ...context, indentLevel: context.indentLevel + 1 };
                thenBlock = this.indentLines(this.convertNode(child, context), newContext.indentLevel);
            }
            else if (child.type === 'block' && thenBlock) {
                const newContext = { ...context, indentLevel: context.indentLevel + 1 };
                elseBlock = this.indentLines(this.convertNode(child, context), newContext.indentLevel);
            }
            else if (child.type === 'if_statement') {
                // else if case
                const newContext = { ...context, indentLevel: context.indentLevel + 1 };
                elseBlock = this.indentLines(this.convertIfStatement(child, context), newContext.indentLevel);
            }
        }
        let result = `${constants_1.KEYWORDS.IF} ${condition} ${constants_1.KEYWORDS.THEN}`;
        if (thenBlock) {
            result += `\n${thenBlock}`;
        }
        if (elseBlock) {
            // Check if it's an else if
            if (elseBlock.trim().startsWith('if ')) {
                result += `\n${constants_1.KEYWORDS.ELSE_IF} ${elseBlock.trim().substring(3)}`;
            }
            else {
                result += `\n${constants_1.KEYWORDS.ELSE}\n${elseBlock}`;
            }
        }
        result += `\n${constants_1.KEYWORDS.END_IF}`;
        return result;
    }
    convertForStatement(node, context) {
        // Handle C-style for loop: for (int i = 0; i < n; i++)
        let init = '';
        let condition = '';
        let update = '';
        let body = '';
        for (const child of node.children) {
            if (child.type === 'local_variable_declaration') {
                init = child;
            }
            else if (child.type === 'binary_expression') {
                condition = child;
            }
            else if (child.type === 'update_expression') {
                update = child;
            }
            else if (child.type === 'block') {
                const newContext = { ...context, indentLevel: context.indentLevel + 1 };
                body = this.indentLines(this.convertNode(child, context), newContext.indentLevel);
            }
        }
        // Extract loop variable and range
        if (init && condition && update && typeof init === 'object' && init !== null) {
            const initObj = init;
            if ('children' in initObj) {
                const varDeclarator = initObj.children.find((child) => child.type === 'variable_declarator');
                if (varDeclarator) {
                    const varName = varDeclarator.children.find((child) => child.type === 'identifier');
                    const initValue = varDeclarator.children.find((child) => child.type === 'decimal_integer_literal');
                    if (varName && initValue && condition && condition.children && condition.children.length >= 3) {
                        const loopVar = this.convertIdentifier(varName.text);
                        const startValue = initValue.text;
                        const endCondition = condition.children[2]; // Right side of comparison
                        let endValue = '';
                        if (endCondition && endCondition.type === 'decimal_integer_literal') {
                            const endNum = parseInt(endCondition.text);
                            endValue = (endNum - 1).toString(); // Convert < n to "to n-1"
                        }
                        else if (endCondition) {
                            endValue = `${this.convertNode(endCondition, context)} - 1`;
                        }
                        let result = `${constants_1.KEYWORDS.LOOP} ${loopVar} ${constants_1.KEYWORDS.FROM} ${startValue} ${constants_1.KEYWORDS.TO} ${endValue}`;
                        if (body) {
                            result += `\n${body}`;
                        }
                        result += `\n${constants_1.KEYWORDS.END_LOOP}`;
                        return result;
                    }
                }
            }
        }
        return '';
    }
    convertEnhancedForStatement(node, context) {
        // Enhanced for loop is not supported in basic implementation
        return '';
    }
    convertWhileStatement(node, context) {
        let condition = '';
        let body = '';
        for (const child of node.children) {
            if (child.type === 'parenthesized_expression') {
                condition = this.convertNode(child.children[1], context); // Skip parentheses
            }
            else if (child.type === 'block') {
                const newContext = { ...context, indentLevel: context.indentLevel + 1 };
                body = this.indentLines(this.convertNode(child, context), newContext.indentLevel);
            }
        }
        let result = `${constants_1.KEYWORDS.LOOP} ${constants_1.KEYWORDS.WHILE} ${condition}`;
        if (body) {
            result += `\n${body}`;
        }
        result += `\n${constants_1.KEYWORDS.END_LOOP}`;
        return result;
    }
    convertMethodInvocation(node, context) {
        // Handle System.out.println and System.out.print
        const object = node.children.find((child) => child.type === 'field_access');
        const method = node.children.find((child) => child.type === 'identifier');
        const args = node.children.find((child) => child.type === 'argument_list');
        if (object && method) {
            const objectText = object.text;
            const methodText = method.text;
            if (objectText === 'System.out' && (methodText === 'println' || methodText === 'print')) {
                if (args && args.children.length > 1) {
                    const arg = args.children[1]; // Skip opening parenthesis
                    const argValue = this.convertNode(arg, context);
                    return `${constants_1.KEYWORDS.OUTPUT} ${argValue}`;
                }
                else {
                    return `${constants_1.KEYWORDS.OUTPUT} ""`;
                }
            }
        }
        return '';
    }
    convertAssignmentExpression(node, context) {
        if (node.children.length >= 3) {
            const left = this.convertNode(node.children[0], context);
            const right = this.convertNode(node.children[2], context);
            return `${left} ${constants_1.OPERATORS.ASSIGN} ${right}`;
        }
        return '';
    }
    convertBinaryExpression(node, context) {
        if (node.children.length >= 3) {
            const left = this.convertNode(node.children[0], context);
            const operator = node.children[1].text;
            const right = this.convertNode(node.children[2], context);
            const ibOperator = constants_1.OPERATOR_MAPPING[operator] || operator;
            return `${left} ${ibOperator} ${right}`;
        }
        return '';
    }
    convertUnaryExpression(node, context) {
        if (node.children.length >= 2) {
            const operator = node.children[0].text;
            const operand = this.convertNode(node.children[1], context);
            if (operator === '!') {
                return `${constants_1.OPERATORS.NOT} ${operand}`;
            }
            return `${operator}${operand}`;
        }
        return '';
    }
    convertUpdateExpression(node, context) {
        // Handle i++ and i--
        if (node.children.length >= 2) {
            const variable = node.children[0];
            const operator = node.children[1].text;
            const varName = this.convertIdentifier(variable.text);
            if (operator === '++') {
                return `${varName} ${constants_1.OPERATORS.ASSIGN} ${varName} + 1`;
            }
            else if (operator === '--') {
                return `${varName} ${constants_1.OPERATORS.ASSIGN} ${varName} - 1`;
            }
        }
        return '';
    }
    convertAssignment(node, context) {
        const leftSide = node.leftHandSide || node.left;
        const rightSide = node.rightHandSide || node.right;
        const operator = node.operator || '=';
        if (leftSide && rightSide) {
            const left = this.convertNode(leftSide, context);
            const right = this.convertNode(rightSide, context);
            // Map Java operators to IB operators
            const ibOperator = constants_1.OPERATOR_MAPPING[operator] || operator;
            return `${left} ${ibOperator} ${right}`;
        }
        return '';
    }
    getDefaultValue(type) {
        switch (type.toLowerCase()) {
            case 'int':
            case 'integer':
            case 'double':
            case 'float':
                return '0';
            case 'boolean':
                return 'FALSE';
            case 'string':
                return '""';
            default:
                return '0';
        }
    }
    convertIdentifier(text) {
        // Convert to uppercase for IB pseudocode convention
        return text.toUpperCase();
    }
    indentLines(text, level) {
        const indent = ' '.repeat(level * this.options.indentSize);
        return text.split('\n').map(line => line.trim() ? indent + line : line).join('\n');
    }
}
exports.Java2IB = Java2IB;

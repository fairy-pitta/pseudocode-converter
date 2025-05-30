// Python to IB Pseudocode parser

export interface ParseResult {
  convertedLine: string
  blockType: BlockType | null
}

export type BlockType = "function" | "class" | "if" | "elif" | "else" | "for" | "while" | "try" | "except" | "finally"

interface ParserState {
  indentStack: number[]
  blockStack: BlockType[]
  result: string[]
}

// 定数定義
const INDENT_SIZE = 4
const OPERATORS = {
  ASSIGNMENT: "←",
  EQUALITY: "=",
  INEQUALITY: "≠",
  AND: "AND",
  OR: "OR",
  NOT: "NOT",
} as const

const COMPOUND_ASSIGNMENTS = [
  { op: "+=", symbol: "+" },
  { op: "-=", symbol: "-" },
  { op: "*=", symbol: "*" },
  { op: "/=", symbol: "/" },
  { op: "%=", symbol: "%" },
  { op: "**=", symbol: "**" },
  { op: "//=", symbol: "//" },
] as const

export class PythonParser {
  private state: ParserState

  constructor() {
    this.state = {
      indentStack: [0],
      blockStack: [],
      result: [],
    }
  }

  public parse(pythonCode: string): string {
    if (!this.isValidInput(pythonCode)) {
      return ""
    }

    this.resetState()
    const lines = pythonCode.split("\n")

    for (let i = 0; i < lines.length; i++) {
      this.processLine(lines[i])
    }

    this.closeRemainingBlocks()
    return this.state.result.join("\n")
  }

  private isValidInput(code: string): boolean {
    return Boolean(code && typeof code === "string")
  }

  private resetState(): void {
    this.state = {
      indentStack: [0],
      blockStack: [],
      result: [],
    }
  }

  private processLine(line: string): void {
    const trimmed = line.trim()

    if (this.isEmpty(trimmed)) {
      this.state.result.push("")
      return
    }

    if (this.isComment(trimmed)) {
      this.handleComment(line, trimmed)
      return
    }

    this.handleCodeLine(line, trimmed)
  }

  private isEmpty(line: string): boolean {
    return !line
  }

  private isComment(line: string): boolean {
    return line.startsWith("#")
  }

  private handleComment(line: string, trimmed: string): void {
    const comment = trimmed.substring(1).trim()
    const indent = this.getIndentString(line)
    this.state.result.push(`${indent}// ${comment}`)
  }

  private handleCodeLine(line: string, trimmed: string): void {
    const currentIndent = this.getIndentLevel(line)

    this.closeBlocksIfNeeded(currentIndent)
    this.updateIndentStack(currentIndent)

    const pseudoIndent = this.getPseudoIndent()
    const { convertedLine, blockType } = this.convertStatement(trimmed, pseudoIndent)

    if (convertedLine) {
      this.state.result.push(convertedLine)

      if (blockType) {
        this.state.blockStack.push(blockType)
      }
    }
  }

  private closeBlocksIfNeeded(currentIndent: number): void {
    while (
      this.state.indentStack.length > 1 &&
      currentIndent < this.state.indentStack[this.state.indentStack.length - 1]
    ) {
      this.closeBlock()
    }
  }

  private closeBlock(): void {
    this.state.indentStack.pop()
    const blockType = this.state.blockStack.pop()
    const endIndent = this.getEndBlockIndent()
    const endStatement = this.getEndStatement(blockType)

    this.state.result.push(`${endIndent}${endStatement}`)
  }

  private updateIndentStack(currentIndent: number): void {
    if (currentIndent > this.state.indentStack[this.state.indentStack.length - 1]) {
      this.state.indentStack.push(currentIndent)
    }
  }

  private getPseudoIndent(): string {
    return " ".repeat((this.state.indentStack.length - 1) * INDENT_SIZE)
  }

  private getEndBlockIndent(): string {
    return " ".repeat(Math.max(0, (this.state.indentStack.length - 1) * INDENT_SIZE))
  }

  private getEndStatement(blockType: BlockType | undefined): string {
    switch (blockType) {
      case "function":
        return "END FUNCTION"
      case "class":
        return "END CLASS"
      case "if":
      case "elif":
      case "else":
        return "END IF"
      case "for":
        return "END FOR"
      case "while":
        return "END WHILE"
      case "try":
      case "except":
      case "finally":
        return "END TRY"
      default:
        return "END"
    }
  }

  private closeRemainingBlocks(): void {
    while (this.state.blockStack.length > 0) {
      this.closeBlock()
    }
  }

  private getIndentLevel(line: string): number {
    if (!line) return 0
    const match = line.match(/^(\s*)/)
    return match ? match[1].length : 0
  }

  private getIndentString(line: string): string {
    if (!line) return ""
    const match = line.match(/^(\s*)/)
    return match ? match[1] : ""
  }

  private convertStatement(statement: string, indent: string): ParseResult {
    if (!statement) return { convertedLine: "", blockType: null }

    // 各構文タイプの変換を試行
    const converters = [
      this.convertFunction.bind(this),
      this.convertClass.bind(this),
      this.convertIf.bind(this),
      this.convertElif.bind(this),
      this.convertElse.bind(this),
      this.convertForRange.bind(this),
      this.convertForGeneral.bind(this),
      this.convertWhile.bind(this),
      this.convertTry.bind(this),
      this.convertExcept.bind(this),
      this.convertFinally.bind(this),
      this.convertReturn.bind(this),
      this.convertPrint.bind(this),
      this.convertInput.bind(this),
      this.convertCompoundAssignment.bind(this),
      this.convertAssignment.bind(this),
    ]

    for (const converter of converters) {
      const result = converter(statement, indent)
      if (result.convertedLine !== statement) {
        return result
      }
    }

    // デフォルト: そのまま返す
    return { convertedLine: `${indent}${statement}`, blockType: null }
  }

  private convertFunction(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("def ")) {
      return { convertedLine: statement, blockType: null }
    }

    const match = statement.match(/def\s+(\w+)\s*$$(.*?)$$\s*:/)
    if (match) {
      const [, funcName, params] = match
      return {
        convertedLine: `${indent}FUNCTION ${funcName}(${params})`,
        blockType: "function",
      }
    }

    return { convertedLine: statement, blockType: null }
  }

  private convertClass(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("class ")) {
      return { convertedLine: statement, blockType: null }
    }

    const match = statement.match(/class\s+(\w+)(?:$$(.*?)$$)?\s*:/)
    if (match) {
      const [, className, parentClass] = match
      const inheritance = parentClass ? ` EXTENDS ${parentClass}` : ""
      return {
        convertedLine: `${indent}CLASS ${className}${inheritance}`,
        blockType: "class",
      }
    }

    return { convertedLine: statement, blockType: null }
  }

  private convertIf(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("if ")) {
      return { convertedLine: statement, blockType: null }
    }

    const condition = this.processCondition(statement.slice(3, -1))
    return {
      convertedLine: `${indent}IF ${condition} THEN`,
      blockType: "if",
    }
  }

  private convertElif(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("elif ")) {
      return { convertedLine: statement, blockType: null }
    }

    const condition = this.processCondition(statement.slice(5, -1))
    return {
      convertedLine: `${indent}ELSE IF ${condition} THEN`,
      blockType: "elif",
    }
  }

  private convertElse(statement: string, indent: string): ParseResult {
    if (statement !== "else:") {
      return { convertedLine: statement, blockType: null }
    }

    return {
      convertedLine: `${indent}ELSE`,
      blockType: "else",
    }
  }

  private convertForRange(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("for ") || !statement.includes("range(")) {
      return { convertedLine: statement, blockType: null }
    }

    const match = statement.match(/for\s+(\w+)\s+in\s+range$$(\d+)(?:,\s*(\d+))?$$\s*:/)
    if (match) {
      const [, variable, start, end] = match

      if (end) {
        // range(start, end)
        const endVal = (Number.parseInt(end) - 1).toString()
        return {
          convertedLine: `${indent}FOR ${variable} ${OPERATORS.ASSIGNMENT} ${start} TO ${endVal} DO`,
          blockType: "for",
        }
      } else {
        // range(end)
        const endVal = (Number.parseInt(start) - 1).toString()
        return {
          convertedLine: `${indent}FOR ${variable} ${OPERATORS.ASSIGNMENT} 0 TO ${endVal} DO`,
          blockType: "for",
        }
      }
    }

    return { convertedLine: statement, blockType: null }
  }

  private convertForGeneral(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("for ")) {
      return { convertedLine: statement, blockType: null }
    }

    const match = statement.match(/for\s+(.+?)\s+in\s+(.+?)\s*:/)
    if (match) {
      const [, variable, iterable] = match
      return {
        convertedLine: `${indent}FOR EACH ${variable} IN ${iterable} DO`,
        blockType: "for",
      }
    }

    return { convertedLine: statement, blockType: null }
  }

  private convertWhile(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("while ")) {
      return { convertedLine: statement, blockType: null }
    }

    const condition = this.processCondition(statement.slice(6, -1))
    return {
      convertedLine: `${indent}WHILE ${condition} DO`,
      blockType: "while",
    }
  }

  private convertTry(statement: string, indent: string): ParseResult {
    if (statement !== "try:") {
      return { convertedLine: statement, blockType: null }
    }

    return {
      convertedLine: `${indent}TRY`,
      blockType: "try",
    }
  }

  private convertExcept(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("except")) {
      return { convertedLine: statement, blockType: null }
    }

    const match = statement.match(/except(?:\s+(.+?))?\s*:/)
    const exception = match?.[1] ? ` ${match[1]}` : ""
    return {
      convertedLine: `${indent}CATCH${exception}`,
      blockType: "except",
    }
  }

  private convertFinally(statement: string, indent: string): ParseResult {
    if (statement !== "finally:") {
      return { convertedLine: statement, blockType: null }
    }

    return {
      convertedLine: `${indent}FINALLY`,
      blockType: "finally",
    }
  }

  private convertReturn(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("return")) {
      return { convertedLine: statement, blockType: null }
    }

    const value = statement.slice(6).trim()
    return {
      convertedLine: `${indent}RETURN${value ? ` ${value}` : ""}`,
      blockType: null,
    }
  }

  private convertPrint(statement: string, indent: string): ParseResult {
    if (!statement.startsWith("print(")) {
      return { convertedLine: statement, blockType: null }
    }

    const content = statement.slice(6, -1)
    return {
      convertedLine: `${indent}OUTPUT ${content}`,
      blockType: null,
    }
  }

  private convertInput(statement: string, indent: string): ParseResult {
    if (!statement.includes("input(")) {
      return { convertedLine: statement, blockType: null }
    }

    const match = statement.match(/(\w+)\s*=\s*input$$(.*?)$$/)
    if (match) {
      const [, variable] = match
      return {
        convertedLine: `${indent}${variable} ${OPERATORS.ASSIGNMENT} INPUT()`,
        blockType: null,
      }
    }

    return {
      convertedLine: `${indent}INPUT()`,
      blockType: null,
    }
  }

  private convertCompoundAssignment(statement: string, indent: string): ParseResult {
    for (const { op, symbol } of COMPOUND_ASSIGNMENTS) {
      if (statement.includes(op)) {
        const parts = statement.split(op)
        if (parts.length === 2) {
          const variable = parts[0].trim()
          const value = parts[1].trim()
          return {
            convertedLine: `${indent}${variable} ${OPERATORS.ASSIGNMENT} ${variable} ${symbol} ${value}`,
            blockType: null,
          }
        }
      }
    }

    return { convertedLine: statement, blockType: null }
  }

  private convertAssignment(statement: string, indent: string): ParseResult {
    if (
      !statement.includes(" = ") ||
      statement.includes("==") ||
      statement.includes("!=") ||
      statement.includes("<=") ||
      statement.includes(">=")
    ) {
      return { convertedLine: statement, blockType: null }
    }

    const parts = statement.split(" = ")
    if (parts.length === 2) {
      const variable = parts[0].trim()
      const value = parts[1].trim()
      return {
        convertedLine: `${indent}${variable} ${OPERATORS.ASSIGNMENT} ${value}`,
        blockType: null,
      }
    }

    return { convertedLine: statement, blockType: null }
  }

  private processCondition(condition: string): string {
    return condition
      .replace(/==/g, OPERATORS.EQUALITY)
      .replace(/!=/g, OPERATORS.INEQUALITY)
      .replace(/\band\b/g, OPERATORS.AND)
      .replace(/\bor\b/g, OPERATORS.OR)
      .replace(/\bnot\b/g, OPERATORS.NOT)
  }
}

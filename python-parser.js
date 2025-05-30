// Pythonコードの構造を解析してIB Pseudocodeに変換

function parsePythonToIBPseudocode(pythonCode) {
  if (!pythonCode || typeof pythonCode !== "string") {
    return ""
  }

  const lines = pythonCode.split("\n")
  const result = []
  const indentStack = [0] // インデントレベルのスタック
  const blockStack = [] // ブロックタイプのスタック

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // 空行の処理
    if (!trimmed) {
      result.push("")
      continue
    }

    // コメントの処理
    if (trimmed.startsWith("#")) {
      const comment = trimmed.substring(1).trim()
      result.push(`${getIndentString(line)}// ${comment}`)
      continue
    }

    // 現在の行のインデントレベルを取得
    const currentIndent = getIndentLevel(line)

    // インデントが減少した場合、ブロックを閉じる
    while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop()
      const blockType = blockStack.pop()
      const endIndent = " ".repeat((indentStack.length - 1) * 4)

      switch (blockType) {
        case "function":
          result.push(`${endIndent}END FUNCTION`)
          break
        case "if":
        case "elif":
        case "else":
          result.push(`${endIndent}END IF`)
          break
        case "for":
          result.push(`${endIndent}END FOR`)
          break
        case "while":
          result.push(`${endIndent}END WHILE`)
          break
        case "try":
          result.push(`${endIndent}END TRY`)
          break
        default:
          result.push(`${endIndent}END`)
      }
    }

    // インデントが増加した場合、新しいレベルを追加
    if (currentIndent > indentStack[indentStack.length - 1]) {
      indentStack.push(currentIndent)
    }

    // 現在のインデントレベルに基づく疑似コードのインデント
    const pseudoIndent = " ".repeat((indentStack.length - 1) * 4)

    // 各構文の変換
    const { convertedLine, blockType } = convertStatement(trimmed, pseudoIndent)

    if (convertedLine) {
      result.push(convertedLine)

      // ブロックを開始する構文の場合、ブロックタイプを記録
      if (blockType) {
        blockStack.push(blockType)
      }
    }
  }

  // 残りのブロックを閉じる
  while (blockStack.length > 0) {
    const blockType = blockStack.pop()
    indentStack.pop()
    const endIndent = " ".repeat((indentStack.length - 1) * 4)

    switch (blockType) {
      case "function":
        result.push(`${endIndent}END FUNCTION`)
        break
      case "if":
      case "elif":
      case "else":
        result.push(`${endIndent}END IF`)
        break
      case "for":
        result.push(`${endIndent}END FOR`)
        break
      case "while":
        result.push(`${endIndent}END WHILE`)
        break
      case "try":
        result.push(`${endIndent}END TRY`)
        break
      default:
        result.push(`${endIndent}END`)
    }
  }

  return result.join("\n")
}

function getIndentLevel(line) {
  if (!line) return 0
  const match = line.match(/^(\s*)/)
  return match ? match[1].length : 0
}

function getIndentString(line) {
  if (!line) return ""
  const match = line.match(/^(\s*)/)
  return match ? match[1] : ""
}

function convertStatement(statement, indent) {
  if (!statement) return { convertedLine: "", blockType: null }

  // 関数定義
  if (statement.startsWith("def ")) {
    const match = statement.match(/def\s+(\w+)\s*$$(.*?)$$\s*:/)
    if (match) {
      const funcName = match[1]
      const params = match[2]
      return {
        convertedLine: `${indent}FUNCTION ${funcName}(${params})`,
        blockType: "function",
      }
    }
  }

  // クラス定義
  if (statement.startsWith("class ")) {
    const match = statement.match(/class\s+(\w+)(?:$$(.*?)$$)?\s*:/)
    if (match) {
      const className = match[1]
      const parentClass = match[2] ? ` EXTENDS ${match[2]}` : ""
      return {
        convertedLine: `${indent}CLASS ${className}${parentClass}`,
        blockType: "class",
      }
    }
  }

  // if文
  if (statement.startsWith("if ")) {
    const condition = statement
      .slice(3, -1)
      .replace(/==/g, "=")
      .replace(/!=/g, "≠")
      .replace(/and/g, "AND")
      .replace(/or/g, "OR")
      .replace(/not/g, "NOT")
    return {
      convertedLine: `${indent}IF ${condition} THEN`,
      blockType: "if",
    }
  }

  // elif文
  if (statement.startsWith("elif ")) {
    const condition = statement
      .slice(5, -1)
      .replace(/==/g, "=")
      .replace(/!=/g, "≠")
      .replace(/and/g, "AND")
      .replace(/or/g, "OR")
      .replace(/not/g, "NOT")
    return {
      convertedLine: `${indent}ELSE IF ${condition} THEN`,
      blockType: "elif",
    }
  }

  // else文
  if (statement === "else:") {
    return {
      convertedLine: `${indent}ELSE`,
      blockType: "else",
    }
  }

  // for文 - range
  if (statement.startsWith("for ") && statement.includes("range(")) {
    const rangeMatch = statement.match(/for\s+(\w+)\s+in\s+range$$(\d+)(?:,\s*(\d+))?$$\s*:/)
    if (rangeMatch) {
      const variable = rangeMatch[1]
      const start = rangeMatch[2]
      const end = rangeMatch[3]
        ? (Number.parseInt(rangeMatch[3]) - 1).toString()
        : (Number.parseInt(rangeMatch[2]) - 1).toString()
      const startVal = rangeMatch[3] ? start : "0"
      return {
        convertedLine: `${indent}FOR ${variable} ← ${startVal} TO ${end} DO`,
        blockType: "for",
      }
    }
  }

  // for文 - 一般
  if (statement.startsWith("for ")) {
    const match = statement.match(/for\s+(.+?)\s+in\s+(.+?)\s*:/)
    if (match) {
      const variable = match[1]
      const iterable = match[2]
      return {
        convertedLine: `${indent}FOR EACH ${variable} IN ${iterable} DO`,
        blockType: "for",
      }
    }
  }

  // while文
  if (statement.startsWith("while ")) {
    const condition = statement
      .slice(6, -1)
      .replace(/==/g, "=")
      .replace(/!=/g, "≠")
      .replace(/and/g, "AND")
      .replace(/or/g, "OR")
      .replace(/not/g, "NOT")
    return {
      convertedLine: `${indent}WHILE ${condition} DO`,
      blockType: "while",
    }
  }

  // try文
  if (statement === "try:") {
    return {
      convertedLine: `${indent}TRY`,
      blockType: "try",
    }
  }

  // except文
  if (statement.startsWith("except")) {
    const match = statement.match(/except(?:\s+(.+?))?\s*:/)
    const exception = match && match[1] ? ` ${match[1]}` : ""
    return {
      convertedLine: `${indent}CATCH${exception}`,
      blockType: "except",
    }
  }

  // finally文
  if (statement === "finally:") {
    return {
      convertedLine: `${indent}FINALLY`,
      blockType: "finally",
    }
  }

  // return文
  if (statement.startsWith("return")) {
    const value = statement.slice(6).trim()
    return {
      convertedLine: `${indent}RETURN${value ? ` ${value}` : ""}`,
      blockType: null,
    }
  }

  // print文
  if (statement.startsWith("print(")) {
    const content = statement.slice(6, -1)
    return {
      convertedLine: `${indent}OUTPUT ${content}`,
      blockType: null,
    }
  }

  // input文
  if (statement.includes("input(")) {
    const inputMatch = statement.match(/(\w+)\s*=\s*input$$(.*?)$$/)
    if (inputMatch) {
      const variable = inputMatch[1]
      return {
        convertedLine: `${indent}${variable} ← INPUT()`,
        blockType: null,
      }
    }
    return {
      convertedLine: `${indent}INPUT()`,
      blockType: null,
    }
  }

  // 複合代入演算子
  if (statement.includes("+=")) {
    const parts = statement.split("+=")
    if (parts.length === 2) {
      const variable = parts[0].trim()
      const value = parts[1].trim()
      return {
        convertedLine: `${indent}${variable} ← ${variable} + ${value}`,
        blockType: null,
      }
    }
  }

  if (statement.includes("-=")) {
    const parts = statement.split("-=")
    if (parts.length === 2) {
      const variable = parts[0].trim()
      const value = parts[1].trim()
      return {
        convertedLine: `${indent}${variable} ← ${variable} - ${value}`,
        blockType: null,
      }
    }
  }

  if (statement.includes("*=")) {
    const parts = statement.split("*=")
    if (parts.length === 2) {
      const variable = parts[0].trim()
      const value = parts[1].trim()
      return {
        convertedLine: `${indent}${variable} ← ${variable} * ${value}`,
        blockType: null,
      }
    }
  }

  if (statement.includes("/=")) {
    const parts = statement.split("/=")
    if (parts.length === 2) {
      const variable = parts[0].trim()
      const value = parts[1].trim()
      return {
        convertedLine: `${indent}${variable} ← ${variable} / ${value}`,
        blockType: null,
      }
    }
  }

  // 通常の代入
  if (
    statement.includes(" = ") &&
    !statement.includes("==") &&
    !statement.includes("!=") &&
    !statement.includes("<=") &&
    !statement.includes(">=")
  ) {
    const parts = statement.split(" = ")
    if (parts.length === 2) {
      const variable = parts[0].trim()
      const value = parts[1].trim()
      return {
        convertedLine: `${indent}${variable} ← ${value}`,
        blockType: null,
      }
    }
  }

  // その他の文
  return {
    convertedLine: `${indent}${statement}`,
    blockType: null,
  }
}

// テスト用のサンプルコード
const sampleCode = `def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))`

console.log("=== Python Code ===")
console.log(sampleCode)
console.log("\n=== IB Pseudocode ===")
console.log(parsePythonToIBPseudocode(sampleCode))

// より複雑な例
const complexCode = `# Simple calculator
def calculate(x, y, operation):
    if operation == "+":
        result = x + y
    elif operation == "-":
        result = x - y
    elif operation == "*":
        result = x * y
    elif operation == "/":
        if y != 0:
            result = x / y
        else:
            result = "Error"
    else:
        result = "Invalid"
    return result

x = int(input("Enter first number: "))
y = int(input("Enter second number: "))
op = input("Enter operation: ")
answer = calculate(x, y, op)
print("Result:", answer)`

console.log("\n\n=== Complex Python Code ===")
console.log(complexCode)
console.log("\n=== Complex IB Pseudocode ===")
console.log(parsePythonToIBPseudocode(complexCode))

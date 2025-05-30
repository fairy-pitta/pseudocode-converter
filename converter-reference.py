# 2025‑05‑30 Python → IB Pseudocode 速習ガイド

## ✅ 概要

本ドキュメントは IB Computer Science (First Exams 2014) が定める**公式擬似コード表記**に沿い、Python から擬似コードへ変換する際のルールおよびサンプル変換スクリプトをまとめたものです。

> **対象読者** : Python を普段使いしているが、IB CS の試験や教材で擬似コードを書く必要がある開発者・講師・学生。

---

## 📐 最小構文ルール対照表

| カテゴリ             | Python 記法              | IB 擬似コード                                                             |
| ---------------- | ---------------------- | -------------------------------------------------------------------- |
| **コメント**         | `# comment`            | `// comment`                                                         |
| **代入**           | `x = 5`                | `x ← 5`                                                              |
| **算術演算**         | `a // b``a % b`        | `a div b``a mod b`                                                   |
| **論理演算**         | `and`, `or`, `not`     | `AND`, `OR`, `NOT`                                                   |
| **比較**           | `==`, `!=`             | `=`, `≠`                                                             |
| **出力**           | `print(x, y)`          | `OUTPUT x , y`                                                       |
| **入力**           | `x = input()`          | `INPUT x`                                                            |
| **配列要素**         | `A[0]`                 | `A[0]` (添字は 0 始まり)                                                   |
| **IF**           | `if / elif / else:`    | `IF cond THEN …``ELSE IF cond THEN …``ELSE …``END IF`                |
| **WHILE**        | `while cond:`          | `WHILE cond DO … END WHILE`                                          |
| **FOR (range)**  | `for i in range(a,b):` | `loop i from a to b-1`                                               |
| **FOR (コレクション)** | `for item in C:`       | `loop while C.hasNext()``item = C.getNext()`                         |
| **REPEAT–UNTIL** | *該当なし*                 | `loop … UNTIL cond`                                                  |
| **関数**           | `def f(p):`            | `FUNCTION f(p)` … `END FUNCTION`                                     |
| **手続き**          | なし                     | `PROCEDURE name()` … `END PROCEDURE`                                 |
| **終了句**          | インデントで暗黙               | `END IF / END FOR / END WHILE / END FUNCTION`                        |
| **標準 DS**        | `list`, `deque` など     | `ARRAY`, `STACK`, `QUEUE`, `COLLECTION`（メソッドは `.push()`, `.pop()` 等） |

> 📌 **覚えておくべき 4 つ**: ① 代入は ← 、② ブロック末尾に END ○○、③ 文字列結合は `,` で区切る、④ 配列は 0 始まり。

---

## 🔍 構文詳細

### 1. 代入と演算子

```pseudocode
TOTAL ← TOTAL + 1       // +=
R ← A mod B             // %
Q ← A div B             // //
```

### 2. 分岐

```pseudocode
IF score ≥ 7 THEN
    OUTPUT "Pass"
ELSE IF score ≥ 4 THEN
    OUTPUT "Retake"
ELSE
    OUTPUT "Fail"
END IF
```

### 3. 反復

#### 3‑A. カウンタ制御

```pseudocode
loop i from 0 to 9       // 0‑based, 10 回
    OUTPUT i
end loop
```

#### 3‑B. 条件制御

```pseudocode
WHILE NOT FINISHED DO
    …
END WHILE

loop UNTIL guess = target
    guess ← INPUT()
end loop
```

### 4. 配列と標準データ構造

```pseudocode
NAMES[0] ← "Alice"
STACK.push(42)
IF QUEUE.isEmpty() THEN …
```

### 5. コレクション走査

```pseudocode
COL.resetNext()
loop WHILE COL.hasNext()
    ITEM ← COL.getNext()
    …
end loop
```

---

## 🐍➡️📄 Python → IB Pseudocode 変換サンプルスクリプト

以下は **最小限** の構文（関数定義 / if‑elif‑else / for range / while / 入出力 / 単純代入）に対応した変換器です。高度なパターンや複合代入、例外処理などは **TODO** として下部にコメントしています。

```python
"""python_to_ib_pseudocode.py
Usage:
    $ python python_to_ib_pseudocode.py < input.py > output.pseudo
"""
import ast
import sys

INDENT = "    "  # 4 spaces

class Converter(ast.NodeVisitor):
    def __init__(self):
        self.lines = []
        self.level = 0

    # ---------- Helpers ---------- #
    def emit(self, text=""):
        self.lines.append(f"{INDENT * self.level}{text}")

    def visit_Module(self, node):
        for stmt in node.body:
            self.visit(stmt)
        return "\n".join(self.lines)

    # ---------- Statements ---------- #
    def visit_FunctionDef(self, node: ast.FunctionDef):
        params = ", ".join(arg.arg for arg in node.args.args)
        self.emit(f"FUNCTION {node.name}({params})")
        self.level += 1
        for stmt in node.body:
            self.visit(stmt)
        self.level -= 1
        self.emit("END FUNCTION")

    def visit_Return(self, node: ast.Return):
        value = self.expr(node.value) if node.value else ""
        self.emit(f"RETURN {value}")

    def visit_Assign(self, node: ast.Assign):
        target = self.expr(node.targets[0])
        value  = self.expr(node.value)
        self.emit(f"{target} ← {value}")

    def visit_AugAssign(self, node: ast.AugAssign):
        op_map = {ast.Add: "+", ast.Sub: "-", ast.Mult: "*", ast.Div: "/"}
        op = op_map.get(type(node.op), "?")
        target = self.expr(node.target)
        value  = self.expr(node.value)
        self.emit(f"{target} ← {target} {op} {value}")

    def visit_If(self, node: ast.If):
        self.emit(f"IF {self.expr(node.test)} THEN")
        self.level += 1
        for stmt in node.body:
            self.visit(stmt)
        self.level -= 1
        if node.orelse:
            else_block = node.orelse[0]
            if isinstance(else_block, ast.If):
                self.emit(f"ELSE IF {self.expr(else_block.test)} THEN")
                self.level += 1
                for stmt in else_block.body:
                    self.visit(stmt)
                self.level -= 1
                if else_block.orelse:
                    self._emit_else_block(else_block.orelse)
            else:
                self._emit_else_block(node.orelse)
        self.emit("END IF")

    def _emit_else_block(self, stmts):
        self.emit("ELSE")
        self.level += 1
        for stmt in stmts:
            self.visit(stmt)
        self.level -= 1

    def visit_For(self, node: ast.For):
        # Only handles range(start, stop) or range(stop)
        if isinstance(node.iter, ast.Call) and getattr(node.iter.func, "id", None) == "range":
            args = node.iter.args
            if len(args) == 1:
                start, stop = "0", self.expr(args[0]) + " - 1"
            else:
                start, stop = self.expr(args[0]), self.expr(args[1]) + " - 1"
            var = self.expr(node.target)
            self.emit(f"loop {var} from {start} to {stop}")
        else:
            var = self.expr(node.target)
            iterable = self.expr(node.iter)
            self.emit(f"// ⚠ unsupported for‑each: for {var} in {iterable}")
        self.level += 1
        for stmt in node.body:
            self.visit(stmt)
        self.level -= 1
        self.emit("end loop")

    def visit_While(self, node: ast.While):
        self.emit(f"WHILE {self.expr(node.test)} DO")
        self.level += 1
        for stmt in node.body:
            self.visit(stmt)
        self.level -= 1
        self.emit("END WHILE")

    def visit_Expr(self, node: ast.Expr):
        if isinstance(node.value, ast.Call):
            call = node.value
            if getattr(call.func, "id", None) == "print":
                args = ", ".join(self.expr(a) for a in call.args)
                self.emit(f"OUTPUT {args}")
                return
        self.emit(f"// ⚠ Unhandled expression: {ast.unparse(node)}")

    # ---------- Expressions ---------- #
    def expr(self, node):
        if isinstance(node, ast.Constant):
            return repr(node.value)
        if isinstance(node, ast.Name):
            return node.id
        if isinstance(node, ast.BinOp):
            op_map = {ast.Add: "+", ast.Sub: "-", ast.Mult: "*", ast.Div: "/", ast.Mod: "mod", ast.FloorDiv: "div"}
            return f"{self.expr(node.left)} {op_map.get(type(node.op), '?')} {self.expr(node.right)}"
        if isinstance(node, ast.Compare):
            left = self.expr(node.left)
            comp_map = {ast.Eq: "=", ast.NotEq: "≠", ast.Lt: "<", ast.LtE: "≤", ast.Gt: ">", ast.GtE: "≥"}
            parts = [left]
            for op, right in zip(node.ops, node.comparators):
                parts.append(comp_map.get(type(op), "?"))
                parts.append(self.expr(right))
            return " ".join(parts)
        # fallback
        return ast.unparse(node)


def convert(code: str) -> str:
    tree = ast.parse(code, mode="exec")
    conv = Converter()
    return conv.visit(tree)


if __name__ == "__main__":
    src = sys.stdin.read()
    print(convert(src))
```

> **TODO 拡張**: `try/except`, `with`, `list comprehension`, `for … in list`, `input()` 解析、`class` 定義 などを追加実装可能。

---

##

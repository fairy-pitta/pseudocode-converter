# Java → IB Pseudocode 変換基盤設計書 v2.0

---

## 1️⃣ 概要

| 項目       | 内容                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **目的**   | Java ソースを **正規表現ベースパーサー** で解析し、Cambridge IB 準拠の読みやすい擬似コードに変換する。                                               |
| **成果物**  | *ライブラリ* **`java-to-ib`** - 軽量で実用的な変換ツール                                                                                 |
| **非目標**  | 完全なJava構文解析、型推論、意味解析、複雑な最適化                                                                           |
| **設計思想** | **実用性重視**: 教育現場で実際に使われるJavaコードパターンに特化した変換 |

---

## 2️⃣ ディレクトリ構成

````
root/
├─ lib/
│  ├─ java-ib/                    # メインライブラリ
│  │   ├─ constants.ts             # IB疑似コード定数・キーワード・演算子
│  │   ├─ types.ts                 # 基本型定義
│  │   ├─ parser.ts                # メインパーサー
│  │   └─ index.ts                 # エクスポート
│  └─ __tests__/
│      └─ java-ib-parser.test.ts   # テストファイル
````

---

## 3️⃣ データフロー詳細

```
          +--------------------+
          |  Java Source File  |
          +--------------------+
                     │
      (A) parse()    ▼  tree‑sitter‑java
          +--------------------+
          |        CST         |
          +--------------------+
                     │
      (B) convert   ▼  直接変換
          +--------------------+
          |  IB Pseudocode     |
          +--------------------+
```

### 3.1 変換例

**Java入力:**
```java
if (x == 0) {
    System.out.println("zero");
}
```

**出力疑似コード:**
```
if X = 0 then
    output "zero"
end if
```

---

## 4️⃣ 変換ルール拡張

### 4.1 メソッド呼び出し → `output`

| Java 呼び出し                  | 変換            | 備考               |
| -------------------------- | ------------- | ---------------- |
| `System.out.println(expr)` | `OUTPUT expr` | 文字列はダブルクォート保持    |
| `System.out.print(expr)`   | `OUTPUT expr` | 改行有無を気にしない IB 流儀 |

### 4.2 入出力のスキャナ

| Java                                   | IB                          |
| -------------------------------------- | --------------------------- |
| `Scanner sc = new Scanner(System.in);` | `INPUT varName` コメント付き TODO |

> **メモ:** 入力系は IB 試験では簡略化して `INPUT <var>` 一行で表す。

### 4.3 クラス / メソッド宣言

* `class_declaration` → 無視（擬似コード対象外）
* `method_declaration`:
    * `main` メソッド: 中身を走査し、擬似コードに変換
    * その他のメソッド: 無視

### 4.4 データ構造の変換

| Java 要素             | IB 疑似コード                                  | 備考                                                                 |
| --------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| 配列 (e.g., `int[] a`) | `A[index]` (変数名大文字化)                     | 基本的な配列アクセスのみ対応         |
| 文字列 (`String`)       | `MYWORD = "text"` (変数名大文字化)             | 基本的な文字列操作のみ対応                                                 |
| その他のコレクション        | 対応しない                 | 複雑なデータ構造は変換対象外 |

### 4.5 識別子と演算子の変換

* **識別子**: Javaの変数名、メソッド名をIBの命名規則に変換する。
    * 変数名: `myVariable` → `MYVARIABLE` (すべて大文字)
    * メソッド呼び出し: `object.myMethod()` → `OBJECT.myMethod()` (メソッド名はcamelCaseのまま、オブジェクト名は大文字化)
* **演算子マッピング**:

| Java 演算子 | IB 疑似コード演算子 | 備考                               |
| ----------- | ----------------- | ---------------------------------- |
| `==` (比較) | `=`               |                                    |
| `!=`        | `≠`               |                                    |
| `>`         | `>`               |                                    |
| `>=`        | `>=`              |                                    |
| `<`         | `<`               |                                    |
| `<=`        | `<=`              |                                    |
| `&&`        | `AND`             |                                    |
| `||`        | `OR`              |                                    |
| `!`         | `NOT`             |                                    |
| `%`         | `mod`             |                                    |
| `/` (整数同士) | `div`             | 浮動小数点数を含む場合は通常の `/` を検討 |

### 4.6 制御構造の変換詳細

* **For ループ**:
    * Cスタイル `for(int i=0; i<N; i++)`: `loop I from 0 to N-1`
    * 拡張for: 対応しない
* **While ループ**:
    * `while (condition)`: `loop while condition`
* **If文**:
    * `if (condition)`: `if condition then`
* **Switch-Case**: 対応しない

### 4.7 コメントの扱い

* Javaソース内のコメントは基本的に無視する（シンプルな実装のため）

### 4.8 エラーハンドリング (`try-catch`)

* `try-catch-finally` 構造は対応しない（変換対象外）

---

## 5️⃣ 実装アプローチ

### 5.1 シンプルな変換処理

```ts
export function convertJavaToIB(javaCode: string): string {
  // tree-sitter-javaでパース
  const tree = parser.parse(javaCode);
  
  // CSTを直接走査して擬似コードに変換
  return convertNode(tree.rootNode);
}

function convertNode(node: SyntaxNode): string {
  switch (node.type) {
    case 'if_statement':
      return convertIfStatement(node);
    case 'for_statement':
      return convertForStatement(node);
    case 'while_statement':
      return convertWhileStatement(node);
    case 'expression_statement':
      return convertExpressionStatement(node);
    default:
      return convertChildren(node);
  }
}
```

### 5.2 終端記号マッピング

| Java構文 | IB疑似コード終端 |
| -------- | --------------- |
| `if` | `end if` |
| `for` | `end loop` |
| `while` | `end loop` |

---

## 6️⃣ 実装方針

### 基本方針
* シンプルで直接的な変換
* 複雑な最適化は行わない
* 基本的なJava構文のみサポート
* エラーハンドリングは最小限

--- 

## 7️⃣ テスト戦略

### 7.1 メインテストファイル (`__tests__/java-ib-parser.test.ts`)

現在のテスト実装は `__tests__/java-ib-parser.test.ts` に集約されており、以下の変換機能を網羅的にテストしている：

**基本変換テスト**:
* `should convert variable declaration and assignment for int, String, boolean`
    * Java: `int count = 10; String name = "Test"; boolean flag = true;`
    * 期待値: `COUNT ← 10\nNAME ← "Test"\nFLAG ← TRUE`

* `should convert System.out.println to output`
    * Java: `System.out.println("Hello World"); System.out.println(count);`
    * 期待値: `output "Hello World"\noutput COUNT`

**制御構造テスト**:
* `should convert simple if statement`
    * Java: `if (x > 5) { System.out.println("Greater"); }`
    * 期待値: `if X > 5 then\n    output "Greater"\nend if`

* `should convert if-else statement`
    * Java: `if (y < 5) { ... } else { ... }`
    * 期待値: `if Y < 5 then\n    output "Less"\nelse\n    output "Not less"\nend if`

* `should convert for loop (increment)`
    * Java: `for (int i = 0; i < 3; i++) { System.out.println(i); }`
    * 期待値: `loop I from 0 to 2\n    output I\nend loop`

* `should convert while loop`
    * Java: `while (k < 3) { System.out.println(k); k++; }`
    * 期待値: `loop while K < 3\n    output K\n    K ← K + 1\nend loop`

* `should convert nested if statements`
    * ネストした if 文の正確な変換とインデント処理

* `should convert if-else-if-else chain`
    * 複数の else if 条件分岐の変換

**演算子・式テスト**:
* `should convert arithmetic operations`
    * Java: `int sum = a + b; int quot = a / b; int rem = a % b;`
    * 期待値: `SUM ← A + B; QUOT ← A DIV B; REM ← A MOD B`

* `should convert increment and decrement operations`
    * Java: `val++; anotherVal--;`
    * 期待値: `VAL ← VAL + 1; ANOTHERVAL ← ANOTHERVAL - 1`

* `should convert comparison operations`
    * Java: `p == q; p != q; p >= q; p <= q`
    * 期待値: `P = Q; P ≠ Q; P ≥ Q; P ≤ Q`

* `should convert logical operations`
    * Java: `condition1 && condition2; condition1 || condition2; !condition1`
    * 期待値: `CONDITION1 AND CONDITION2; CONDITION1 OR CONDITION2; NOT CONDITION1`

* `should convert complex arithmetic expressions`
    * 複雑な括弧付き演算式の変換と演算子優先順位の処理

**文字列処理テスト**:
* `should convert string concatenation`
    * Java: `String fullName = firstName + " " + lastName;`
    * 期待値: `FULLNAME ← FIRSTNAME + " " + LASTNAME`

### 7.2 テスト実装の特徴

**デバッグ機能**:
* `java-ast` パーサーの直接呼び出しによるAST出力
* 詳細なコンソールログ出力（期待値vs実際値の比較）
* 文字レベルでの差分検出機能
* 行ごとの詳細比較機能

**テストセットアップ**:
* `beforeEach()` で `Java2IB` パーサーインスタンスを初期化
* `describe()` ブロックで「Java to IB Pseudocode Parser」として統合

### 7.3 テスト方針

* 現在の `__tests__/java-ib-parser.test.ts` で十分
* 基本的な変換機能のテストに集中
* 複雑なエッジケースは対象外

--- 

## 8️⃣ 実装上の注意点

### 8.1 基本方針

* **シンプルさ優先**: 複雑な機能は実装しない
* **基本構文のみ**: if, for, while, 変数宣言、出力のみサポート
* **直接変換**: 中間表現は使わず、CSTから直接擬似コードに変換
* **エラー処理**: 未対応構文は無視またはコメント化

### 8.2 変換ルール

* **変数名**: 全て大文字に変換
* **演算子**: 基本的なもののみ（`==` → `=`, `!=` → `≠`, `%` → `mod`）
* **制御構造**: 基本的なif, for, whileのみ
* **出力**: `System.out.println()` → `output`

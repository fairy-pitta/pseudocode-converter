# 2025-06-09 Java → IB Pseudocode 変換基盤設計書 **CST Edition v4 (Detailed)**

> **Status:** Draft · *Last updated: 2025‑06‑10*
> **Maintainer:** Jasmine Ong Jie Min \<jasmine\@fairy‑pitta.dev>

---

## 1️⃣ 概要

| 項目       | 内容                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **目的**   | Java ソースを **tree‑sitter‑java** で CST 化し、Cambridge IB 準拠の読みやすい擬似コードにワンコマンド変換する。                                               |
| **成果物**  | *ライブラリ* **`java-to-ib`**、*CLI* **`j2ib`**、*VS Code Extension* **`vscode-java-to-ib`**、*Web Playground* (Monaco + WASM build) |
| **コア要件** | 100 % 自動化 / 完全離線動作 / ソース位置追跡 / 英語・日本語コメントを保持                                                                                 |
| **非目標**  | 型推論、意味解析、Java 17+ 新構文 (record pattern etc.) はベータ扱い                                                                           |

---

## 2️⃣ ディレクトリ構成

````
java-to-ib/
├─ src/
│  ├─ cst/
│  │   ├─ loader.ts          # tree‑sitter 初期化
│  │   └─ helpers.ts         # Node util (fieldFor/hasChild)
│  ├─ visitor/
│  │   ├─ base.ts            # Depth‑first generic visitor
│  │   ├─ expressions.ts     # 式系ノード専用 visitor
│  │   └─ statements.ts      # 文系ノード専用 visitor
│  ├─ ir/
│  │   ├─ types.ts           # IR 型定義
│  │   ├─ builder.ts         # CST → IR 変換
│  │   └─ printer.ts         # デバッグ用 pretty‑print
│  ├─ emitter/
│  │   ├─ pseudocode.ts      # メイン出力
│  │   ├─ markdown.ts        # ```pcd ``` フェンス包み
│  │   └─ html.ts            # Playground 用ハイライト出力
│  ├─ cli.ts                 # Commander CLI
│  └─ index.ts               # API surface
├─ playground/               # Vite + Monaco demo
├─ grammars/                 # tree‑sitter WASM + bindings
├─ tests/
│  ├─ fixture‑samples/*.java
│  ├─ unit/visitor‑*.test.ts
│  ├─ unit/emitter‑*.test.ts
│  └─ e2e/*.test.ts
└─ docs/
   └─ spec.md                # 本ファイルコピー
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
                     │ visitor
      (B) traverse  ▼
          +--------------------+
          |      IR Builder    |
          +--------------------+
                     │
      (C) emit      ▼  strategy pattern
          +--------------------+
          |    Pseudocode Out  |
          +--------------------+
                     │
      (D) format    ▼  wrappers
          +--------------------+
          |  Markdown / HTML   |
          +--------------------+
```

### 3.1 IR 例

```jsonc
{
  "kind": "if",
  "text": "IF x = 0 THEN",
  "children": [
    { "kind": "output", "text": "OUTPUT \"zero\"", "children": [], "loc": {"line":3,"column":4} }
  ],
  "loc": {"line":2,"column":0}
}
```

結果擬似コード:

```
IF x = 0 THEN
    OUTPUT "zero"
ENDIF
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

* `class_declaration` → `// CLASS <Name>` 行コメントのみ (処理本体は擬似コード対象外)。
* `method_declaration`:
    * `main` メソッド: 中身を走査し、擬似コードに変換。
    * その他のメソッド: IB試験では手続きや関数も擬似コードで記述する場合があるため、限定的にサポートを検討。当面はコメント化する方針だが、将来的には `PROCEDURE <Name>() ... ENDPROCEDURE` や `FUNCTION <Name>() RETURNS <Type> ... ENDFUNCTION` のような形式への変換も視野に入れる。

### 4.4 データ構造の変換

| Java 要素             | IB 疑似コード                                  | 備考                                                                 |
| --------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| 配列 (e.g., `int[] a`) | `A[index]` (変数名大文字化)                     | インデックスは0から。CSTからIRへの変換時に変数名とアクセス方法を変換。         |
| 文字列 (`String`)       | `MYWORD = "text"` (変数名大文字化)             | 代入、比較、出力をサポート。                                                 |
| `ArrayList<T>`        | `COLLECTION` (または具体的な名前)                 | `.addItem()`, `.resetNext()`, `.getNext()`, `.hasNext()`, `.isEmpty()` に対応するJavaメソッドとのマッピングを定義。例: `list.add()` → `COL.addItem()`, `iterator.hasNext()` → `COL.hasNext()` など。 |
| `Stack<T>`            | `STACK` (または具体的な名前)                     | `.push()`, `.pop()`, `.isEmpty()` に対応。HL Only。                      |
| `Queue<T>`, `Deque<T>` | `QUEUE` (または具体的な名前)                     | `.enqueue()` (e.g. `add()`, `offer()`), `.dequeue()` (e.g. `remove()`, `poll()`), `.isEmpty()` に対応。HL Only。 |

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
    * 拡張for `for(Type item : collection)`: `COLLECTION.resetNext() loop while COLLECTION.hasNext() ITEM = COLLECTION.getNext() ... end loop` のような形に展開。
* **Repeat-Until ループ (Java `do-while`)**:
    * `do { ... } while (condition);` → `loop ... until NOT (condition)` または `loop ... statements ... until condition` (IBの `UNTIL` はループ継続条件である点に注意し、Javaの `while` の終了条件と逆転させる必要があるか確認)
* **Switch-Case**:
    * Javaの `switch` 文を、IBの `CASE OF ... OTHERWISE ... ENDCASE` 構造にマッピングする。`break` の扱いに注意。

### 4.7 コメントの扱い

* Javaソース内の単行コメント (`//`) および複数行コメント (`/* ... */`) は、CSTからIR、そして最終的な擬似コードへと適切に伝播させ、可能な限り元の位置に近い場所に出力する。

### 4.8 エラーハンドリング (`try-catch`)

* Javaの `try-catch-finally` 構造は、IB疑似コードには直接対応する構文がないため、以下の方針を検討:
    * `try` ブロック内のコードは通常通り変換。
    * `catch` ブロックや `finally` ブロックはコメントアウトするか、処理内容を簡略化してコメントとして記述。
    * `ENDTRY` は設計書にあるが、具体的な出力形式を定義する。

---

## 5️⃣ Emitter アルゴリズム

```ts
function emit(ir: IR, indent = 0): string[] {
  const pad = ' '.repeat(indent * 4);
  const out: string[] = [];
  out.push(pad + ir.text);
  for (const child of ir.children) out.push(...emit(child, indent + 1));
  if (needsTerminator(ir.kind)) {
    const term = terminator(ir.kind);
    out.push(pad + term);
  }
  return out;
}
```

`needsTerminator()` と `terminator()` は以下テーブルで自動決定。

| kind                     | terminator         |
| ------------------------ | ------------------ |
| `if` / `elseif` / `else` | `ENDIF`            |
| `for`                    | `NEXT <index>`     |
| `while`                  | `ENDWHILE`         |
| `repeat`                 | `UNTIL <condition>` | Javaの `do-while` に相当 |
| `case` / `switch`        | `ENDCASE`          |
| `try`                    | `ENDTRY`           |

---

## 6️⃣ 性能指標

| 指標                    | 目標                               |
| --------------------- | -------------------------------- |
| 1,000 行の Java に対し変換時間 | < **80 ms** (M1 Pro)             |
| メモリ使用量                | < **100 MB** peak                |
| tree‑sitter パース失敗率    | < **0.1 %** (fixture 3,000 ファイル) |

### 最適化ポイント

* tree‑sitter の byte‑slice reuse を有効化 (`setTimeoutParsing(true)`).
* Visitor で不要フィールドを早期 return。深さ 10 以上のパスをキャッシュ。
* IR生成時に、IB仕様にないJava特有の構文要素（例：型宣言、アクセス修飾子など）は適切に無視またはコメント化するロジックを組み込む。
* **ネスト構造の深さ制限**: VisitorパターンでCSTを走査する際、再帰呼び出しの深さを管理する。ネストが10階層を超えた場合は、それ以上の詳細な変換を試みず、`// ... deeply nested code ...` のようなコメントで省略するか、処理を中断して警告を出すことを検討する。これは無限ループや過度な複雑性を持つコードによる変換処理の停止を防ぐため。

--- 

## 7️⃣ テスト戦略

* **単体テスト (`unit/`)**:
    * `visitor-*.test.ts`: 各CSTノードタイプに対応するVisitorが正しくIRノードを生成するかをテスト。
    * `emitter-*.test.ts`: 各IRノードタイプが正しく擬似コード文字列を生成するかをテスト。
* **E2Eテスト (`e2e/`)**:
    * `fixture-samples/*.java` にあるJavaソースファイルを入力とし、期待される擬似コード出力と一致するかを比較。
    * フィクスチャには、IB Pseudocode Specification に記載のある各種データ構造、演算子、制御構造、メソッド呼び出しパターンを網羅するテストケースを含める。
        * 配列の操作 (宣言、代入、アクセス)
        * 文字列の操作
        * コレクション、スタック、キューの各メソッド呼び出し
        * 全ての論理演算子、比較演算子、算術演算子 (`mod`, `div` 含む)
        * `if-then-else`, `loop while`, `loop for`, `loop repeat-until`, `case of`
        * `System.out.print/println` および `Scanner` を利用した入出力
        * `main` メソッドおよびその他のメソッド（コメント化されるケースも含む）
        * コメントの保持
        * 深いネスト構造（if文やループが10階層以上ネストしているケース）

--- 

## 8️⃣ 実装上の注意点と検討事項

### 8.1 Visitor (CST → IR 変換)

*   **状態管理**: Visitor内で現在のコンテキスト（例：ループ内にいるか、if文の条件式内かなど）を適切に管理し、IRノード生成に活かす。
*   **網羅性**: `tree-sitter-java` が生成する全てのCSTノードタイプに対して、対応するVisitor処理を定義するか、意図的に無視するかの判断が必要。未対応ノードは警告を出すか、コメントとしてスルーする。
*   **Java特有構文の処理**: IB疑似コードに直接対応しないJava構文（ラムダ式、Stream API、アノテーション、ジェネリクスの複雑な型情報など）は、以下のように段階的に対応を検討する。
    *   フェーズ1: コメントアウトまたは警告表示。
    *   フェーズ2: 限定的なパターンについて、単純なIB疑似コード表現に置き換え（例：簡単なラムダ式をインライン処理に展開）。
    *   高度なものは変換対象外とし、ドキュメントで明記。
*   **演算子の優先順位と括弧**: JavaとIB疑似コードで演算子の優先順位が異なる場合や、変換によって曖昧さが生じる可能性がある場合は、IR生成時またはEmitterで適切に括弧を補う必要がある。
*   **変数スコープと命名**: Javaの変数スコープ（ブロックローカル、メソッドローカル、クラスメンバ等）をIB疑似コードのより単純なスコープ概念にマッピングする際の衝突を避けるため、IRで変数名を一意化する戦略を検討（例：サフィックス付与）。IBの変数は大文字であるため、変換時に大文字化する。

### 8.2 Emitter (IR → 擬似コード出力)

*   **インデント処理**: IRの階層構造に基づいて、擬似コードのインデントを正確に生成する。
*   **終端記号の自動挿入**: `IF`に対する`ENDIF`、`LOOP`に対する`ENDLOOP`など、ブロック構造の終端記号をIRの`kind`に基づいて自動的に挿入する。
*   **可読性**: 生成される擬似コードの可読性を高めるため、適切な改行やスペースの挿入ルールを設ける。
*   **`div` vs `/`**: Javaの `/` 演算子は、オペランドが整数同士の場合は整数除算、浮動小数点数を含む場合は浮動小数点除算となる。IB疑似コードでは `div` が整数除算を明示するため、CST/IRレベルでオペランドの型情報を（限定的にでも）推測できない場合、ユーザーに選択を促すか、より安全な側に倒す（例：常に `/` を使い、コメントで注意を促す）などの対策が必要。

### 8.3 全体的な課題

*   **ソースマッピングの維持**: 生成された擬似コードの各行が、元のJavaソースコードのどの部分に対応するかの情報を保持し、デバッグやトレーサビリティに役立てる（VS Code拡張機能などで利用）。
*   **設定可能性**: 変換ルールの細部（例：特定のJavaライブラリ関数の独自マッピング）をユーザーが設定ファイル等でカスタマイズできる仕組みを将来的に検討。
*   **大規模ファイルの処理**: 数千行を超えるような大規模Javaファイルの変換パフォーマンスとメモリ使用量を監視し、必要に応じて最適化を行う（ストリーミング処理の導入検討など）。

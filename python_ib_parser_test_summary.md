# Python to IB Pseudocode Parser テストケース概要

このドキュメントは `__tests__/python-ib-parser.test.ts` に含まれるテストケースの概要をまとめたものです。

## テストケース一覧

1.  **単純な代入 (`should convert simple assignment`)**
    *   **目的:** Pythonの単純な代入文（例: `x = 10`）が、IB疑似コードの代入文（例: `x ← 10`）に正しく変換されることを確認します。

2.  **print文 (`should convert print statement`)**
    *   **目的:** Pythonの `print` 文（例: `print("Hello, World!")`）が、IB疑似コードの `OUTPUT` 文（例: `OUTPUT "Hello, World!"`）に正しく変換されることを確認します。

3.  **input文 (`should convert input statement`)**
    *   **目的:** Pythonの `input` 文（例: `name = input("Enter your name: ")`）が、IB疑似コードの `INPUT` 文（例: `INPUT name`）に正しく変換されることを確認します。

4.  **if文 (`should convert if statement`)**
    *   **目的:** Pythonの `if` 文が、IB疑似コードの `IF ... THEN ... END IF` 構造に正しく変換されることを確認します。
        *   例:
            ```python
            if x > 5:
              print("Greater")
            ```
            が
            ```pseudocode
            IF x > 5 THEN
              OUTPUT "Greater"
            END IF
            ```
            に変換されること。

5.  **if-else文 (`should convert if-else statement`)**
    *   **目的:** Pythonの `if-else` 文が、IB疑似コードの `IF ... THEN ... ELSE ... END IF` 構造に正しく変換されることを確認します。

6.  **if-elif-else文 (`should convert if-elif-else statement`)**
    *   **目的:** Pythonの `if-elif-else` 文が、IB疑似コードの `IF ... THEN ... ELSE IF ... THEN ... ELSE ... END IF` 構造に正しく変換されることを確認します。

7.  **range指定のforループ (`should convert for loop with range`)**
    *   **目的:** Pythonの `range` を使用した `for` ループが、IB疑似コードの `loop ... from ... to ... ... end loop` 構造に正しく変換されることを確認します。
        *   例: `for i in range(5):` が `loop i from 0 to 4` に変換されること。

8.  **rangeとstep指定のforループ (`should convert for loop with range and step`)**
    *   **目的:** Pythonの `range` と `step` を使用した `for` ループが、IB疑似コードの `loop ... from ... to ... step ... ... end loop` 構造に正しく変換されることを確認します。
        *   例: `for i in range(0, 10, 2):` が `loop i from 0 to 9 step 2` に変換されること。

9.  **コレクションに対するforループ (`should convert for loop over a collection`)**
    *   **目的:** Pythonのコレクションに対する `for` ループが、IB疑似コードの `loop for each ... in ... ... end loop` 構造に正しく変換されることを確認します。

10. **whileループ (`should convert while loop`)**
    *   **目的:** Pythonの `while` ループが、IB疑似コードの `loop while ... ... end loop` 構造に正しく変換されることを確認します。

11. **関数定義 (`should convert function definition`)**
    *   **目的:** Pythonの関数定義が、IB疑似コードの `FUNCTION ... END FUNCTION` 構造に正しく変換されることを確認します。f-string が適切に連結処理されるかも確認します。
        *   例:
            ```python
            def greet(name):
              print(f"Hello, {name}")
            ```
            が
            ```pseudocode
            FUNCTION greet(name)
              OUTPUT "Hello, " + name + "!"
            END FUNCTION
            ```
            に変換されること。

12. **return文を含む関数定義 (`should convert function definition with return`)**
    *   **目的:** Pythonの `return` 文を含む関数定義が、IB疑似コードの `FUNCTION ... RETURN ... END FUNCTION` 構造に正しく変換されることを確認します。

13. **クラス定義 (`should convert class definition`)**
    *   **目的:** Pythonのクラス定義が、IB疑似コードの `CLASS ... END CLASS` 構造に正しく変換されることを確認します。メソッド定義（`__init__` を含む）も適切に変換されることを確認します。

14. **コメント (`should handle comments`)**
    *   **目的:** Pythonのコメント（`#`）が、IB疑似コードのコメント（`//`）に正しく変換されることを確認します。

15. **try-exceptブロック (`should handle try-except block`)**
    *   **目的:** Pythonの `try-except` ブロックが、IB疑似コードの `TRY ... CATCH ... END TRY` 構造に正しく変換されることを確認します。

16. **try-except-finallyブロック (`should handle try-except-finally block`)**
    *   **目的:** Pythonの `try-except-finally` ブロックが、IB疑似コードの `TRY ... CATCH ... FINALLY ... END TRY` 構造に正しく変換されることを確認します。

17. **複合代入演算子 (+=) (`should convert compound assignment (+=)`)**
    *   **目的:** Pythonの複合代入演算子 `+=` （例: `x += 5`）が、IB疑似コードの通常の代入と算術演算（例: `x ← x + 5`）に正しく変換されることを確認します。

18. **複合代入演算子 (-=) (`should convert compound assignment (-=)`)**
    *   **目的:** Pythonの複合代入演算子 `-=` （例: `y -= 3`）が、IB疑似コードの通常の代入と算術演算（例: `y ← y - 3`）に正しく変換されることを確認します。

19. **論理演算子 (and, or, not) (`should convert logical operators (and, or, not)`)**
    *   **目的:** Pythonの論理演算子 `and`, `or`, `not` が、IB疑似コードの対応する演算子（`AND`, `OR`, `NOT`）に正しく変換されることを確認します（`IF` 文のコンテキストで）。

20. **f-stringのprint文 (`should convert f-string print to concatenation in IB style`)**
    *   **目的:** Pythonのf-stringを使用した `print` 文が、IB疑似コードの文字列連結を用いた `OUTPUT` 文に正しく変換されることを確認します。
        *   例:
            ```python
            name = "World"
            print(f"Hello, {name}!")
            ```
            が
            ```pseudocode
            name ← "World"
            OUTPUT "Hello, " + name + "!"
            ```
            に変換されること。
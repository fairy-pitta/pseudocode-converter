# Python to IGCSE Pseudocode Parser - テスト結果まとめ

## テスト実行結果概要

**実行日時:** 2024年12月現在  
**総テスト数:** 42  
**成功:** 26  
**失敗:** 16  
**成功率:** 61.9%

## 成功したテスト (26個)

1. ✅ **should handle variable declarations** - 変数宣言の処理
2. ✅ **should handle constants** - 定数の処理
3. ✅ **should handle basic assignment** - 基本的な代入
4. ✅ **should handle arithmetic operations** - 算術演算
5. ✅ **should handle string concatenation** - 文字列連結
6. ✅ **should handle boolean operations** - ブール演算
7. ✅ **should handle comparison operations** - 比較演算
8. ✅ **should handle simple if statement** - 単純なif文
9. ✅ **should handle if-else statement** - if-else文
10. ✅ **should handle if-elif-else statement** - if-elif-else文
11. ✅ **should handle nested if statements** - ネストしたif文
12. ✅ **should handle for loop with range** - rangeを使ったforループ
13. ✅ **should handle for loop with step** - ステップ付きforループ
14. ✅ **should handle for loop with positive step** - 正のステップのforループ
15. ✅ **should handle for loop over collection** - コレクションのforループ
16. ✅ **should handle while loop** - whileループ
17. ✅ **should handle while loop with complex condition** - 複雑な条件のwhileループ
18. ✅ **should handle function definition** - 関数定義
19. ✅ **should handle function with return** - 戻り値のある関数
20. ✅ **should handle function with multiple parameters and types** - 複数パラメータの関数
21. ✅ **should handle function calls** - 関数呼び出し
22. ✅ **should handle input operations** - 入力操作
23. ✅ **should handle output operations** - 出力操作
24. ✅ **should handle arrays/lists** - 配列/リスト
25. ✅ **should handle array operations** - 配列操作
26. ✅ **should handle nested loops** - ネストしたループ

## テスト結果サマリー

**総テスト数**: 42個  
**成功**: 26個  
**失敗**: 16個  

### 成功したテスト
1. Variable declarations (変数宣言)
2. Constants (定数)
3. Basic assignment (基本代入)
4. Arithmetic operations (算術演算)
5. String concatenation (文字列連結)
6. Boolean operations (ブール演算)
7. Comparison operations (比較演算)
8. Simple if statement (単純if文)
9. If-else statement (if-else文)
10. If-elif-else statement (if-elif-else文)
11. Nested if statements (ネストしたif文)
12. For loop with range (rangeを使ったforループ)
13. For loop with step (ステップ付きforループ)
14. For loop with positive step (正のステップ付きforループ)
15. For loop over collection (コレクションのforループ)
16. While loop (whileループ)
17. Function definition (関数定義)
18. Function with return value (戻り値のある関数)
19. Function with multiple parameters (複数パラメータの関数)
20. Function calls (関数呼び出し)
21. Input statements (入力文)
22. Print statements (出力文)
23. Comments (コメント)
24. Nested loops (ネストしたループ)
25. Augmented assignment (拡張代入)
26. Global and nonlocal statements (globalとnonlocal文)

### 失敗したテスト（期待値 vs 実際値）

#### 1. **String Methods** (文字列メソッド)
**Pythonコード:**
```python
text = "Hello World"
upper_text = text.upper()
length = len(text)
first_char = text[0]
```
**期待値:**
```
text ← "Hello World"
upper_text ← UPPER(text)
length ← LENGTH(text)
first_char ← MID(text, 0, 1)
```
**実際値:** 
```
text ← "Hello World"
upper_text ← text.upper()
length ← len(text)
first_char ← text[0]
```
**問題:** 文字列メソッドと配列アクセスがPython構文のまま変換されていない

#### 2. **Boolean Values and Operations** (ブール値と演算)
**Pythonコード:**
```python
is_valid = True
is_empty = False
result = is_valid and not is_empty
```
**期待値:**
```
is_valid ← TRUE
is_empty ← FALSE
result ← is_valid AND NOT is_empty
```
**実際値:**
```
is_valid ← True
is_empty ← False
result ← is_valid and not is_empty
```
**問題:** ブール値とブール演算子がPython構文のまま

#### 3. **Complex Mathematical Expressions** (複雑な数式)
**Pythonコード:**
```python
result = (a + b) * (c - d) / (e + f)
power = x ** 2
square_root = x ** 0.5
```
**期待値:**
```
result ← (a + b) * (c - d) / (e + f)
power ← x ^ 2
square_root ← x ^ 0.5
```
**実際値:**
```
result ← (a + b) * (c - d) / (e + f)
power ← x ** 2
square_root ← x ** 0.5
```
**問題:** べき乗演算子 `**` が `^` に変換されていない

#### 4. **Dictionary Operations** (辞書操作)
**Pythonコード:**
```python
student = {"name": "John", "age": 20}
print(student["name"])
student["grade"] = "A"
```
**期待値:**
```
TYPE StudentRecord
   name : STRING
   age : INTEGER
   grade : STRING
ENDTYPE

student.name ← "John"
student.age ← 20
OUTPUT student.name
student.grade ← "A"
```
**実際値:** 辞書構文のまま変換されていない
**問題:** 辞書をレコード型に変換する機能が未実装

#### 5. **Break and Continue in Loops** (ループ内のbreakとcontinue)
**Pythonコード:**
```python
for i in range(10):
    if i == 5:
        break
    if i % 2 == 0:
        continue
    print(i)
```
**期待値:**
```
FOR i ← 0 TO 9
   IF i = 5 THEN
      EXIT FOR
   IF i MOD 2 = 0 THEN
      NEXT i
   OUTPUT i
   ENDIF
   ENDIF
NEXT i
```
**実際値:** `break`と`continue`がそのまま残っている
**問題:** 制御フロー文の変換が未実装

#### 6. **Multiple Variable Assignment** (多重代入)
**Pythonコード:**
```python
a, b = 1, 2
x, y, z = 10, 20, 30
```
**期待値:**
```
a ← 1
b ← 2
x ← 10
y ← 20
z ← 30
```
**実際値:** タプル代入のまま
**問題:** 多重代入の分割が未実装

#### 7. **Lambda Functions** (ラムダ関数)
**Pythonコード:**
```python
square = lambda x: x * x
result = square(5)
```
**期待値:**
```
FUNCTION Square(x : INTEGER) RETURNS INTEGER
   RETURN x * x
ENDFUNCTION

result ← Square(5)
```
**実際値:** lambda構文のまま
**問題:** ラムダ関数の変換が未実装

#### 8. **List Comprehensions** (リスト内包表記)
**Pythonコード:**
```python
squares = [x*x for x in range(5)]
```
**期待値:**
```
index ← 0
FOR x ← 0 TO 4
   squares[index] ← x * x
   index ← index + 1
NEXT x
```
**実際値:** リスト内包表記のまま
**問題:** リスト内包表記のループ展開が未実装

#### 9. **Try-Except Blocks** (例外処理)
**Pythonコード:**
```python
try:
    result = 10 / x
except:
    print("Error occurred")
```
**期待値:**
```
// Error handling: try-except block
IF x ≠ 0 THEN
   result ← 10 / x
ELSE
   OUTPUT "Error occurred"
ENDIF
```
**実際値:** try-except構文のまま
**問題:** 例外処理のIF-ELSE変換が未実装

#### 10. **File Operations** (ファイル操作)
**Pythonコード:**
```python
with open("input.txt", "r") as file:
    for line in file:
        print(line.strip())
```
**期待値:**
```
OPENFILE "input.txt" FOR READ
WHILE NOT EOF("input.txt")
   READFILE "input.txt", line
   OUTPUT line
ENDWHILE
CLOSEFILE "input.txt"
```
**実際値:** with open構文のまま
**問題:** ファイル操作の変換が未実装

#### 11. **Class Definition** (クラス定義)
**Pythonコード:**
```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        print("Animal sound")
```
**期待値:**
```
CLASS Animal
   PRIVATE name : STRING
   
   PUBLIC PROCEDURE NEW(name : STRING)
      self.name ← name
   ENDPROCEDURE
   
   PUBLIC PROCEDURE Speak()
      OUTPUT "Animal sound"
   ENDPROCEDURE
ENDCLASS
```
**実際値:** Python class構文のまま
**問題:** クラス定義の変換が未実装

#### 12. **Object Instantiation and Method Calls** (オブジェクトのインスタンス化とメソッド呼び出し)
**Pythonコード:**
```python
my_dog = Dog("Buddy")
my_dog.speak()
```
**期待値:**
```
DECLARE my_dog : Dog
my_dog ← NEW Dog("Buddy")
CALL my_dog.Speak()
```
**実際値:** Python構文のまま
**問題:** オブジェクト操作の変換が未実装

#### 13. **Class Inheritance** (クラス継承)
**Pythonコード:**
```python
class Dog(Animal):
    def speak(self):
        print("Woof")
```
**期待値:**
```
CLASS Dog INHERITS Animal
   PUBLIC PROCEDURE Speak()
      OUTPUT "Woof"
   ENDPROCEDURE
ENDCLASS
```
**実際値:** Python継承構文のまま
**問題:** 継承の変換が未実装

#### 14. **File Writing** (ファイル書き込み)
**Pythonコード:**
```python
with open("output.txt", "w") as file:
    file.write("Hello World")
    file.write(str(number))
```
**期待値:**
```
OPENFILE "output.txt" FOR WRITE
WRITEFILE "output.txt", "Hello World"
WRITEFILE "output.txt", number
CLOSEFILE "output.txt"
```
**実際値:** with open構文のまま
**問題:** ファイル書き込みの変換が未実装

#### 15. **Try-Except-Finally Blocks** (例外処理 - finally付き)
**Pythonコード:**
```python
try:
    file = open("data.txt")
    data = file.read()
except:
    print("File not found")
finally:
    print("Cleanup")
```
**期待値:**
```
// Error handling: try-except-finally block
OPENFILE "data.txt" FOR READ
IF file_exists THEN
   READFILE "data.txt", data
ELSE
   OUTPUT "File not found"
ENDIF
OUTPUT "Cleanup"
CLOSEFILE "data.txt"
```
**実際値:** try-except-finally構文のまま
**問題:** 複雑な例外処理の変換が未実装

#### 16. **For Loop with Negative Step** (負のステップのforループ)
**Pythonコード:**
```python
for i in range(10, 0, -1):
    print(i)
```
**期待値:**
```
FOR i ← 10 TO -1 STEP -1
   OUTPUT i
NEXT i
```
**実際値:** 範囲計算に問題がある可能性
**問題:** 負のステップの範囲計算が正しく処理されていない

## 主な問題点

1. **文字列メソッドの変換:** `text[0]` が `MID(text, 0, 1)` に変換されていない
2. **リスト・辞書操作:** 複雑なデータ構造の操作が適切に変換されていない
3. **オブジェクト指向機能:** クラス、メソッド、インスタンス化の変換が未実装
4. **高度なPython機能:** ラムダ、リスト内包表記、例外処理の変換が未実装
5. **制御フロー:** break、continue、global、nonlocalの変換が未実装

## 推奨される修正順序

1. **文字列メソッドの修正** (比較的簡単)
2. **リスト・配列操作の改善**
3. **辞書操作の実装**
4. **制御フロー文の実装**
5. **オブジェクト指向機能の実装**
6. **高度なPython機能の実装**

## 次のステップ

失敗したテストを一つずつデバッグして修正することをお勧めします。特に文字列メソッドの変換から始めると、比較的早く成功率を向上させることができるでしょう。
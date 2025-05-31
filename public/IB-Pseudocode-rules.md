# IB Pseudocode Specification

## Data Structures and Notation Rules

### Arrays

* Indexed, ordered collection. First index = 0.
* Example: `NAMES[0]`

### Strings

* Can be assigned and compared.
* Example:

```plaintext
MYWORD = "the"
if MYWORD = "the" then
    output MYWORD
end if
```

### Collections

* Used with `.addItem()`, `.resetNext()`, `.getNext()`, `.hasNext()`, `.isEmpty()`
* Example:

```plaintext
COL.resetNext()
loop while COL.hasNext()
    ITEM = COL.getNext()
end loop
```

### Stacks (HL only)

* LIFO structure
* Methods: `.push()`, `.pop()`, `.isEmpty()`
* Example:

```plaintext
STACK.push(42)
VAL = STACK.pop()
```

### Queues (HL only)

* FIFO structure
* Methods: `.enqueue()`, `.dequeue()`, `.isEmpty()`
* Example:

```plaintext
QUEUE.enqueue("A")
X = QUEUE.dequeue()
```

## Syntax Rules

### Identifiers

* Variables: `UPPERCASE`
* Keywords: `lowercase` (e.g. `loop`, `if`, `end if`)
* Methods: `camelCase` (e.g. `getRecord`)

### Assignment and Output

```plaintext
X = 5
output X
```

### Operators

| Symbol | Meaning        | Example           |
| ------ | -------------- | ----------------- |
| =      | equals         | `X = 4`           |
| ≠      | not equal      | `X ≠ 4`           |
| >, >=  | comparison     | `if X > 3 then`   |
| <, <=  | comparison     | `if Y <= 2 then`  |
| AND    | logical AND    | `if A AND B then` |
| OR     | logical OR     | `if A OR B then`  |
| NOT    | logical NOT    | `if NOT A then`   |
| mod    | modulo         | `15 mod 4 = 3`    |
| div    | integer divide | `15 div 4 = 3`    |

## Control Structures

### If

```plaintext
if A > B then
    output A
else
    output B
end if
```

### While

```plaintext
loop while X < 10
    X = X + 1
end loop
```

### For

```plaintext
loop I from 0 to 9
    output I
end loop
```

## Examples

### Averaging Array

```plaintext
COUNT = 0
TOTAL = 0
loop I from 0 to 999
    if STOCK[I] > 0 then
        COUNT = COUNT + 1
        TOTAL = TOTAL + STOCK[I]
    end if
end loop
if NOT COUNT = 0 then
    AVG = TOTAL / COUNT
    output AVG
else
    output "No non-zero values"
end if
```

### Copy Unique from Collection

```plaintext
COUNT = 0
loop while NAMES.hasNext()
    DATA = NAMES.getNext()
    FOUND = false
    loop I from 0 to COUNT-1
        if DATA = LIST[I] then
            FOUND = true
        end if
    end loop
    if FOUND = false then
        LIST[COUNT] = DATA
        COUNT = COUNT + 1
    end if
end loop
```

### Factors

```plaintext
NUM = 140
F = 1
FACTORS = 0
loop until F * F > NUM
    if NUM mod F = 0 then
        D = NUM div F
        output F, "*", D
        if F = 1 then
            FACTORS = FACTORS + 0
        else if F = D then
            FACTORS = FACTORS + 1
        else
            FACTORS = FACTORS + 2
        end if
    end if
    F = F + 1
end loop
output FACTORS
```

### Reverse Collection

```plaintext
COUNT = 0
loop while SURVEY.hasNext()
    STACK.push(SURVEY.getNext())
    COUNT = COUNT + 1
end loop
loop I from 0 to COUNT-1
    MYARRAY[I] = STACK.pop()
end loop
```

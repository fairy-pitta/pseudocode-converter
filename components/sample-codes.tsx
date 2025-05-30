"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SampleCodesProps {
  onSelectSample: (code: string) => void
}

export function SampleCodes({ onSelectSample }: SampleCodesProps) {
  const samples = [
    {
      title: "Fibonacci Sequence",
      description: "Recursive function",
      code: `def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))`,
    },
    {
      title: "Calculator",
      description: "Functions & conditions",
      code: `# Simple calculator
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
print("Result:", answer)`,
    },
    {
      title: "Array Processing",
      description: "Loops & arrays",
      code: `# Array operations
numbers = [1, 2, 3, 4, 5]
total = 0

for num in numbers:
    total += num

average = total / len(numbers)
print("Average:", average)

# Find maximum
max_num = numbers[0]
for i in range(1, len(numbers)):
    if numbers[i] > max_num:
        max_num = numbers[i]

print("Maximum:", max_num)`,
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">サンプルコード</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {samples.map((sample, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 text-left justify-start"
            onClick={() => onSelectSample(sample.code)}
          >
            <div>
              <div className="font-medium">{sample.title}</div>
              <div className="text-sm text-gray-500">{sample.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
}

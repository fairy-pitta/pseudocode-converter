"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface IBSampleCodesProps {
  onSelectSample: (code: string) => void
}

export function IBSampleCodes({ onSelectSample }: IBSampleCodesProps) {
  const samples = [
    {
      title: "Basic Algorithm",
      description: "IB standard constructs",
      code: `# Basic algorithm with IB constructs
def find_maximum(numbers):
    max_val = numbers[0]
    for i in range(1, len(numbers)):
        if numbers[i] > max_val:
            max_val = numbers[i]
    return max_val

# Input and output
size = int(input("Enter array size: "))
arr = []
for i in range(size):
    value = int(input("Enter value: "))
    arr.append(value)

result = find_maximum(arr)
print("Maximum value:", result)`,
    },
    {
      title: "Mathematical Operations",
      description: "div, mod operators",
      code: `# Mathematical operations using div and mod
def euclidean_gcd(a, b):
    while b != 0:
        remainder = a % b  # mod operation
        quotient = a // b  # div operation
        print(f"{a} = {quotient} * {b} + {remainder}")
        a = b
        b = remainder
    return a

# Test the algorithm
num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))
gcd = euclidean_gcd(num1, num2)
print("GCD:", gcd)`,
    },
    {
      title: "Data Structures",
      description: "Arrays and collections",
      code: `# Array and collection operations
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
    return arr

# Initialize array
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)

sorted_numbers = bubble_sort(numbers)
print("Sorted array:", sorted_numbers)

# Search for element
target = int(input("Enter number to search: "))
found = False
for i in range(len(sorted_numbers)):
    if sorted_numbers[i] == target:
        print(f"Found {target} at index {i}")
        found = True
        break

if not found:
    print(f"{target} not found in array")`,
    },
    {
      title: "Complex Control Flow",
      description: "Nested conditions and loops",
      code: `# Complex control flow example
def validate_password(password):
    # Check length
    if len(password) < 8:
        return False
    
    # Check for uppercase, lowercase, and digit
    has_upper = False
    has_lower = False
    has_digit = False
    
    for char in password:
        if char.isupper():
            has_upper = True
        elif char.islower():
            has_lower = True
        elif char.isdigit():
            has_digit = True
    
    return has_upper and has_lower and has_digit

# Main program
attempts = 0
max_attempts = 3

while attempts < max_attempts:
    password = input("Enter password: ")
    
    if validate_password(password):
        print("Password accepted!")
        break
    else:
        attempts += 1
        remaining = max_attempts - attempts
        if remaining > 0:
            print(f"Invalid password. {remaining} attempts remaining.")
        else:
            print("Maximum attempts exceeded. Access denied.")`,
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">IB Computer Science Sample Code</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

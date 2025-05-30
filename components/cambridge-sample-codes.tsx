"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CambridgeSampleCodesProps {
  onSelectSample: (code: string) => void
}

export function CambridgeSampleCodes({ onSelectSample }: CambridgeSampleCodesProps) {
  const samples = [
    {
      title: "Basic Algorithm",
      description: "Cambridge standard constructs",
      code: `# Basic algorithm with Cambridge constructs
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
      description: "DIV, MOD, power operators",
      code: `# Mathematical operations using DIV and MOD
def euclidean_gcd(a, b):
    while b != 0:
        remainder = a % b  # MOD operation
        quotient = a // b  # DIV operation
        power_result = a ** 2  # Power operation
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
      title: "Array Operations",
      description: "1-based indexing and declarations",
      code: `# Array operations with Cambridge conventions
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

# Linear search
target = int(input("Enter number to search: "))
found = False
position = -1

for i in range(len(sorted_numbers)):
    if sorted_numbers[i] == target:
        position = i
        found = True
        break

if found:
    print(f"Found {target} at position {position}")
else:
    print(f"{target} not found in array")`,
    },
    {
      title: "Procedures and Functions",
      description: "PROCEDURE vs FUNCTION distinction",
      code: `# Procedures and Functions example
def display_menu():  # procedure
    print("1. Add item")
    print("2. Remove item")
    print("3. Display items")
    print("4. Exit")

def calculate_area(length, width):  # function
    area = length * width
    return area

def get_user_choice():  # function
    choice = int(input("Enter your choice: "))
    return choice

# Main program
display_menu()
user_choice = get_user_choice()

if user_choice == 1:
    length = float(input("Enter length: "))
    width = float(input("Enter width: "))
    area = calculate_area(length, width)
    print(f"Area: {area}")
else:
    print("Invalid choice")`,
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cambridge International Sample Code</h3>
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

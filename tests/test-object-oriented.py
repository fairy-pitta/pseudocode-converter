# Test file for object-oriented features

# Class definition
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
    
    def speak(self):
        return f"{self.name} makes a sound"
    
    def get_info(self):
        return f"{self.name} is a {self.species}"

# Class inheritance
class Dog(Animal):
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
        self.species = "dog"
    
    def speak(self):
        return f"{self.name} barks"
    
    def fetch(self):
        return f"{self.name} fetches the ball"

# Object instantiation
my_animal = Animal("Generic", "Unknown")
my_dog = Dog("Buddy", "Golden Retriever")

# Method calls
print(my_animal.speak())
print(my_dog.speak())
print(my_dog.fetch())

# Method assignment
animal_info = my_animal.get_info()
dog_sound = my_dog.speak()

print(animal_info)
print(dog_sound)
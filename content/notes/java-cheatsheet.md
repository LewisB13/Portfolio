---
title: Java Cheatsheet
date: 2026-05-27T21:02:00
category: Cheatsheets
tags: []
visibility: ''
---

# ☕ Java Cheat Sheet

## 1. Basic Structure

```plain
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

***

## 2. Variables

```plain
int age = 25;
double price = 10.99;
char letter = 'A';
boolean isActive = true;
String name = "Lewis";
```

***

## 3. Operators

```plain
+  -  *  /  %   // arithmetic
== != > < >= <= // comparison
&& || !         // logical
```

***

## 4. If / Else

```plain
if (age > 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}
```

***

## 5. Switch

```plain
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Other day");
}
```

***

## 6. Loops

### For loop

```plain
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

### While loop

```plain
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}
```

### For-each loop

```plain
int[] numbers = {1, 2, 3};

for (int num : numbers) {
    System.out.println(num);
}
```

***

## 7. Methods

```plain
public static int add(int a, int b) {
    return a + b;
}
```

Call:

```plain
int result = add(5, 3);
```

***

## 8. Arrays

```plain
int[] nums = {1, 2, 3, 4};

System.out.println(nums[0]);
```

***

## 9. Strings

```plain
String text = "Hello";

text.length();
text.toUpperCase();
text.toLowerCase();
text.charAt(0);
text.equals("Hello");
```

***

## 10. Classes & Objects (OOP)

```plain
class Car {
    String model;

    void drive() {
        System.out.println("Driving");
    }
}
```

Create object:

```plain
Car myCar = new Car();
myCar.model = "BMW";
myCar.drive();
```

***

## 11. Constructors

```plain
class Person {
    String name;

    Person(String name) {
        this.name = name;
    }
}
```

***

## 12. Inheritance

```plain
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
}
```

***

## 13. ArrayList

```plain
import java.util.ArrayList;

ArrayList<String> list = new ArrayList<>();

list.add("Java");
list.add("Python");

list.remove("Java");
```

***

## 14. Exceptions

```plain
try {
    int result = 10 / 0;
} catch (Exception e) {
    System.out.println("Error occurred");
}
```

***

## 15. Useful Keywords

- `public` – accessible everywhere
- `private` – only inside class
- `static` – belongs to class
- `void` – returns nothing
- `return` – sends value back
- `this` – current object


The danger of object oriented designs


Strange talk title
Why danger?
What's wrong with Object Oriented software?
(or languages)

Think About Object Oriented
What Comes to Your Mind?
Classes, like in C++, Java, C#
Class hierarchies
Maybe UML graphs?
Architectural design patterns?

What does Object Oriented mean?
Principles
Practices
Technologies
We usually get them backwards

Object Oriented Technologies
Mostly programming languages
Then, Tools and Frameworks
IDEs and Refactoring Tools
Object Relational Mappers
Dependency Injection Frameworks
Serialization Frameworks

Object Oriented Practices
Abstraction and Inheritance
Virtual Methods
Encapsulation
Information Hiding

What You Don't Notice
Model state with classes
Store state in objects
Take mutable state for granted
OOP -> POP
(Place Oriented Programming)

More things You Don't Notice
Object References!
Store them inside other objects
Pass them as method arguments
Keep them in local variables

Another basic assumption
Everything is synchronous by default
Method calls
Argument passing
Object creation

So What?
All the above are common practices
What's the problem?




At the time...
...I believed this!

A Step Back
Who invented this?
Well...

Actually I made up the term "object-oriented", and I can tell you I did not have C++ in mind.
Alan Kay
What did he have in mind?

Ahead of His Time
Alan Kay envisioned objects like cells
Isolated and Autonomous
No way to "get into" each other
Communicate through message passing

Fast Forward: S.O.L.I.D.
Robert C. Martin (Uncle Bob) ~2003
S – Single-responsiblity principle
O – Open-closed principle
L – Liskov substitution principle
I – Interface segregation principle
D – Dependency Inversion Principle




Messages vs Invocations

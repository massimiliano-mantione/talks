
The danger of object oriented designs


Strange talk title
Why danger?
What's wrong with Object Oriented software?
(or languages)

Think About Object Oriented
What Comes to Mind?
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
Use of Virtual Methods
Hide internal mutable state...
(Encapsulation - Information Hiding)
...but use direct object references!


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



OO, C++ Style
Model state with classes
Store mutable state in objects
Take mutable state for granted
OOP -> POP
(Place Oriented Programming)

More OO C++ Style
Object References!
Store them inside other objects
Pass them as method arguments
Keep them in local variables

Another basic assumption
Everything is synchronous by default
- Method calls
- Argument passing
- Object creation

So What?
All the above are common practices
What's the problem?

Three Major Issues

Dependencies
(dependency injection)
Code bound to objects
(reusability through inheritance)
The new operator
([de]serialization)


Dependencies

You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.
Joe Armstrong
(Coders at Work)

The full quote

I think the lack of reusability comes in object-oriented languages, not functional languages. Because the problem with object-oriented languages is they’ve got all this implicit environment that they carry around with them. You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.

How does this happen?

You start with a small class
class Person {
  propA: string
  propB: string
  propB: string
}

It gets too large
class Person {
  propA: string
  propB: string
  // ...
  propZ: string
}

You break it up
But each aspect needs references to the others!

Each aspect is...
class PersonAspectX {
  // Needed becuse aspect X
  // depends on Person :-/
  person: Person
  propA: string
  propB: string
}

Persone becomes...
class Person {
  aspectA: PersonAspectA
  aspectB: PersonAspectB
  aspectC: PersonAspectC
}

Now you see...
You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.
Joe Armstrong


Code reuse

Methods are bound to classes
Reuse requires inheritance
Mixins can help, but...
...methods become bound to mixins!
In general, reusing a method on a different class is hard

Virtual Methods
...are an even bigger problem!
They mix
state definition
with
execution control flow

Example: Person
Men and Women choose gifts differently
In typical OO style, we model this with
Virtual Methods

Abstract Class
abstract class Person {
  abstract chooseGifts(): Array<Gift>
}

Concrete Class
class Man extends Person {
  chooseGifts(): Array<Gift> {
    return ['sexy underwear'];
  }
}

The Other Concrete Class
class Woman extends Person {
  chooseGifts(): Array<Gift> {
    return ['romantic book'];
  }
}

Neat Code
let p : Person = pickPerson();
// No need to know gender :-)
let gifts = p.chooseGifts();

Now Tell Me...

...what happens if somebody
(while the program is running)
changes sex?

We wanted clean code

What we got
is code hard to change
when requirements change
unpredictably


The new operator

Every piece of state must be created invoking the appropriate constructor
Transmitting state to other environments requires serialization
Recreating state requires deserialization
(picking the right constructor to invoke is always tricky)


Can we do better?

Yes, we can
Just don't use classes top model state!

I was kidding :-)
but not do much
what I mean was
Apply Functional Programming

Functional Approach
Model state with plain data structures
(preferably immutable)
Write every "method" as a function
(possibly pure)


Functional Approach
Dependencies are minimal
Control flow becomes explicit
[de]serialization becomes trivial
Testing is a breeze


Is OO fundamentally bad?

No, it's not
The principles are S.O.L.I.D.

S.O.L.I.D.
Robert C. Martin (Uncle Bob) ~2003
S – Single-responsiblity principle
O – Open-closed principle
L – Liskov substitution principle
I – Interface segregation principle
D – Dependency Inversion Principle

Than, what's bad?
Our practices are wrong
Mainstream OO languages are particularly bad
Alan Kay said he did not have C++ in mind


Why did we get C++?
In the '80 computers were not so powerful
Proper OO requires totally decoupled "objects"
Think of them as independent, isolated processes
(erlang actors are perfect!)
We were not ready to accept that

Obsession with performance
C++ promised "zero cost abstractions"
Machine instruction cost (x86):
- Property access: 1
- Method call: 1
- Virtual method call: 1
No dynamic system can compete with that

Let's compare OO and FP
OO makes code understandable by encapsulating moving parts.
FP makes code understandable by minimizing moving parts.
Michael Feathers
(Director, R7K Research & Conveyance)
Working Effectively with Legacy Code (Prentice Hall, 2004)


The real solution
Functional in the small
OO in the large


Unsospectable OO systems
A pipeline of Observables
CSP in Javascript (when used like Erlang actors)
The Seneca framework
The separation of state, side effects and render in Redux









Messages vs Invocations

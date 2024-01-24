
Object Oriented Programming and Rust


Why This Talk

I literally grew up with OOP
I actually liked it
then I decided to *unlearn* it
(and it took me decades)
this talk explains the journey
(which eventually took me to Rust)


Things I Worked  On

large embedded systems
JIT compilers (Mono, V8 in Google)
game engines (Unity 3D)
collaborative virtual reality
distributed systems
blockchains
operational research and logistics


Again, Why?

why did I decide to *unlearn* OOP?
is OOP fundamentally bad?
no, it's not
the principles are S.O.L.I.D.

S.O.L.I.D.

Robert C. Martin (Uncle Bob) ~2003
S – Single-responsiblity principle
O – Open-closed principle
L – Liskov substitution principle
I – Interface segregation principle
D – Dependency Inversion Principle

OOP principles are OK
What's wrong then?


What is OOP?
- Principles
- Practices
- Technologies
We usually get them backwards

Object Oriented Technologies
Programming languages
Development environments
Tools and frameworks
- object relational mapping
- dependency injection...

Object Oriented Practices
Abstraction through Inheritance
Use of Virtual Methods
In principle:
  Encapsulation and Information Hiding
In practice:
  No real barriers to exposing internal state

TL;DR
mainstream OOP languages and technologies
encourage bad practices
which go against the good principles
(IMHO, Rust is doing better in this field)


OOP, C++ Style

Dependencies
Object References
Inheritance
The new operator
Mutability


Model state with classes
Store mutable state in objects
Take mutable state for granted
OOP -> POP (Rich Hickey)
(Place Oriented Programming)


Another basic assumption
Everything is synchronous by default
- Method calls
- Argument passing
- Object creation

So What?
All the above are common practices
What's the problem?



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


Object References!

Store them inside other objects
Pass them as method arguments
Keep them in local variables


Inheritance

Code reuse through inheritance
mixes
implementation inheritance
with
interface inheritance


Virtual Methods

...are an even bigger problem!
They mix
state definition
with
execution control flow


Example: Person
Youngsters and Elders choose gifts differently
In typical OO style, we model age classes with classes
Then we model age-related behaviour with Virtual Methods

Abstract Class
abstract class Person {
  abstract chooseGifts(): Array<Gift>
}

Concrete Class
class Youngster extends Person {
  chooseGifts(): Array<Gift> {
    return ['Spotify subscription'];
  }
}

The Other Concrete Class
class Elder extends Person {
  chooseGifts(): Array<Gift> {
    return ['Financial Times subscription'];
  }
}

Neat Code
let p : Person = pickPerson();
// No need to know age :-)
let gifts = p.chooseGifts();

Now Tell Me...

...what must happen if somebody
(while the program is running)
changes age?

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


A Step Back
Who invented OOP?
Well...

Actually I made up the term "object-oriented", and I can tell you I did not have C++ in mind.
Alan Kay
What did he have in mind?

Ahead of His Time
Alan Kay envisioned objects like cells
Isolated and Autonomous
No way to "get into" each other
Communicate through message passing

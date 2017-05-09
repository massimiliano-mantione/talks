Javascript is Interpreted
Who cares about Javascript performance?
Does it actually matter?
Should I care?

IT DOES MATTER
And you should care

How many of you would have imagined this in 1995?

Why it matters
It's not about making your application run faster now
It is about enabling things that you could not do before

How do you make your web application faster?
Obviously, you fix what needs fixing!

Ok, how do I know what needs fixing?
You look at your code, understand it and identify the crux of your problem :-)

Problem: find 25000 prime numbers
For x = 1 to infinity:
if x not divisible by any member of an initially empty list of primes,
add x to the list until we have 25000 elements

The contenders: Js
function Primes() {
  this.prime_count = 0;
  this.primes = new Array(25000);
  this.getPrimeCount = function() { return this.prime_count; }
  this.getPrime = function(i) { return this.primes[i]; }
  this.addPrime = function(i) {
    this.primes[this.prime_count++] = i;
  }

  this.isPrimeDivisible = function(candidate) {
    for (var i = 1; i <= this.prime_count; ++i) {
      if ((candidate % this.primes[i]) == 0) return true;
    }
    return false;
  }
};

function main() {
  p = new Primes();
  var c = 1;
  while (p.getPrimeCount() < 25000) {
    if (!p.isPrimeDivisible(c)) {
      p.addPrime(c);
    }
    c++;
  }
  print(p.getPrime(p.getPrimeCount()-1));
}

main();

The contenders: C++
class Primes {
 public:
  int getPrimeCount() const { return prime_count; }
  int getPrime(int i) const { return primes[i]; }
  void addPrime(int i) { primes[prime_count++] = i; }

  bool isDivisibe(int i, int by) { return (i % by) == 0; }

  bool isPrimeDivisible(int candidate) {
    for (int i = 1; i < prime_count; ++i) {
      if (isDivisibe(candidate, primes[i])) return true;
    }
    return false;
  }

 private:
  volatile int prime_count;
  volatile int primes[25000];
};

int main() {
  Primes p;
  int c = 1;
  while (p.getPrimeCount() < 25000) {
    if (!p.isPrimeDivisible(c)) {
      p.addPrime(c);
    }
    c++;
  }
  printf("%d\n", p.getPrime(p.getPrimeCount()-1));
}

Let's RACE!

C++ is about 5 times faster than JavaScript

I guess that's not so bad, right?

Of course it is SO BAD!

Don't give up!
Demand faster!

How much faster?
3x?
30x?
300x?
3000x?
How do we know?

We need to be prepared
Know what to expect,
Know your tools,
Know how the VM executes and optimizes your code,
Know how to inspect what is really going on, and
Know that you will never guess it right before experimenting!


Understanding how V8 optimizes JavaScript

What's <em>optimized code
At each step (high level operation):
Interpreter: lots of branches to select the operation
Fast JIT: machine code with calls to (slow) generic operations
JIT with type info: machine code with calls to specific operations
Optimizing JIT: as above but with compiler optimizations

Hidden Classes
No type info in the source code means no optimizations
Type info could make JavaScript faster (like C++?)
V8 internally creates hidden classes for objects at runtime
Objects with the same hidden class can use the same optimized code


function Point(x, y) {
  this.x = x;
  this.y = y;
}

var p1 = new Point(11, 22);
var p2 = new Point(33, 44);
p2.z = 55;


Avoid the Speed Trap!
Initialize all object members in constructor functions
Always initialize object members in the same order


Fast Numbers
Objects and numbers are very different
Javascript can mix them freely
V8 uses tagging: 1 bit in a pointer
Values can be objects, SMall Integers (SMI) or boxed double


Avoid the Speed Trap!
Prefer numeric values that can be represented as 31-bit signed integers

Handling Large and Sparse Arrays
Fast Elements: linear storage for compact key sets
Dictionary Elements: hash table storage otherwise

a = new Array();
for (var b = 0; b < 10; b++) {
  a[0] |= b;  // Oh no!
}

a = new Array();
a[0] = 0;
for (var b = 0; b < 10; b++) {
  a[0] |= b;  // Much better! 2x faster.
}


Avoid the Speed Trap!
Use contiguous keys starting at 0 for Arrays
Don't pre-allocate large Arrays (e.g. > 64K elements)
Don't delete elements in arrays, especially numeric arrays
Don't load uninitialized or deleted elements




Specialized array elements
Arrays of "pure doubles" are not slow
(thanks to Double Array Unboxing)
Array's hidden class tracks element types
[un]boxing causes hidden array class change
  

// The bad way
var a = new Array();
a[0] = 77;    // Allocates
a[1] = 88;
a[2] = 0.5;   // Allocates, converts
a[3] = true;  // Allocates, converts

// Hidden Classes for Elements - A Better Way
var a = [77, 88, 0.5, true];


Avoid the Speed Trap!
Initialize using array literals for small fixed-sized arrays
Preallocate small arrays to correct size before using them
Don't store non-numeric values (objects) in numeric arrays


Fast or Optimizing?
"Full" compiler can generate good code for any JavaScript
Optimizing compiler produces great code for most JavaScript
  
"Full" Compiler Starts Executing Code ASAP
Quickly generates good but not great JIT code
Assumes (almost) nothing about types at compilation time
  

Inline Caches (ICs)
Handle types efficiently in fullgen
Type-dependent code for every operation
Validate type assumptions first, then do work
ICs self-modify at runtime via backpatching
  

// Consider candidate % this.primes[i] 
this.isPrimeDivisible = function(candidate) {
  for (var i = 1; i <= this.prime_count; ++i) {
    if (candidate % this.primes[i] == 0) return true;
  }
  return false;
}
  

push [ebp+0x8]
mov eax,[ebp+0xc]
mov edx,eax
mov ecx,0x50b155dd 
call LoadIC_Initialize           ;; this.primes
push eax
mov eax,[ebp+0xf4]
pop edx
mov ecx,eax
call KeyedLoadIC_Initialize      ;; this.primes[i]
pop edx
call BinaryOpIC_Initialize Mod   ;; candidate % this.primes[i]
  



Megamorphic attack!
Operations are monomorphic if the hidden class is always the same
Otherwise they are polymorphic
Monomorphic is better than polymorphic
 

function add(x, y) {
  return x + y;
}

add(1, 2);      // + in add is monomorphic
add("a", "b");  // + in add becomes polymorphic
  


Avoid the Speed Trap!
Prefer monomorphic over polymorphic wherever possible

Redux issues
https://medium.com/@bmeurer/surprising-polymorphism-in-react-applications-63015b50abc


The Optimizing Compiler
V8 re-compiles hot functions with an optimizing compiler
Type information (from ICs) makes code faster
Operations speculatively get inlined
Monomorphic calls and are also inlined
Inlining enables other optimizations
  

;; candidate % this.primes[i] 
cmp [edi+0xff],0x4920d181   ;; Is this a Primes object?
jnz 0x2a90a03c              
mov eax,[edi+0xf]           ;; Fetch this.primes
test eax,0x1                ;; Is primes a SMI ?
jz 0x2a90a050               
cmp [eax+0xff],0x4920b001   ;; Is primes hidden class a packed SMI array? 
mov ebx,[eax+0x7]
mov esi,[eax+0xb]           ;; Load array length
sar esi,1                   ;; Convert SMI length to int32
cmp ecx,esi                 ;; Check array bounds
jnc 0x2a90a06e             
mov esi,[ebx+ecx*4+0x7]     ;; Load element
sar esi,1                   ;; Convert SMI element to int32
test esi,esi                ;; mod (int32)
jz 0x2a90a078               
... 				
cdq
idiv esi
  

Emergency bailout
Not everything can be optimized
Some features prevent the optimizing compiler from running (a "bail-out")


Avoid the Speed Trap!
Optimizing compiler "bails-out" on functions with try {} catch {} blocks


Aaarg... deoptimization!
Optimizations are speculative Usually, they pay off

Deoptimization:
throws away optimized code
resumes execution at the right place in "full" compiler code
Reoptimization might be triggered again later, but for the short term, execution slows down
  



Avoid the Speed Trap!
Avoid hidden class changes in functions after they are optimized


Know your tools
Logging what gets optimized: --trace-opt
How to find bailouts: --trace-bailout
Detecting deoptimizations: --trace-deopt
Using the profiler: --ll-prof and tick-processor
Passing V8 options to Chrome: --js-flags="--trace-opt --trace-deopt --trace-bailout"
  

Are you prepared?
Ensure problem is JavaScript
Reduce to pure JavaScript (no DOM!)
Collect metrics
Locate bottleneck(s)
Fix problems(s)
  

console.log("Let's make it...");
//         _          _                  _          _            _            _      
//        /\ \       / /\               / /\       /\ \         /\ \         /\ \    
//       /  \ \     / /  \             / /  \      \_\ \       /  \ \       /  \ \   
//      / /\ \ \   / / /\ \           / / /\ \__   /\__ \     / /\ \ \     / /\ \ \  
//     / / /\ \_\ / / /\ \ \         / / /\ \___\ / /_ \ \   / / /\ \_\   / / /\ \_\ 
//    / /_/_ \/_// / /  \ \ \        \ \ \ \/___// / /\ \ \ / /_/_ \/_/  / / /_/ / / 
//   / /____/\  / / /___/ /\ \        \ \ \     / / /  \/_// /____/\    / / /__\/ /  
//  / /\____\/ / / /_____/ /\ \   _    \ \ \   / / /      / /\____\/   / / /_____/   
// / / /      / /_________/\ \ \ /_/\__/ / /  / / /      / / /______  / / /\ \ \     
/// / /      / / /_       __\ \_\\ \/___/ /  /_/ /      / / /_______\/ / /  \ \ \    
//\/_/       \_\___\     /____/_/ \_____\/   \_\/       \/__________/\/_/    \_\/    
//
eval("Put your code here!");                                                                                   
  

That's all...
QUESTIONS?


Rate Talk on JoindIn
https://joind.in/talk/0a58b
THANKS!

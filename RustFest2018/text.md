
*** me

*** me and rust
I always liked Rust
But I feared the leaning curve
(borrow checker)
So I just watched it from a distance

*** me and robots
I liked the idea, but I lacked time
Then we sow a Lego Sumo event
(me and my son, he was 12)
It was love at first sight!


*** programming languages
Opereting system: ev3dev
First language: nodejs
Next one: python
Let's go faster: golang


*** Let there be latency
...and there was latency
Doing things takes time
This can be significant
Robots did not react in time


*** Hard Real Time?
...is not about performance
It is about time-related correctness
Predictable latency

*** Real Time Examples

Car on a highway
[108 Km/h == 30 m/s]
100ms is 3m

Line follower robot
[2 m/s]
10ms is 20mm


*** Latency tester
See video...
We got 50ms latency spikes!


*** New OS: Ev3RT
A small real time kernel
Sub ms max latencies!
Event loop at 10KHz!
User code must be written in C
My son got sad...


*** Enter Rust
An excuse for using Rust
It is actually a perfect fit
No GC (predictable latency)
C ABI interoperability
Drop in replacement for C


*** Easier said than done
Enter no-std land
Recompile libcore
Use xargo


*** Integrate with Ev3RT
No simple syscall ABI
Wrap syscalls with C functions
Binary file format is tricky
Reuse C SDK linker script
Files are too big
Use cargo xbuild


*** Now it works
DEMO


*** Makeblock
Next robot: use an available platform
MBot (by Makeblock)
Arduino inside (ATMega328)


*** Rust on AVR
A lot of hurdles
Must build a Rust fork
Using a forked LLVM
The LLVM build failed on my Fedora environment


*** A more stable environment
Use an Ubuntu container to build and run the compiler
After 4 hours, and 10Gb...
After configuring the libcore build...
I have a running hello world


*** A moving target
I left it ther efor a while
When I resumed my effort, a one year old repo had a 4 hours old push!
The new work looked useful
It was unusable with my year-old avr-rust build
Let's rebuild the compiler!


*** Bleeding Edge avr-rust
Compiler builds out of the box
It can now compile libcore!
I could not get xargo working...
...but cargo xbuild was fine
Several hours later...
"hello world" runs again!


*** Ecosystem issues
Bare-metal instructions work
Serials, timers and pins are usable
For anything else...


*** MBot hardware
Motors and button are ok
(PWM and analog read)
Ultrasound easy to do
(measure response time on a pin)
Anything else is hard


*** BIT Banging!
The RGB led works on a single pin
with 800 nanosecond precision pulses
mainstream Arduino libraries:
a mess of macros and finely tuned inline assembly
The line array is similar


*** Back to Rust
Writing this in Rust is feasible
(like everything)
But it's tricky
I tried to reuse the C code


*** Mix Rust and Arduino
Which should we put inside the other?
Arduino sketch linking a Rust library?
A Rust program linking the Arduino core?


*** Rust inside Arduino
Doable in principle
Linking fails because of missing symbols
It seems that the Rust static lib is not "compatible" with the Arduino world


*** Arduino inside Rust
Create a base Arduino sketch
Build it, and note all the artifacts
(libcore.a and several object files)
Link all of it into the Rust program


*** Fix details
Make sure all required symbols are exported
extern "C" __attribute__((externally_visible, used))
Include all needed libraries
It works!
Until it breaks...


*** My impression
Rust *does* work on AVR
It is still painful to use
The ecosystem is totally missing
Probably mine was just bad timing
Let's see when it will be merged!




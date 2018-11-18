
*** me

*** me and rust

*** me and robots
I started with my son
Great educational value
We focused on Lego Sumo robts


*** programming languages
ev3dev
nodejs
python
golang


*** Let there be latency
...and there was latency
Robots did not react in time


*** Hard Real Time?
It is not performance
It is time-related correctness
Predictable latency

*** Real Time Examples

Car on a highway
[108 Km/h == 30 m/s]
100ms is 3m

Line follower robot
[2 m/s]
10ms is 20mm


*** Latency tester
....


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


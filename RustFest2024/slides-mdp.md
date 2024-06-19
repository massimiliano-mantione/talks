%title: Ferris Wins a Folkrace
%author: Massimiliano Mantione
%date: 2024-06-20

-------------------------------------------------

-> # Ferris Wins a Folkrace

-------------------------------------------------


-> # Presentation Outline

^
-> Who am I?
^
-> What is this Folkrace?
^
-> A look at the robot
^
-> Software architecture
^
-> Robot logic
^
-> Closing thoughts
^
-> Let's have fun!


-------------------------------------------------

-> # Who am I?

^
-> software engineer at hearth

^
-> telecom switching stations
^
-> JIT compiler engineer
^
-> (Mono project, then V8 in Google)
^
-> gaming engines (Unity 3D)
^
-> interactive, collaborative VR
^
-> 🦀 distributed systems and blockchains 🦀
^
-> 🦀 operational research (vehicle routing) 🦀

-------------------------------------------------

-> # Presentation Progress

-> Who am I?
-> ✰ *What is this Folkrace?* ✰
-> A look at the robot
-> Software architecture
-> Robot logic
-> Closing thoughts
-> Let's have fun!

-------------------------------------------------

-> # What is this Folkrace?

^
-> *Let's see!*

-> ╔╦╗╔═╗  ╦  ╦╦╔╦╗╔═╗╔═╗
->  ║ ║ ║  ╚╗╔╝║ ║║║╣ ║ ║
->  ╩ ╚═╝   ╚╝ ╩═╩╝╚═╝╚═╝

-------------------------------------------------

-> # Our team

^
-> ╔╦╗╔═╗  ╔═╗╦╔═╗╔╦╗╦ ╦╦═╗╔═╗╔═╗
->  ║ ║ ║  ╠═╝║║   ║ ║ ║╠╦╝║╣ ╚═╗
->  ╩ ╚═╝  ╩  ╩╚═╝ ╩ ╚═╝╩╚═╚═╝╚═╝


-------------------------------------------------

-> # Presentation Progress

-> Who am I?
-> What is this Folkrace?
-> ✰ *A look at the robot* ✰
-> Software architecture
-> Robot logic
-> Closing thoughts
-> Let's have fun!


-------------------------------------------------

-> # A look at the robot

^
-> ╔╦╗╔═╗  ╔═╗╦╔═╗╔╦╗╦ ╦╦═╗╔═╗╔═╗
->  ║ ║ ║  ╠═╝║║   ║ ║ ║╠╦╝║╣ ╚═╗
->  ╩ ╚═╝  ╩  ╩╚═╝ ╩ ╚═╝╩╚═╚═╝╚═╝


-------------------------------------------------

-> # Presentation Progress

-> Who am I?
-> What is this Folkrace?
-> A look at the robot
-> ✰ *Software architecture* ✰
-> Robot logic
-> Closing thoughts
-> Let's have fun!

-------------------------------------------------

-> # I/O Connections

^
8️⃣  *I2C*  _(400Hz)_ distance sensors
^
1️⃣  *I2C*  _(650Hz)_ color sensor
^
1️⃣  *UART* _(100Hz)_ IMU
^
1️⃣  *PWM*  DC motor (traction)
^
1️⃣  *PWM*  servo motor (steering)
^
2️⃣  *PIN*  input buttons
^
1️⃣  *UART* telemetry interface (ESP32-C3)
^
1️⃣  *SPI*  display (ST7789V)
^
1️⃣  *USB*  logs and programming

^
-> 👀 *so many?* 👀


-------------------------------------------------

-> # Event Loop

^
-> the _easy_ way:
-> *Arduino style*

^
    loop {
        read_sensors();
        think_about_it();
        set_output();
    }

^
-> this is _supposed_ to be *fast*

-------------------------------------------------

-> # Do you spot the issue?

^
    read_sensors() {
        read_one_sensor();
        read_another();
        read_one_more();
        //...
    }

^
-> how *long* does it _take_?

-------------------------------------------------

-> # What Are We Reading?

^
8️⃣  *I2C*  (  _2.5ms  period_ ) distance sensors
1️⃣  *I2C*  (  _1.6ms  period_ ) color sensor
1️⃣  *UART* ( _10.0ms  period_ ) IMU
2️⃣  *PIN*  (  _1.0ms *latency*_ ) input buttons
1️⃣  *UART* telemetry-config commands

^
-> 🤔 *how* can it _work_? 🤔

-------------------------------------------------

-> # Could We...

^
-> 💡 *read* _concurrently_? 💡

^
-> in _principle_, *yes* 😄
^
-> in _practice_, it's a *mess* 😔

^
-> we have no *OS*
^
-> _completions_ are ⚡ *interrupts* ⚡

^
-> _control flow_ becomes
-> an _interrupt driven_
-> *state machine*


-------------------------------------------------

-> # Enter Async Rust

^
-> just use *Embassy*
^
-> (or maybe *Lilos*)

^
1️⃣  *setup* your _runtime_
^
2️⃣  *start* your _tasks_
^
3️⃣  ... *profit!* 😄

^
-> Ok, more seriously...

-------------------------------------------------

-> # Embedded Async Rust

^
-> *Embassy* provides an _async runtime_

^
-> tasks are *statically* allocated
^
-> (but _started_ *dynamically*)

^
-> In `Future`\s, wakers can bind interrupts
^
-> ( `.await`\ing can wait for interrupts )

^
-> the runtime provides *channels*
^
-> ( `.await`\ing can wait on channels )

-------------------------------------------------

-> # Multiple Logical Event Loops!

^
-> you can have
-> one _logical_ event _loop_
-> in *each* *task*!

^
-> you should connect _tasks_ with *channels*

^
-> (data in channels should be `copy`)

-------------------------------------------------

-> # Signal Channels

^
-> I like _single slot_ channels ( `Signal`\s )

^
-> They can be *global*
-> (they use _interior_ mutability)
-> `pub static CHAN: Signal::<...> = Signal::new();`

^
-> you post *new* values without `.await`\ing:
-> `CHAN.signal(value);`

^ 
-> you wait for values *asynchronously*:
-> `let value = CHAN.wait().await;`

-------------------------------------------------

-> # Read Sensors

    pub static SENSORS: Signal = Signal::new();
    
    async read_sensors_task(s: Sensors) {
        loop {
            let value = s.read().await;
            SENSORS.signal(value);
        }
    }

^
-> You can have _different_ tasks for _different_ sensors!

^
-> 😄 and they run *concurrently* 😄

-------------------------------------------------

-> # Execute Actions

    pub static ACTIONS: Signal = Signal::new();
    
    async commands_task(m: Motors) {
        loop {
            let act = ACTIONS.wait().await;
            m.apply(act);
        }
    }

^
-> this is a _clean_ and _powerful_ way to
-> trigger *events* from _different_ code locations

-------------------------------------------------

-> # Implement Logic

    use sensors::SENSORS;
    use commands::CMDS;
    
    async logic_task() {
        loop {
            let value = SENSORS.wait().await;
            let cmd = apply_logic(value);
            CMDS.signal(cmd);
        }
    }

^
-> `apply_logic` should be "fast"
-> (whatever that means, more on this later)

-------------------------------------------------

-> # Robot Channels

^
-> *laser* readings
^
-> *imu* readings
^
-> *rgb* readings
^
-> *telemetry* data
^
-> *tracing* data
^
-> *motor* actions
^
-> *user* commands
^
-> *visual* (GUI) state

^
-> all _channels_ are *global*!

-------------------------------------------------

-> # Robot Tasks: Input

^
-> _lasers_, _rgb_, _imu_
-> write to their *readings* channels

^
-> _buttons_ sends *user* commands

-------------------------------------------------

-> # Robot Tasks: Output

^
-> _motors_ execute *action*\s

^
-> _display_ renders *visual* (GUI) state

-------------------------------------------------

-> # Robot Tasks: Misc

^
-> _telemetry_
-> consumes *data* messages
-> produces *user* commands

^
-> _tracing_
-> consumes *tracing* data
^
-> *stores* it in a _ring buffer_
-> (3000 events, about 6s)
^
-> when triggered by a *command*
-> dumps tracing *messages* to _logs_

^
-> Embassy provides a _log_ task

-------------------------------------------------

-> # Robot Tasks: Main

^
-> generally reads input channels
^
-> and produces all outputs

^
-> it looks like an
-> "Arduino style" event loop
^
-> with _composable_
-> *sub-functions*

^
-> but it is *async*
-> and uses *channels*

-------------------------------------------------

-> # Tasks Summary

-> *input* tasks
-> lasers, rgb, imu, buttons

-> *output* tasks
-> motors, display

-> *misc* tasks
-> logger, trace, telemetry

-> plus, a _main_ task for *logic*

-------------------------------------------------

-> # CPU cores

^
-> the _problem_ is the *GUI*
^
-> _drawing_ screns takes many *CPU* cycles
^
-> the _graphic_ library is *syncronous*

^
-> _rp2040_ has *two* cores...
^
-> 💡 update the *UI* on the _second core_! 💡

^
-> (I could have used a _second_ Embassy *runtime*\)
-> (with *lower proprity* on the _same_ core)


-------------------------------------------------

-> # Presentation Progress

-> Who am I?
-> What is this Folkrace?
-> A look at the robot
-> Software architecture
-> ✰ *Robot logic* ✰
-> Closing thoughts
-> Let's have fun!

-------------------------------------------------

-> # Goals

^
-> Avoid walls
^
-> Avoid Opponents
^
-> Avoid Obstacles
^
-> Well... Avoid everything! 😄

^
-> Wait: do not avoid bridges! 🤔

-------------------------------------------------

-> # Logic, Simplified

^
-> stay in the middle of the road

^
-> always aim for the
-> "most unobstructed" space

-------------------------------------------------

-> # Driving Logic

-> a plain PID can work
-> but it is not ideal

^
-> ╔╦╗╔═╗  ╔═╗╦╔═╗╔╦╗╦ ╦╦═╗╔═╗╔═╗
->  ║ ║ ║  ╠═╝║║   ║ ║ ║╠╦╝║╣ ╚═╗
->  ╩ ╚═╝  ╩  ╩╚═╝ ╩ ╚═╝╩╚═╚═╝╚═╝

-------------------------------------------------

-> # Secondary Functions

^
-> Reverse gear
^
-> Inversion logic
^
-> Colored Bands
^
-> Bridge Slope

-------------------------------------------------

-> # Presentation Progress

-> Who am I?
-> What is this Folkrace?
-> A look at the robot
-> Software architecture
-> Robot logic
-> ✰ *Closing thoughts* ✰
-> Let's have fun!

-------------------------------------------------

-> # Real Time Software

^
-> how _fast_ is fast *enough*?

^
-> it is *not* as _fast_ as *possible*,
^
-> it is _fast_ as *needed*!

^
-> you should have _latency_ *goals*
-> and *measure* against them

^
-> in _this_ robot, latencies are *a few ms*
^
-> a _single_ machine instruction is *8ns*
^
-> copying _100 bytes_ is *irrelevant*

-------------------------------------------------

-> # Simple Advices

^
-> _measure_ loop periods
^
-> and *log* them!
^
-> (better off: *log* their *maximum*)

^
-> single-slot channels are *great*
^
-> put a _counter_ in each message
^
-> and _check_ that you did not *miss* any!

^
-> ...the obvious...
^
-> do _not_ *over*\optimize!

-------------------------------------------------

-> # Safety Considerations

^
-> are _global_ channels a *problem*?
^
-> 😄 *no*! 😄
^
-> (at least not for safety)

^
-> async Rust _might_ be *hard*...
^
-> but _embedded_ async rust
-> is *extra simple*

^
-> _channels_ are *global*
^
-> _mutable_ variables are *local* to tasks
^
-> the borrow checker
-> _never_ *yells* at you!


-------------------------------------------------

-> # Presentation Progress

-> Who am I?
-> What is this Folkrace?
-> A look at the robot
-> Software architecture
-> Robot logic
-> Closing thoughts
-> ✰ *Let's have fun!* ✰

-------------------------------------------------

-> # Storytelling

^
-> *why* the _duct tape_?
^
-> *why* the _silver_ _colored_ parts?

^
-> _uneven_ track tiles with *8mm* steps
^
-> the _bumper_ support *broke* during tests
^
-> I redesigned it (*stronger*) and
-> I had it *re-printed* in place

^
-> the bumper *attachment* broke during the _race_!

^
-> my _wheels_ were *perfect*,
-> the _batteries_... *not so* much!

-------------------------------------------------

\_    \____ \___ . \____
|    |___  |  ' \[__
|___ |___  |    \___]

\_  \_ \____ \_  \_ \____    \____ \_  \_ \_  \_   /
|__| |__| |  | |___    |___ |  | |\\ |  / 
|  | |  |  \\/  |___    |    |__| | \\| .  

-------------------------------------------------

-> ████████╗██╗  ██╗ █████╗ ███╗   ██╗██╗  ██╗███████╗██╗
-> ╚══██╔══╝██║  ██║██╔══██╗████╗  ██║██║ ██╔╝██╔════╝██║
->    ██║   ███████║███████║██╔██╗ ██║█████╔╝ ███████╗██║
->    ██║   ██╔══██║██╔══██║██║╚██╗██║██╔═██╗ ╚════██║╚═╝
->    ██║   ██║  ██║██║  ██║██║ ╚████║██║  ██╗███████║██╗
->    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝


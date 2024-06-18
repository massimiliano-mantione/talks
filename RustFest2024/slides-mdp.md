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
-> Software Architecture
^
-> Robot logic
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
-> Software Architecture
-> Robot logic
-> Let's have fun!

-------------------------------------------------

-> # What is this Folkrace?

^
-> *Let's see!*

^
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
-> Software Architecture
-> Robot logic
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
-> ✰ *Software Architecture* ✰
-> Robot logic
-> Let's have fun!

-------------------------------------------------

-> # I/O Connections

^
8️⃣  *I2C*  _(400Hz)_ distance sensors
^
1️⃣  *I2C*  _(100Hz)_ color sensor
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
-> 👀 *so many?* 👀


-------------------------------------------------

-> # Event Loop

^
-> the _easy_ way:
-> *Arduino style*

^
```
loop {
    read_sensors();
    think_about_it();
    set_output();
}
```

-------------------------------------------------

-> # Do you spot the issue?

^
```
read_sensors() {
    read_one_sensor();
    read_another();
    read_one_more();
    //...
}
```

^
-> how *long* does it _take_?

-------------------------------------------------

-> # What Are We Reading?

^
8️⃣  *I2C*  _(400Hz)_ distance sensors
1️⃣  *I2C*  _(100Hz)_ color sensor
1️⃣  *UART* _(100Hz)_ IMU
2️⃣  *PIN*  _(1ms latency)_ input buttons
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
-> a *state machine*


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

-------------------------------------------------

-> # Embedded Async Rust

^
-> tasks are *statically* allocated
^
-> (but started _dynamically_)

^
-> In `Future`\s, wakers can bind interrupts
^
-> ( `.await`\ing can wait for interrupts )

^
-> the runtime provides *channels*
^
-> ( `.await`\ing can wait on channels )

-------------------------------------------------

-> # Multiple Event Loops!

^
-> you should connect _tasks_ with *channels*

^
-> (data in channels should be `copy`)

^
-> you can have
-> one _logical_ event _loop_
-> in *each* *task*!

-------------------------------------------------

-> # Read Sensors

```
async read_sensors_task(s: Sensors, c: Sender) {
    loop {
        let value = s.read().await;
        c.send(value);
    }
}
```

^
-> I use _single slot_ channels

^
-> You can have _different_ tasks for _different_ sensors!

-------------------------------------------------

-> # Execute Commands

```
async commands_task(m: Motors, cmds: Receiver) {
    loop {
        let cmd = cmds.receive().await;
        m.apply(cmd);
    }
}
```

^
-> channels awake on new messages

-------------------------------------------------

-> # Implement Logic

```
async logic_task(sensors: Receiver, cmds: Sender) {
    loop {
        let value = sensors.receive().await;
        let cmd = apply_logic(value);
        cmds.send(value);
    }
}
```

^
-> `apply_logic` should be "fast"
-> (whatever that means)

-------------------------------------------------

-> # Tasks List

^
-> *input* tasks
-> lasers, rgb, imu, buttons

^
-> *output* tasks
-> motors, display

^
-> *misc* tasks
-> logger, trace, telemetry (esp32c3)

^
-> plus, a _main_ task for *logic*

-------------------------------------------------

-> # Channels List

^
-> *laser* readings
^
-> *imu* data
^
-> *rgb* data
^
-> *telemetry* logs
^
-> *tracing* data
^
-> *motor* commands
^
-> *admin* commands
^
-> *visual* (GUI) state

^
-> all _channels_ are *global*!

-------------------------------------------------

-> # Tasks Roles: Input

^
-> _lasers_, _rgb_, _imu_
-> write to their *data* channels

^
-> _buttons_ send *admin* commands

-------------------------------------------------

-> # Tasks Roles: Output

^
-> _motors_ execute *action* commands

^
-> _display_ renders *visual* (GUI) state

-------------------------------------------------

-> # Tasks Roles: Misc

^
-> _telemetry_
-> consumes *data* messages
-> produces *admin* messages

^
-> _tracing_
-> consumes *tracing* data
^
-> when triggered by a *command*
-> logs *tracing* messages

-------------------------------------------------

-> # Tasks Roles: Main

^
-> generally reads all sensors
^
-> and produces all outputs

^
-> it looks like an
-> "Arduino style" event loop
-> with sub-functions

^
-> but it is *async*
-> and uses *channels*

-------------------------------------------------

-> CPU cores


-------------------------------------------------

-> # Presentation Progress

-> Who am I?
-> What is this Folkrace?
-> A look at the robot
-> Software Architecture
-> ✰ *Robot logic* ✰
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
-> Software Architecture
-> Robot logic
-> ✰ *Let's have fun!* ✰

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



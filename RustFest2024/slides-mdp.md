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

A bit of history
Toy RC Car
Printed Circuit Board
CPU - Display - Networking
Distance sensors
I2c multiplexer
IMU
Color Sensor
Motor driver
Power regulators


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

-> # Event loop

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

-> Async Rust

-------------------------------------------------
-> Event loops!

-------------------------------------------------
-> Channels

-------------------------------------------------

-> CPU cores

-------------------------------------------------
-> Task topology

^
-> ╔╦╗╔═╗  ╔═╗╦╔═╗╔╦╗╦ ╦╦═╗╔═╗╔═╗
->  ║ ║ ║  ╠═╝║║   ║ ║ ║╠╦╝║╣ ╚═╗
->  ╩ ╚═╝  ╩  ╩╚═╝ ╩ ╚═╝╩╚═╚═╝╚═╝


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

-> Avoid walls
-> Avoid Opponents
-> Avoid Obstacles
-> Well... Avoid everything

-> Wait: do not avoid bridges!

-------------------------------------------------

-> # Logic, Simplified

-> Stay in the middle of the road

-> Always aim for the "most unobstructed" space

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

-> Inversion logic
-> IMU
-> Colored Bands
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



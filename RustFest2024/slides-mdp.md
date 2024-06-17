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

-> Logical connections

-------------------------------------------------

-> CPU cores

-------------------------------------------------
-> Event loop

-------------------------------------------------
-> Async Rust

-------------------------------------------------
-> Event loops!

-------------------------------------------------
-> Channels

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

->  █████                 █████     ██            █████                                           ██████                        ███
-> ░░███                 ░░███     ███           ░░███                                           ███░░███                      ░███
->  ░███         ██████  ███████  ░░░   █████     ░███████    ██████   █████ █████  ██████      ░███ ░░░  █████ ████ ████████  ░███
->  ░███        ███░░███░░░███░        ███░░      ░███░░███  ░░░░░███ ░░███ ░░███  ███░░███    ███████   ░░███ ░███ ░░███░░███ ░███
->  ░███       ░███████   ░███        ░░█████     ░███ ░███   ███████  ░███  ░███ ░███████    ░░░███░     ░███ ░███  ░███ ░███ ░███
->  ░███      █░███░░░    ░███ ███     ░░░░███    ░███ ░███  ███░░███  ░░███ ███  ░███░░░       ░███      ░███ ░███  ░███ ░███ ░░░ 
->  ███████████░░██████   ░░█████      ██████     ████ █████░░████████  ░░█████   ░░██████      █████     ░░████████ ████ █████ ███
-> ░░░░░░░░░░░  ░░░░░░     ░░░░░      ░░░░░░     ░░░░ ░░░░░  ░░░░░░░░    ░░░░░     ░░░░░░      ░░░░░       ░░░░░░░░ ░░░░ ░░░░░ ░░░ 


-------------------------------------------------

-> ████████╗██╗  ██╗ █████╗ ███╗   ██╗██╗  ██╗███████╗██╗
-> ╚══██╔══╝██║  ██║██╔══██╗████╗  ██║██║ ██╔╝██╔════╝██║
->    ██║   ███████║███████║██╔██╗ ██║█████╔╝ ███████╗██║
->    ██║   ██╔══██║██╔══██║██║╚██╗██║██╔═██╗ ╚════██║╚═╝
->    ██║   ██║  ██║██║  ██║██║ ╚████║██║  ██╗███████║██╗
->    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝



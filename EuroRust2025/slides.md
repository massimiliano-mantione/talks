---
title: Lego Line Follower Challenge
event: EuroRust 2025
location: Paris
date: October 10 2025
author: Massimiliano Mantione
theme:
  path: style.yaml
options:
  end_slide_shorthand: true
---

Who am I
---

<!-- pause -->
##### **a passionate software engineer**
<!-- pause -->
##### *things I worked on*
<!-- pause -->
#### telecom switching stations
<!-- pause -->
#### JIT compilers
#### (Mono project, then V8 in Google)
<!-- pause -->
#### gaming engines (Unity 3D)
<!-- pause -->
##### interactive, collaborative VR
<!-- pause -->
#### 🦀 distributed systems and blockchains 🦀
<!-- pause -->
#### 🦀 operational research (vehicle routing) 🦀

---

That was me, Professionally
---

##### *Who am I, for this talk?*

##### 🤖 Robotic Competitions as a Hobby 🎉

##### PICTURE-team

##### ItLUG Robotics Team

---

About This Talk
---

##### 🦀 Rust Topics 🦀
##### 🏎️ Line Follower Topics 🏎️

---

🦀 Rust Topics 🦀
---

#### embedded Rust
#### wrapping an embedded C SDK
#### embedded GUI
#### custom async runtime
#### data visualization

---

🏎️ Line Follower Topics 🏎️
---

#### line following control algorithms
#### dealing with imprecise sensors
#### the importance of telemetry

---

Line Followers
---

##### there are...

#### 🏎️💨 fast ones 🏎️💨
#### 6㎧ on straight lines
##### 💥 engineering marvels 💥

#### 🤖 Lego ones 🤖
#### 🐌 much slower 🐌
#### 1㎧ overall speed
#### 🤔 different challenges 🤔

---

A Childish Line Follower
---

#### use only two sensors
#### if one side senses, turn that way
#### otherwise, go straight

#### LETS SEE

---

Can we do better?
---

#### this robot is "binary"
#### it does not have proportional reactions
#### how can we improve it?

---

Analog Sensors
---

#### use analog sensors
#### a strange configuration
#### PICTURE sensors image
#### sub millimeter accuracy

---

Use a 🅿 🅸 🅳 Controller
---

##### What is it?

```
🅿 Proportional
🅸 Integral
🅳 Derivative
```

#### given the error ⓔ
#### *(the distance from the line)*
##### and three constants `k`: `ₖ🄿 ` `ₖ🄸 ` `ₖ🄳 `

##### `turn` = ⓔ ×`ₖ🄿 ` + (∫ⓔ dt)×`ₖ🄸 ` + (dⓔ /dt)×`ₖ🄳 `

##### this gives smooth trajectory control

---

BUT WAIT
---

##### 🦀 What About Rust? 🦀
##### 🤔 isn't this a Rust conference? 🤔

---

Why Rust...
---

#### ...in a hobby robotic project?
#### to learn the language
#### to avoid mistakes
#### because it is possible!

---

🦀 Rust on a EV3 🤖
---

#### original firmware
#### (let's skip this)

#### `ev3dev` (a Debian port)
#### unpredictable latency (up to 20㎳)

#### 🤔 why is latency an issue ❓

---

Hard Real Time
---

#### the PID runs in an event loop
#### a late result is a wrong result
#### how fast is fast enough?
#### not
#### as fast as possible
#### but
#### as fast as needed

---

Line Follower Latency
---

#### PICTURE 90 turn image

#### bot speed:
#### 1.0㎧: 2㎳ ➡ 2㎜
#### 1.5㎧: 2㎳ ➡ 3㎜
#### 2.0㎧: 2㎳ ➡ 4㎜

#### line width: 20㎜
#### max latency: about 3㎳

---

Enter EV3RT
---

#### a port of TOPPERS HRP2
#### an industrial Real Time OS
#### 💥 Open Source 💥
#### docs and comments in 🇯🇵 Japanese 😮

#### 😄 with a usable C SDK 👍

---

🦀 Rust on EV3RT 💻
---

#### wrapping the C API is easy
#### EV3RT has a dynamic program loader
#### programs are "custom" ELF files
#### the linker script is crazy

---

🦀 Rust, EV3RT, and Linking 🔗
---

#### compile a sample EV3RT C app
#### with a trivial `main()`
##### and keep all the `.o` files
#### compile Rust code to a static lib (`.a`)
##### that implements the `main()` function
#### replace the `main` C `.o` file
##### with the Rust `.a` library
#### use the EV3RT linker script
#### to produce the loadable app

---

💻 EV3RT 🦀 Rust `API` 💻
---

#### simple, imperative low-level API
#### read and write to every EV3 port
#### handle every sensor and motor
#### get time (㎲) and sleep (㎳)

#### usable, but not enough

---

The Need for `async`
---

##### sensors read rate mismatches
#### NXT analog: 3㎳
#### Ultrasound: 20㎳
##### RGB color: 1㎳

#### a logic loop should read in parallel
#### RGB color data every 1ms
##### Ultrasound updates every 20㎳

#### *(not really in this robot)*

---

The Need for `async`
---

#### robot logic can be composed of
#### different parallel state machines

#### process line error
#### (dⓔ/dt, ∫ⓔdt, filtering)

#### process motor status
#### (compute speed)

#### run driving logic

#### collect telemetry

#### handle screen and input

---

EV3RT API Mismatch
---

#### the EV3RT API is synchronous
#### it does not expose interrupts
#### tasks are cumbersome to use
#### (no channels)
#### it's like ⬜ squaring a ⚪ circle

#### but remember: 1㎳ latency is fine

---

💡 Idea: a Dumb `async` Runtime 💡
---

#### run a 1㎳ event loop collecting
#### all data with pending reads

#### use `Future` with no waker

#### implement `poll` checking for new data

#### in each event loop iteration
#### poll the root `Future`

---

`async` Event Loop
---

```rust
pub fn run(self, future: mut PinBoxed<impl Future<Output = ()>>) {
    let waker = noop_waker();
    let mut context = core::task::Context::from_waker(&waker);

    loop {
        self.ev3.update();
        if future.as_mut().poll(&mut context) == core::task::Poll::Ready(()) {
            break;
        }
        self.ev3.apply();
        ev3rt::msleep(1);
    }
    ev3rt::reset(false);
}
```

---

`async` Boilerplate
---

```rust
fn no_op(_: *const ()) {}
fn no_op_clone(_: *const ()) -> core::task::RawWaker {
    noop_raw_waker()
}
static RWVT: core::task::RawWakerVTable =
    core::task::RawWakerVTable::new(no_op_clone, no_op, no_op, no_op);

#[inline]
fn noop_raw_waker() -> core::task::RawWaker {
    core::task::RawWaker::new(core::ptr::null(), &RWVT)
}

#[inline]
fn noop_waker() -> core::task::Waker {
    unsafe { core::task::Waker::from_raw(noop_raw_waker()) }
}
```

---

A `main` function, `async` style
---

```rust
async fn main<EV3: Ev3Brick>(ev3: EV3) {
    ev3.init();
    ev3.setup().await;

    let error = ErrorTask::new();
    let motors = MotorsTask::new();
    let telemetry = TelemetryTask::new();

    zip!(
        error.run(&ev3),
        screens(&ev3, &error, &motors, &telemetry),
        motors.run(&ev3),
        telemetry.run(&ev3, &error, &motors)
    )
    .await;
}
```

---

The full `main_task` function
---

```rust
static FONT: Font<LcdTopSideUp> = build_font::<LcdTopSideUp>();
#[no_mangle]
pub extern "C" fn main_task() {
    let ev3 = Ev3::new(&FONT, Duration::from_ms(25));
    let future = main(ev3.clone());
    ev3.run(pin_boxed(future), false);
}
```

```rust
pub type PinBoxed<T> = core::pin::Pin<alloc::boxed::Box<T>>;
pub fn pin_boxed<T>(t: T) -> PinBoxed<T> {
    alloc::boxed::Box::pin(t)
}
```


---

A Fast UI
---

##### Having a UI for the robot is useful!

##### Let's see what I mean

##### PICTURE GUI

---

The Fast UI Challenge
---

##### the EV3 screen

##### resolution is small (178×128)

#### framebuffer memory layout is crazy
#### monochrome, 2 bits per pixel, 3 pixels per byte
#####  not so big (total size 7680 bytes), but...

##### ...a full screen render is insanely slow

##### and latency is bad, right?

---

Graphical Requirements
---

##### writing text, numbers and symbols

##### statically pick a screen orientation

##### very easy to read "in action"

##### drowing real time bar charts

---

Idea: a Character Based UI
---

#### a 18×18 square font
#### is big and readable
#### can be easily rotated
##### does not cross bytes

##### the screen fits 10×7 chars
##### three square regions
##### (1 main 7×7, 2 secondary 3×3)
##### again, easy to rotate

---

Fast Screen Refresh
---

#### a full frame buffer now is 10×7 = 70 bytes
#### double buffering becomes feasible
#### a diff between two screens is almost instant
#### we can redrow only changed characters
#### drowing each character is a 54 bytes write
#### redrows are limited to a fixed framerate
#### (refreshing every 25㎳ is fine)

---

Understanding What Goes Wrong
---

#### having a UI is fine
##### but we cannot use it while the robot races

#### filming the robot while it runs is fine
##### but it does not show what happens inside

#### we need a telemetry system

---

What Do We Need?
---

##### we would like to inspect

#### timestamps `㎲`
#### line error `ⓔ`
#### error derivative `dⓔ /dt`
#### gyro `deg/s`
#### left and right wheel speed `㎜/s`
#### left and right motor power `PWM`
#### left, center, right sensor `flags`
#### out condition `flag`
##### overall distance `㎜`

#### fits in 20 bytes


---

The Telemetry Challenge
---

#### we want to see every decision taken
#### potentially at a 10㎑ rate
#### transmitting 200 KB/s over BT
#### while the robot runs
#### NO WAY

---

Offline Telemetry
---

#### in practice the event loop runs at 0.5㎑
#### 10k samples take 200 KB of RAM
#### at 0.5㎑ they cover 20s
#### this is more than enough!

#### just save the data file when the race stops
#### (reducing sample rate covers more time)

---

Telemetry Task
---

#### receives data samples from other tasks
#### pushes samples to the ring buffer
#### at the required rate
#### saves data when requested
#### (just as the race stops)

---

Telemetry Result
---

#### PICTURE


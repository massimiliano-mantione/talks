
Who am I

Robotics Hobby

ItLUG Robotics Team


About This Talk
- Rust Topics
- Line Follower Topics

Rust Topics
embedded Rust
wrapping an embedded C SDK
embedded GUI
custom async runtime
data visualization

Line Follower Topics
line following control algorithms
dealing with imprecise sensors
the importance of telemetry


Line Followers
fast ones
6㎧ on straight lines
engineering marvels

Lego ones
way slower
1㎧ overall speed
different challenges

a childish line follower
use only two sensors
if one side senses, turn that way
otherwise, go straight

can we do better?
this robot is "binary"
it does not have proportional reactions
how can we improve it?

analog sensors
use analog sensors
a strange configuration
--- sensors image
sub millimeter accuracy

Use a 🅿🅸🅳 Controller
What is it?
🅿roportional
🅸ntegral
🅳erivative
given three constants `k`: ₖ🄿, ₖ🄸, ₖ🄳
`turn` = ⓔ⋅ₖ🄿 + (∫ⓔdt)⋅ₖ🄸 + (dⓔ/dt)⋅ₖ🄳


BUT WAIT
🦀 What About Rust? 🦀
isn't this a Rust conference?

Why Rust...
...in a hobby robotic project?
to learn the language
to avoid mistakes
because it is possible!

🦀 Rust on a EV3 🧱

original firmware
(let's skip this)

`ev3dev` (a Debian port)
unpredictable latency (up to 20㎳)

🤔 why is latency an issue ❓


Hard Real Time

the PID runs in an event loop
a late result is a wrong result
how fast is fast enough?
not
as fast as possible
but
as fast as needed

Line Follower Latency
--- 90 turn image

bot speed:
1.0㎧: 2㎳ ➡ 2㎜
1.5㎧: 2㎳ ➡ 3㎜
2.0㎧: 2㎳ ➡ 4㎜

line width: 20㎜
max latency: about 3㎳


Enter EV3RT

a port of TOPPERS HRP2
an industrial Real Time OS
Open Source
docs and comments in Japanese

with a usable C SDK


🦀 Rust on EV3RT 💻

wrapping the C API is easy
EV3RT has a dynamic program loader
programs are "custom" ELF files
the linker script is crazy

🦀 Rust, EV3RT, and Linking 🔗

compile a sample EV3RT C app
with a trivial `main()`
compile Rust code to a static lib
replace the `main` C `.o` file
with the Rust `.a` library
use the EV3RT linbker script

💻 EV3RT 🦀 Rust `API` 💻

simple, imperative low-level API
read and write to every EV3 port
handle every sensor and motor
get time (㎲) and sleep (㎳)

usable, but not enough

The Need for `async`

(not in this robot)
sensors read rate mismatches
NXT analog: 3㎳
Ultrasound: 20㎳
RGB color: 1㎳

a logic loop read in parallel
RGB color data every 1ms, and also
get Ultrasound updates every 20㎳


The Need for `async`

robot logic can be composed of
different parallel state machines

process line error
(dⓔ/dt, ∫ⓔdt, filtering)

process motor status
(compute speed)

run driving logic

collect telemetry

handle screen and input


EV3RT API Mismatch

the EV3RT API is synchronous
it does not expose interrupts
tasks are cumbersome to use
(no channels)
it's like squaring a circle

but remember: 1㎳ latency is fine


💡 Idea: a Dumb `async` Runtime 💡

run a 1㎳ event loop collecting
all data with pending reads

use `Future` with no waker

implement `poll` checking for new data

in each event loop iteration
poll the root `Future`


`async` Event Loop

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

`async` Boilerplate

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

A `main` function, `async` style

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

The full `main_task` function

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



wrapping an embedded C SDK
the challenge of different concurrent activities with strict deadlines but conflicting periods, and how a set of tasks running inside an async runtime solves it cleanly
how to implement the async runtime in a few lines of code
how to deal with memory allocations in embedded context
how to visualize telemetry data
On the “not Rust, but fun to see” side it covers:



line following control algorithms, starting from the classic PID and adding extensions to it
the challenge of imprecise sensors and how to overcome it
the importance of telemetry and data collection to understand what is working and what isn’t in the control algorithm
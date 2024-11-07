---
title: Scaling Out Operational Research with Rust
event: 🦀 RustLab 🦀
location: Firenze
date: Sep 10 2024
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
##### *things I worked on*
#### telecom switching stations
#### JIT compilers
#### (Mono project, then V8 in Google)
#### gaming engines (Unity 3D)
#### interactive, collaborative VR
#### 🦀 distributed systems and blockchains 🦀
#### 🦀 operational research (vehicle routing) 🦀

-------

Talk Outline
---

##### our own Rust project
##### how it went
##### why we did it
##### how you can do it too

-------

My Worlplace Since Sep 2020
---

##### _1st, a bit of history_
#### March 2009: Viamente
#### 🚙 routing as a service
#### 🚚 deliveries
##### 🛻 field services
##### two products
#### 🔧 routing engine
#### 💻 route manager

-------

My Worlplace Since Sep 2020
---

##### _next bit of history_

##### **August 2012**: _WorkWave acquires Viamente_

#### 🌍 Worldwide Growth 🌍
##### over time, lots of new features

##### **January 2020**: _Global Pandemic_
#### 💥 Explosive Growth 💥
#### all _delivery_ customers
##### had **larger** problems
#### 🤔 algo performance 🤔

-------

<!-- jump_to_middle -->
Overall Architecture
---


-------

Routing Engine Server
---

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

``` +no_margin
┌────────┐
│  NGIX  │
└────────┘
```

``` +no_margin
┌╌╌╌╌╌╌╌╌┐
┊   DB   ┊
└╌╌╌╌╌╌╌╌┘
```
``` +no_margin
┌╌╌╌╌╌╌╌╌┐
┊ shared ┊
┊   FS   ┊
└╌╌╌╌╌╌╌╌┘
```

<!-- column: 1 -->

``` +no_margin   
╔═════════╗
║  Main   ║
║ process ║
║ (Java)  ║
╚═════════╝
```

``` +no_margin   
╔═══════════╗
║   Algo    ║
║ processes ║
║  (C++)    ║
╚═══════════╝
```

<!-- column: 2 -->

```
┏━━━━━━━━┓
┃  GIS   ┃
┃ server ┃
┃  (v1)  ┃
┗━━━━━━━━┛
```
```
┏━━━━━━━━┓
┃  GIS   ┃
┃ server ┃
┃  (v2)  ┃
┗━━━━━━━━┛
```

-------

Routing Engine Cluster
---

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

``` +no_margin
┌──────────┐
│   load   │
│ balancer │
└──────────┘
```
``` +no_margin
┌────────┐
│   DB   │
└────────┘
```
``` +no_margin
┌────────┐
│ shared │
│   FS   │
└────────┘
```


<!-- column: 1 -->

``` +no_margin   
╔═════════╗
║  small  ║
║ servers ║
╚═════════╝
```
``` +no_margin   
╔═════════╗
╚═════════╝
╔═════════╗
╚═════════╝
╔═════════╗
╚═════════╝
╔═════════╗
╚═════════╝
```

<!-- column: 2 -->

``` +no_margin   
╔═════════╗
║  large  ║
║ servers ║
╚═════════╝
```
``` +no_margin   
╔═════════╗
║         ║
╚═════════╝

╔═════════╗
║         ║
╚═════════╝
```

-------

The Algorithm
---

#### mostly written by an
##### **operational research** professor

#### about 75k LOC of **C++**
##### *(mostly C with classes)*

##### **lots** of *features*

##### 😕 *a jungle of linked lists* 😕

-------

Technical Debt
---

#### if _anything_ can be
#### a *mutable shared global*
##### 😔 **it is so** 😔

##### *zero* **unit** tests

#### *lack* of properly
##### designed **abstractions**

##### *no* significant **refactorings**


-------

Performance Problems
---

##### *(handling larger problems)*

#### the algo requires
#### **full** edge **matrices**
##### (they grow *quadratically*)

#### linked *lists* are
##### **not cache friendly**

#### the **search** for
#### inter-route **exchanges**
##### grows *quadratically*


-------

OK, but... Rust?
---

#### initial *experiments*
##### analyzing **instances**

#### *3 months* of data
##### about **0.5 TB**

#### I needed *tools*
#### and
##### they had to be **fast**

#### 🦀

-------

We *Really* Need To Scale *Now*!
---

##### there was an **ongoing plan**
##### *splitting* large *problems*
##### *solving* the subpproblems
##### producing a *unified* solution
##### **the splitter was mostly done**

-------

Alternative Approaches
---

#### *minimal change*
#### implement a **C++** solution
##### orchestrator **in-process**

#### *use Rust* with *minimal change*
#### implement a **Rust** solution
##### orchestrator **in-process**

#### *use Rust* with *minimal risk*
#### implement a **Rust** solution
##### orchestrator **out-of-process**

-------

A New Component: The Runner
---

#### thanks to the exploratory phase
##### there was Rust code to handle problems

#### we could implement the orchestrator
##### (we call it `runner`) in Rust

#### it mimics the underlying
##### algo process

#### almost zero changes for the
##### Routing Engine

-------

Technical Highlights
---

#### the runner tries to stay out of the way
#### it is a very *thin* wrapper for its **child process**
##### *almost zero* CPU time (async, **mostly** IO-bound)
##### *it is also nontrivial*
#### has several child processes, organized in stages
#### parses several children stdout streams in real time
#### merges children stdout events into a single event stream
#### writes to the children stdins to control them
#### collects all partial solutions from disk in real time
#### relays the event stream in its own stdout

-------

So far, so good...
---

#### we have 🦀 Rust 🦀 code in production
#### *it is working flawlessly*
#####  🥳🎉 it is a **success**! 🎉🥳

#### *then management comes*
#### ... 🛎  *knocking again* 🛎 ...

-------

We Need To Scale!
---

##### *wait*, didn't we implement the **runner** for this?
##### **yes**, *but that was scaling up*
##### **now** we need to **scale out**!

-------

Logistical Computations at Scale
---

##### *at what scale?*

#### in *production* we solve **180k plans/day**
##### about **50k** vehicles *daily* depend on it

#### when *testing* we use a pool of **180k problems**
##### with the *current infrastructure* it takes **one week**

#### we have **one** public **demo** environment
##### but we *want* to **diversify** it

-------

Actual Goals
---

#### **dynamically provision commpute power**
##### _so we can afford more!_

#### **simplify deployments**
##### _now they mutate existing servers_

#### **allow more tests and experiments**
#### _testing is too slow_
#### _creating new deployments is expensive_
#### _live experiments are unfeasible_

-------

The Algo Service
---

##### remember the **Routing Engine** server architecture?

##### the one with **everything** on **every** server?

##### _let's recap..._

-------

Routing Engine Server (recap)
---

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

``` +no_margin
┌────────┐
│  NGIX  │
└────────┘
```

``` +no_margin
┌╌╌╌╌╌╌╌╌┐
┊   DB   ┊
└╌╌╌╌╌╌╌╌┘
```
``` +no_margin
┌╌╌╌╌╌╌╌╌┐
┊ shared ┊
┊   FS   ┊
└╌╌╌╌╌╌╌╌┘
```

<!-- column: 1 -->

``` +no_margin   
╔═════════╗
║  Main   ║
║ process ║
║ (Java)  ║
╚═════════╝
```

``` +no_margin   
╔═══════════╗
║   Algo    ║
║ processes ║
║  (C++)    ║
╚═══════════╝
```

<!-- column: 2 -->

```
┏━━━━━━━━┓
┃  GIS   ┃
┃ server ┃
┃  (v1)  ┃
┗━━━━━━━━┛
```
```
┏━━━━━━━━┓
┃  GIS   ┃
┃ server ┃
┃  (v2)  ┃
┗━━━━━━━━┛
```



-------

Algo Service
---

##### to *scale* **out**

#### we take the algo **processes**
##### (the most *compute* **intensive** component)

##### *and we move them into an **external** service*

-------

Algo Service Design Principles
---

##### 󱃾 Kubernetes-based devops 󱃾

##### 󱕱 jobs are queued 󱕱

#####  stateless components 

#### externally provisioned
#####  stateful services 

#####  ...remember the 12 factors... 

-------

Algo Service Architecture
---

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

``` +no_margin
┌───────────┐
│frontend 󰒍 │
└───────────┘
```

``` +no_margin
┌───────────┐
└───────────┘
```
``` +no_margin
┌───────────┐
└───────────┘
```
``` +no_margin
┌───────────┐
└───────────┘
```

<!-- column: 1 -->

``` +no_margin   
╔══════════╗
║  fast   ║
║  store   ║
║ (Redis)  ║
╚══════════╝
```

``` +no_margin   
╔══════════╗
║  slow   ║
║  store   ║
║  (S3)    ║
╚══════════╝
```
``` +no_margin   
╔══════════╗
║monitor  ║
╚══════════╝
```

<!-- column: 2 -->

```
┏━━━━━━━━┓
┃ worker ┃
┃ node 󰒋 ┃
┗━━━━━━━━┛
```

```
┏━━━━━━━━┓
┗━━━━━━━━┛
```
```
┏━━━━━━━━┓
┗━━━━━━━━┛
```
```
┏━━━━━━━━┓
┗━━━━━━━━┛
```

-------

How It Went
---

#### 🌈 overall, **perfectly** 🦄
##### *issues were not due to Rust*

#### S3 write throughput
#### shared FS costs
#### Redis IO operations
##### skipping queues

#### *but, also 🦀 is not only 🌈🦄*

-------

🦀 Rust Issues 😕
---

#### 🤔 `async` Rust (*tokio*) can be **tricky** 🤔
##### *mostly because of multithreading*

#### **60k** LOC of *authored* code
##### 😯 **800k** LOC of *dependencies*! 😯

#### ⏳ *CI* build times are **slow** ⏳
##### *caching is mandatory*

#### VS code + Rust analyzer
##### ⏳ *struggle* at **startup** ⏳

-------

🦀 Rust Strenghts 💪
---

#### 🥱 **Rust** in *production* is **boring** 🥱
#### 🔎🐛 *bugs* are **nowhere** to be found 🔎🐛
##### 🤦 *except for analysis holes* 🤦

#### ⭐ *performance* is **stellar** ⭐
##### *resources* usage is **minimal**

#### 🛡 *fearless* concurrency is **real** 🛡

-------

🦀 Why Rust ❓
---

#### the algo is **performance** critical
##### *it is already implemented in C++*

#### we needed to build **high level** code
##### *...networking, protocols, APIs, persistence...*

#### *Long term*, I wanted the algo team
##### to work on the *whole codebase*

#### Rust is very *good* at *both*
##### **performance** and **high level**

-------

What About Management?
---

#### *or:*
##### ❓ how did I get away with it ❓

#### *suppose you want to*
#### *introduce Rust*
##### *in your workplace*

#### **what does it take?**

-------

It Needs to Make Sense
---

#### Rust **strenghts** must be
##### **relevant** to *your* project

#### not just *mildly* relevant,
##### but **enough** to **justify** the *hassle*

#### **making sense** is **not enough**
##### *...what you need is...*

-------

TRUST
---

<!-- jump_to_middle -->
#### **management trusted me**

-------

Building Trust
---

#### how do you make so that
##### your *managers* **trust** you?

#### by doing *well* the **very** thing
##### that you **hate** doing:

##### 🔮 **predicting** the **future** 🔮

-------

Being Reliable
---

#### *when*, for **tens** of **times**,
##### you say **this is going to happen**

##### and *then* it **happens**

#### **you are building trust**

-------

A Healthy Workplace
---

#### when you **trust** your
##### *managers* and *coworkers*

#### **and they trust you**
##### **everything is fine**

##### *if your workplace is not healthy*

#### *technical issues* like using Rust
##### should be the **least** of your **worries**

-------

Recap
---

##### 🦀 Rust is amazing 🎇
##### 🛠  there are projects where it shines 🌞
#### 🤝 you build trust 🤝
##### 🔮 by being reliable 🔮
##### 😃 a healthy workplace is important 😃
#### 🙏 **thanks!** 🙏
##### ❓ *questions?*  ❓

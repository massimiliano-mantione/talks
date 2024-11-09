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
#### interactive, collaborative VR
<!-- pause -->
##### 🦀 distributed systems and blockchains 🦀
<!-- pause -->
#### 🦀 operational research (vehicle routing) 🦀

-------

Talk Outline
---

<!-- pause -->
##### our own Rust project
<!-- pause -->
##### how it went
<!-- pause -->
##### why we did it
<!-- pause -->
##### how you can do it too

-------

My Worlplace Since Sep 2020
---

##### _1st, a bit of history_
<!-- pause -->
#### March 2009: Viamente
<!-- pause -->
#### 🚙 routing as a service
<!-- pause -->
#### 🚚 deliveries
<!-- pause -->
##### 🛻 field services
<!-- pause -->
##### two products
<!-- pause -->
#### 🔧 routing engine
<!-- pause -->
#### 💻 route manager

-------

My Worlplace Since Sep 2020
---

##### _next bit of history_
<!-- pause -->
##### **August 2012**: _WorkWave acquires Viamente_
<!-- pause -->
#### 🌍 Worldwide Growth 🌍
##### over time, lots of new features
<!-- pause -->
#### **January 2020**: _Global Pandemic_
##### 💥 Explosive Growth 💥
<!-- pause -->
#### all _delivery_ customers
##### had **larger** problems
<!-- pause -->
#### 🤔 algo performance 🤔

-------

This is Where I start
---

<!-- pause -->
##### I was hired as an algorithm engineer

<!-- pause -->
##### to fix performance issues

<!-- pause -->
##### make the system scale

<!-- pause -->
##### and yes, implement new features

-------

<!-- jump_to_middle -->
Routing Engine Architecture
---


-------

Routing Engine Server
---

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->
<!-- pause -->
``` +no_margin
┌────────┐
│  NGIX  │
└────────┘
```

<!-- column: 1 -->
<!-- pause -->

``` +no_margin   
╔═════════╗
║  Main   ║
║ process ║
║ (Java)  ║
╚═════════╝
```

<!-- column: 2 -->
<!-- pause -->

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

<!-- column: 1 -->
<!-- pause -->
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

<!-- column: 0 -->
<!-- pause -->
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

-------

Routing Engine Cluster
---

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->
<!-- pause -->
``` +no_margin
┌──────────┐
│   load   │
│ balancer │
└──────────┘
```

<!-- column: 1 -->
<!-- pause -->
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
<!-- pause -->
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
<!-- column: 0 -->
<!-- pause -->
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

-------

The Algorithm
---

<!-- pause -->
#### mostly written by an
##### **operational research** professor

<!-- pause -->
#### about 75k LOC of **C++**
##### *(mostly C with classes)*

<!-- pause -->
##### **lots** of *features*

<!-- pause -->
##### 😕 *a jungle of linked lists* 😕

-------

Technical Debt
---

<!-- pause -->
#### if _anything_ can be
#### a *mutable shared global*
##### 😔 **it is so** 😔

<!-- pause -->
##### *zero* **unit** tests

<!-- pause -->
#### *lack* of properly
##### designed **abstractions**

<!-- pause -->
##### *no* significant **refactorings**

<!-- pause -->
##### the *codebase* is **brittle**

-------

Performance Problems
---

<!-- pause -->
##### *(handling larger problems)*

<!-- pause -->
#### the algo requires
#### **full** edge **matrices**
<!-- pause -->
##### (they grow *quadratically*)

<!-- pause -->
#### linked *lists* are
##### **not cache friendly**

<!-- pause -->
#### the **search** for
#### inter-route **exchanges**
##### grows *quadratically*


-------

OK, this is C++: and Rust?
---

<!-- pause -->
#### my initial *experiments*:
##### analyzing **problems**

<!-- pause -->
#### *3 months* of data
##### about **0.5 TB**

<!-- pause -->
#### I needed *tools*
<!-- pause -->
#### and
##### they had to be **fast**

<!-- pause -->
#### 🦀

-------

We *Really* Need To Scale *Now*!
---

<!-- pause -->
##### there was an **ongoing plan**
<!-- pause -->
##### *splitting* large *problems*
<!-- pause -->
##### *solving* the subpproblems
<!-- pause -->
##### producing a *unified* solution
<!-- pause -->
##### **the splitter was mostly done**

-------

How the Splitter Works
---

<!-- column_layout: [2, 3] -->

<!-- column: 0 -->
<!-- pause -->
#### a large problem

<!-- column: 1 -->

``` +no_margin
              🏠                🏠
   🏠     🏠            🏠
        🏠           🏠
     🏠                     🏠
                     🏠
              🚚  🚚    🏠
                🏭                
              🚚  🚚        🏠
        🏠           🏠
   🏠     🏠            🏠
                              🏠
      🏠      🏠           🏠
  🏠                            🏠
```

<!-- column: 0 -->
<!-- pause -->
#### a large problem
#### we split it

<!-- column: 1 -->

``` +no_margin
              🏠 ┊              🏠
   🏠     🏠     ┊      🏠
        🏠       ┊   🏠
     🏠          ┊          🏠
                 ┊   🏠
              🚚 ┊🚚    🏠
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌🏭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
              🚚 ┊🚚        🏠
        🏠       ┊   🏠
   🏠     🏠     ┊      🏠
                 ┊            🏠
      🏠      🏠 ┊         🏠
  🏠             ┊              🏠
```

<!-- column: 0 -->
<!-- pause -->
#### a large problem
#### we split it
#### we solve subproblems

<!-- column: 1 -->

``` +no_margin
           ┏━━🏠 ┊              🏠
   🏠━━━┓ 🏠     ┊      🏠
    ┃   🏠━┛     ┊   🏠
    ┗🏠          ┊          🏠
      ┃          ┊   🏠
      ┗━━━━━━━🚚 ┊🚚    🏠
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌🏭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
              🚚 ┊🚚        🏠
        🏠       ┊   🏠
   🏠     🏠     ┊      🏠    
                 ┊            🏠
      🏠      🏠 ┊         🏠
  🏠             ┊              🏠
```

<!-- column: 0 -->
<!-- pause -->
#### a large problem
#### we split it
#### we solve subproblems
#### one at a time

<!-- column: 1 -->

``` +no_margin
           ┏━━🏠 ┊           ┏━━🏠
   🏠━━━┓ 🏠     ┊    ┏━🏠   ┃
    ┃   🏠━┛     ┊   🏠  ┃   ┃
    ┗🏠          ┊    ┃  ┗━━🏠
      ┃          ┊   🏠━┓
      ┗━━━━━━━🚚 ┊🚚━━━━🏠
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌🏭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
              🚚 ┊🚚        🏠
        🏠       ┊   🏠
   🏠     🏠     ┊      🏠    
                 ┊            🏠
      🏠      🏠 ┊         🏠
  🏠             ┊              🏠
```

<!-- column: 0 -->
<!-- pause -->
#### a large problem
#### we split it
#### we solve subproblems
#### one at a time
##### possibly in parallel

<!-- column: 1 -->

``` +no_margin
           ┏━━🏠 ┊           ┏━━🏠
   🏠━━━┓ 🏠     ┊    ┏━🏠   ┃
    ┃   🏠━┛     ┊   🏠  ┃   ┃
    ┗🏠          ┊    ┃  ┗━━🏠
      ┃          ┊   🏠━┓
      ┗━━━━━━━🚚 ┊🚚━━━━🏠
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌🏭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
              🚚 ┊🚚━┓      🏠
    ┏━━━🏠━━━━┛  ┊   🏠      ┃
   🏠━━━━━🏠━━┓  ┊    ┗━🏠   ┃
              ┃  ┊       ┃   ┗🏠┓
   ┏━━🏠━━━━━━🏠 ┊       ┗━🏠   ┃
  🏠             ┊          ┗━━━🏠
```
<!-- column: 0 -->
<!-- pause -->
#### a large problem
#### we split it
#### we solve subproblems
#### one at a time
##### possibly in parallel

#### **then we merge**
##### **the results**

<!-- column: 1 -->

``` +no_margin
           ┏━━🏠             ┏━━🏠
   🏠━━━┓ 🏠          ┏━🏠   ┃
    ┃   🏠━┛         🏠  ┃   ┃
    ┗🏠               ┃  ┗━━🏠
      ┃              🏠━┓
      ┗━━━━━━━🚚  🚚━━━━🏠
                🏭
              🚚  🚚━┓      🏠
    ┏━━━🏠━━━━┛      🏠      ┃
   🏠━━━━━🏠━━┓       ┗━🏠   ┃
              ┃          ┃   ┗🏠┓
   ┏━━🏠━━━━━━🏠         ┗━🏠   ┃
  🏠                        ┗━━━🏠
```

-------

Different Implementation Approaches
---

<!-- pause -->
#### *minimal change*
<!-- pause -->
#### **C++** solver
##### orchestrator **in-process**

<!-- pause -->
#### use **Rust** with *minimal change*
<!-- pause -->
#### **Rust** solver
##### orchestrator **in-process**

<!-- pause -->
#### use *Rust* with **minimal risk**
<!-- pause -->
#### **Rust** solver
##### orchestrator **out-of-process**

-------

A New Component: The Runner
---

<!-- pause -->
#### thanks to the exploratory phase
##### there was **Rust code** to handle **problems**

<!-- pause -->
#### we had a *head start* to
#### implement the orchestrator
##### (we call it `runner`) in **Rust**

<!-- pause -->
#### it mimics the underlying
##### algo process

<!-- pause -->
#### almost zero changes for the
##### Routing Engine

-------

Technical Highlights
---

<!-- pause -->
#### the runner tries to stay out of the way
<!-- pause -->
#### it is a *very thin* wrapper for its **child process**
<!-- pause -->
##### *almost zero* CPU time (async, **mostly** IO-bound)
<!-- pause -->
##### *it is also nontrivial*
<!-- pause -->
#### has several child processes, organized in stages
<!-- pause -->
#### parses several children stdout streams in real time
<!-- pause -->
#### merges children stdout events into a single event stream
<!-- pause -->
#### exposes the event stream in its own stdout
<!-- pause -->
#### writes to the children stdins to control them
<!-- pause -->
#### collects all partial solutions from disk in real time
<!-- pause -->
#### handles all sort of errors and corner cases

-------

So far, so good...
---

<!-- pause -->
#### we have 🦀 Rust 🦀 code in production
<!-- pause -->
#### *it is working flawlessly*
<!-- pause -->
#####  🥳🎉 it is a **success**! 🎉🥳

<!-- pause -->
#### *then management comes*
#### ... 🛎  *knocking again* 🛎 ...

-------

We Need To Scale!
---

<!-- pause -->
##### *wait*, didn't we implement the **runner** for this?
<!-- pause -->
##### **yes**, *but that was scaling* **up**
<!-- pause -->
##### **now** we need to **scale out**!

-------

Scaling Up
---

<!-- column_layout: [4, 2, 1] -->

<!-- column: 0 -->
<!-- pause -->
#### you have a **small** problem
<!-- pause -->
##### you use a **small** machine

<!-- column: 1 -->

```







┏━━━━━━━━━┓
┃     o o ┃
┃ ━━━━━━━ ┃
┗━━━━━━━━━┛
```

<!-- column: 0 -->

<!-- pause -->
#### you have a small problem
##### you use a small machine

#### you have a **bigger** problem
<!-- pause -->
##### you use a **bigger** machine


<!-- column: 1 -->

```




┏━━━━━━━━━┓
┃     o o ┃
┃     o o ┃
┃         ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┗━━━━━━━━━┛
```

<!-- column: 0 -->

<!-- pause -->
#### you have a small problem
##### you use a small machine

#### you have a **bigger** problem
##### you use a **bigger** machine

##### *...and so on...*

<!-- column: 1 -->

```


┏━━━━━━━━━┓
┃     o o ┃
┃     o o ┃
┃         ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┗━━━━━━━━━┛
```

<!-- column: 0 -->

<!-- pause -->
#### you have a small problem
##### you use a small machine

#### you have a **bigger** problem
##### you use a **bigger** machine

##### *...and so on...*

<!-- column: 1 -->

```
┏━━━━━━━━━┓
┃     o o ┃
┃     o o ┃
┃         ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┃ ━━━━━━━ ┃
┗━━━━━━━━━┛
```

-------

Scaling Out
---

<!-- column_layout: [3, 2, 2, 2] -->

<!-- column: 0 -->
<!-- pause -->
#### a **few** problems
<!-- pause -->
##### a **few** machines

<!-- column: 1 -->

```








┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
```

<!-- column: 0 -->
<!-- pause -->
#### a **few** problems
##### a **few** machines

#### **more** problems
<!-- pause -->
#### **more** machines

<!-- column: 1 -->

```




┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
```

<!-- column: 0 -->
<!-- pause -->
#### a **few** problems
##### a **few** machines

#### **more** problems
#### **more** machines

<!-- column: 1 -->

```
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
```

<!-- column: 2 -->
<!-- pause -->
```
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
```

<!-- column: 3 -->
<!-- pause -->
```
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
┏━━━━━━━┓
┃    oo ┃
┃ ━━━━━ ┃
┗━━━━━━━┛
```

-------

Logistical Computations at Scale
---

<!-- pause -->
##### *at what scale?*

<!-- pause -->
#### in *production* we solve **180k plans/day**
##### about **50k** vehicles *daily* depend on it

<!-- pause -->
#### when *testing* we use a pool of **180k problems**
##### with the *current infrastructure* it takes **one week**

<!-- pause -->
#### we have **one** public **demo** environment
##### but we *want* to **diversify** it

-------

Actual Goals
---

<!-- pause -->
#### **dynamically provision commpute power**
##### _so we can afford more!_

<!-- pause -->
#### **simplify deployments**
##### _now they mutate existing servers_

<!-- pause -->
#### **allow more tests and experiments**
<!-- pause -->
#### _testing is too slow_
<!-- pause -->
#### _creating new deployments is expensive_
<!-- pause -->
#### _live experiments are unfeasible_

-------

Scaling Out: How?
---

<!-- pause -->
##### remember the **Routing Engine** server architecture?

<!-- pause -->
##### the one with **everything** on **every** server?

<!-- pause -->
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

<!-- pause -->
##### to *scale* **out**

<!-- pause -->
#### we take the algo **processes**
##### (the most *compute* **intensive** component)

<!-- pause -->
##### *and we move them into an **external** service*

-------

Algo Service Design Principles
---

<!-- pause -->
##### 󱃾 Kubernetes-based devops 󱃾

<!-- pause -->
##### 󱕱 jobs are queued 󱕱

<!-- pause -->
#####  stateless components 

<!-- pause -->
#### externally provisioned
#####  stateful services 

<!-- pause -->
#####  ...mostly the 12 factors... 

-------

Algo Service Architecture
---

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->
<!-- pause -->
``` +no_margin
┌───────────┐
│frontend 󰒍 │
└───────────┘
```

<!-- pause -->
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
<!-- pause -->
``` +no_margin   
╔══════════╗
║  fast   ║
║  store   ║
║ (Redis)  ║
╚══════════╝
```
<!-- pause -->
``` +no_margin   
╔══════════╗
║  slow   ║
║  store   ║
║  (S3)    ║
╚══════════╝
```

<!-- column: 2 -->
<!-- pause -->
```
┏━━━━━━━━┓
┃ worker ┃
┃ node 󰒋 ┃
┗━━━━━━━━┛
```

<!-- pause -->
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

<!-- column: 1 -->
<!-- pause -->
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

-------

How It Went
---

<!-- pause -->
#### 🌈 overall, **perfectly** 🦄
##### *issues were not due to Rust*

<!-- pause -->
#### S3 write throughput
<!-- pause -->
#### shared FS costs
<!-- pause -->
#### Redis IO operations
<!-- pause -->
##### skipping queues

-------

Future Plans
---

#### (TODO: write about future plans here)

-------

Again, so far so good
---

<!-- pause -->
<!-- jump_to_middle -->
#### *but, 🦀 is not only 🌈🦄*

-------

🦀 Rust Issues 😕
---

<!-- pause -->
#### 🤔 `async` Rust (*tokio*) can be **tricky** 🤔
##### *mostly because of multithreading*

<!-- pause -->
##### **an example?**
-------

A Digression on Async Rust
---

<!-- pause -->
##### `spawn` in `tokio`

<!-- pause -->
```rust
pub fn spawn<F>(future: F) -> JoinHandle<F::Output>
where
    F: Future + Send + 'static,
    F::Output: Send + 'static,
```
<!-- pause -->
##### *application:* **Redis** stream -> *channel* -> **tokio** stream

<!-- pause -->
##### *do `F` and `F::Output` need to live **forever**?*

<!-- pause -->
#### can you *tell* the *difference*
#### between `static` and `'static`?

-------

🦀 Back to Rust Issues 😕
---

#### 🤔 `async` Rust (*tokio*) can be **tricky** 🤔
##### *mostly because of multithreading*

<!-- pause -->
#### **60k** LOC of *authored* code
##### 😯 **800k** LOC of *dependencies*! 😯

<!-- pause -->
#### ⏳ *CI* build times are **slow** ⏳
##### *caching is mandatory*

<!-- pause -->
#### VS code + Rust analyzer
##### ⏳ *struggle* at **startup** ⏳

-------

🦀 Rust Strenghts 💪
---

<!-- pause -->
#### 🥱 **Rust** in *production* is **boring** 🥱
<!-- pause -->
#### 🔎🐛 *bugs* are **nowhere** to be found 🔎🐛
<!-- pause -->
##### 🤦 *except for analysis holes* 🤦

<!-- pause -->
#### ⭐ *performance* is **stellar** ⭐
<!-- pause -->
#####  *resources* usage is **minimal** 

<!-- pause -->
#### 🛡 *fearless* concurrency is **real** 🛡

-------

🦀 Why Rust ❓
---

<!-- pause -->
#### the algo is **performance** critical
##### *it is already implemented in C++*

<!-- pause -->
#### we needed to build **high level** code
##### *...networking, protocols, APIs, persistence...*

<!-- pause -->
#### *Long term*, I wanted the algo team
##### to work on the *whole codebase*

<!-- pause -->
#### Rust is very *good* at *both*
##### **high performance** and **high level**

-------

What About Management?
---

<!-- pause -->
#### *or:*
<!-- pause -->
##### ❓ how did I get away with it ❓

<!-- pause -->
#### *suppose you want to*
#### *introduce Rust*
##### *in your workplace*

<!-- pause -->
#### **what does it take?**

-------

It Needs to Make Sense
---

<!-- pause -->
#### Rust **strenghts** must be
##### **relevant** to *your* project

<!-- pause -->
#### not just *mildly* relevant,
##### but **enough** to **justify** the *hassle*

<!-- pause -->
#### **making sense** is **not enough**
<!-- pause -->
##### *...what you need is...*

-------

TRUST
---

<!-- pause -->
<!-- jump_to_middle -->
#### **management trusted me**

-------

Building Trust
---

<!-- pause -->
#### how do you make so that
##### your *managers* **trust** you?

<!-- pause -->
#### by doing *well* the **very** thing
##### that you **hate** doing:

<!-- pause -->
##### 🔮 **predicting** the **future** 🔮

-------

Being Reliable
---

<!-- pause -->
#### *when*, for **tens** of **times**,
##### you say **this is going to happen**

<!-- pause -->
##### and *then* it **happens**

<!-- pause -->
#### **you are building trust**

-------

A Healthy Workplace
---

<!-- pause -->
#### when you **trust** your
##### *managers* and *coworkers*

<!-- pause -->
#### **and they trust you**
<!-- pause -->
##### **everything is fine**

<!-- pause -->
##### *if your workplace is not healthy*

<!-- pause -->
#### *technical issues* like using Rust
##### should be the **least** of your **worries**

-------

Recap
---

<!-- pause -->
##### 🦀 Rust is amazing 🎇
<!-- pause -->
##### 🛠  there are projects where it shines 🌞
<!-- pause -->
#### 🤝 you build trust 🤝
##### 🔮 by being reliable 🔮
<!-- pause -->
##### 😃 a healthy workplace is important 😃
<!-- pause -->
#### 🙏 **thanks!** 🙏
<!-- pause -->
##### ❓ *questions?*  ❓

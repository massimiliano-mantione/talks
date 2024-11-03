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

##### 😔 *a jungle of linked lists* 😔

-------

Technical Debt
---

#### if _anything_ can be
#### a *mutable shared global*
##### 😕 **it is so** 😕

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

The Runner
---



-------

Takeaway
---

-------

We Need To Scale!
---

-------

The Algo Service
---

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

``` +no_margin
XXX
```

<!-- column: 1 -->

``` +no_margin   
XXX
```

<!-- column: 2 -->

```
XXX
```

-------
🦄🌈🚙🚚🛻

💽💾💻🕋🖧🖥🖴🔗🖭

🌍👁💡🗲

🚙🚚🛻🌍


🤔😃😕😔😞🙂

XXSS

┌──────┐
│      │
└──────┘

╔══════╗
║      ║
╚══════╝

┏━━━━━━┓
┃      ┃
┗━━━━━━┛

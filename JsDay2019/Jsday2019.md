-------------------------------------------------

#     Javascript and the polyglot web

Massimiliano Mantione

JsDay 2019
##     March 8th, Verona

-------------------------------------------------

-> # About me:
-> # things I worked on

^
-> The V8 Team in Google
^
-> The Unity Game Engine
^
-> The Mono JIT Compiler

^
-> *_Now CTO and Full Stack developer at Hyperfair_*
^
-> *Virtual Reality on the Web*

-------------------------------------------------

-> # About this talk

^
-> _The Polyglot Web_

^
-> *What does it mean?*

-------------------------------------------------

-> # The Web has Javascript

^
-> Javascript is the language of the web

^
-> it _always_ has been, and _always_ will be

^
-> *Or not?*
^
-> _Let's time travel!_

-------------------------------------------------

-> # Javascript History

^
-> In the beginning there was only...

^
-> a dark sea TCP/IP protocols

^
-> *Telnet, FTP, SMTP, NTP, Gopher...*

-------------------------------------------------

-> # Then Tim Berners-Lee Came

^
-> Let there be *HTTP*
^
-> _and there was HTTP_

^
-> and he separated
^
-> *Ancestral Chaos*
^
-> from the
^
-> *Purity of HTML Static Content*

-------------------------------------------------

-> # And he saw that it was Good

^
-> _Web 1.0_

^
-> Then Developers Came
^
-> The Web Needed Life
^
-> web *pages* needed to be *active*

-------------------------------------------------

-> # Then Brendan Eich Came

^
-> Let there be *Javascript*
^
-> _and there was Javascript_

^
-> and he saw that it was good

^
-> _*or was it?*_

-------------------------------------------------

-> # IMHO

^
-> Nobody in his right mind would have said that it was good
^
-> Javascript had *good* ideas
^
-> but it was *inconsistent* and *limited*

^
-> But Javascript he made
^
-> and Javascript we had
^
-> ...for the centuries to come...

^
-> _Web 2.0_

-------------------------------------------------

-> # A bit of Philosophy

^
-> Javascript:
-> two weeks from conception to implementation

^
-> should this be explained by
^
-> *Creationism* or *Evolutionism*?

^
-> _A Bit of Both_
^
-> A few *accidents*, and lots of *hard work*

-------------------------------------------------

-> # The Javascript Accident

^
-> September 1995: Netscape Navigator 2.0
^
-> (Mocha or Livescript)

^
-> Netscape browser version 2.0B3
^
-> (Javascript)

-------------------------------------------------

-> # The Deviation

^
-> August 1996: Internet Explorer 3.0
^
-> (JScript)

-------------------------------------------------

-> # Browser Wars

^
-> _Microsoft_ vs _Netscape_

^
-> Enter ECMAScript

^
-> November 1996: first submission to ECMA by Netscape
^
-> June 1997, Version 1: First edition
^
-> June 1998, Version 2: Align with ISO/IEC 16262

-------------------------------------------------

-> # December 1999: ECMAScript 3

^
-> Regular expressions
^
-> Better string handling
^
-> New control statements
^
-> Try/catch exception handling

-------------------------------------------------

-> # ECMAScript 4

^
-> *Mission Impossible*

^
-> Too much _"design by committee"_

-------------------------------------------------

-> ...the war was still ongoing...
^
-> ...life for web developers was miserable...

^
-> # The Saviours

^
-> June 5, 2002: Mozilla 1.0
^
-> November 9, 2004: Firefox 1.0
^
-> September 2, 2008: Chrome 1.0

-------------------------------------------------

-> # December 2009: ECMAScript 5

^
-> Adds "strict mode"
^
-> Clarifies ambiguities and fixes details
^
-> Getters and setters
^
-> JSON support
^
-> Better reflection on object properties
^
-> _

-------------------------------------------------

-> # June 2015: ES6

^
-> ECMAScript 2015
^
-> *Permanent Evolution Begins*

^
-> Modules, classes, arrow functions
^
-> Generators, Promises
^
-> let, const, string templates
^
-> Proxies and reflection
^
-> _

-------------------------------------------------

-> # 2016, 2017, 2018...

^
-> async and await
^
-> Destructuring assignments
^
-> Proper tail calls
^
-> Rest/spread operators (...)
^
-> asynchronous iteration
^
-> _

-------------------------------------------------

-> # An amazing evolution

^
-> from 1995 to 2019
^
-> but

^
-> _Has it been_

^
-> *enough?*

-------------------------------------------------

-> _*No, and it never was*_

^
-> _Developers always wanted more_

-------------------------------------------------

-> # A Parallel Story

^
-> Java applets
^
-> Flash and Actionscript
^
-> Browser Plugins
^
-> Coffeescript
^
-> Silveright
^
-> Typescript
^
-> _

-------------------------------------------------

-> *What was the point?*

-------------------------------------------------

-> # Lack of

^
-> Language features

^
-> API power

-------------------------------------------------

-> # Language features

^
-> Syntactic sugar
^
-> Functional constructs
^
-> Static typing
^
-> Generators and async await

^
-> *transpilers can do it*

-------------------------------------------------

-> # API Power

^
-> Multimedia
^
-> (WebGL, WebMedia)
^
-> Networking
^
-> (WS, WebRTC)
^
-> Parallel computing
^
-> (Service Workers and Web Workers)

-------------------------------------------------

-> ...now...
^
-> # Javascript has all of this

^
-> _Are we done yet?_

^
-> *Not really...*

-------------------------------------------------

-> # The Web has three more issues

^
-> Reusing existing C++ code

^
-> Raw performance

^
-> Language independence

-------------------------------------------------

-> Running C++ code

^
-> inside a web page

^
-> *WHY?*

^
-> _Code Reuse and Raw Performance!_

-------------------------------------------------

-> # An Initial Attempt

^
-> NaCl

^
-> PNaCl
-> _(portable NaCl)_

-------------------------------------------------

-> _What went wrong?_

^
-> why aren't we using _NaCl_ now?

-------------------------------------------------

-> # Enter Asm.JS <-

^
-> (March 2013) <-

^
-> Was it better? <-

^
-> _Yes, and No_ <-

^
-> *But it was evolutionary* <-

-------------------------------------------------

-> # It evolved into WASM

^
-> Linear memory region
^
-> A CPU-like instruction set
^
-> Ideal target for any compiled language

^
-> *Rust is becoming an ideal choice*

-------------------------------------------------

-> # A tale of

^
-> _Pure JS_

^
-> and

^
-> *Raw CPU Power*

-------------------------------------------------

-> Remember the

-> _source-map_

-> story?

-------------------------------------------------

-> Nick Fitzgerald and Tom Tromey
^
-> reimplemented part of _source-map_ in Rust
^

-> Vyacheslav Egorov
^
-> optimized a pure JS version

-------------------------------------------------

-> An amazing exchange of posts

^
-> [Oxidizing Source Maps with Rust and WebAssembly]("https://hacks.mozilla.org/2018/01/oxidizing-source-maps-with-rust-and-webassembly")

^
-> [Maybe you don't need Rust and WASM to speed up your JS]("https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html")

^
-> [Speed Without Wizardry]("http://fitzgeraldnick.com/2018/02/26/speed-without-wizardry.html")

-------------------------------------------------

-> # What does it mean?

^
-> _the key is_

^
-> *Speed Without Wizardry*

-------------------------------------------------

-> # What do you need...

^
-> ...to write *high performance* code _in JS_?

^
-> ...well...

-------------------------------------------------

-> # What do you need...

^
-> ...to write *high performance* code?

^
-> let's say _"performance skills"_
^
-> (understanding *CPUs*, *RAM*, *caches*, *profilers*...)

-------------------------------------------------

-> # If you target Javascript

^
-> you need *all* of that

^
-> and you need to understand _JS JITs_
^
-> occasionally fight the _GC_
^
-> maybe fight the _Web APIs_ as well...
^
-> _

-------------------------------------------------

-> # Wasm can help

^
-> the _key_ is

^
-> *Speed Without Wizardry*

-------------------------------------------------

-> Wasm in the Web

^
-> Is getting more and more traction

^
-> _lots of use cases_

^
-> *3D rendering, DNA sequencing previews,*
-> *Audio Analysis, Developer Tools*
-> *and anything CPU intensive*


-------------------------------------------------

-> Use Cases Outside the Web

^
-> Wasm combines

^
-> Strong Sandboxing
^
-> Native CPU Power
^
-> Language independence

-------------------------------------------------

-> # A New trend?

^
-> *Before*: bring mainstream technologies to the web

^
-> *Now*: use web technologies in mainstream computing

-------------------------------------------------

-> # Wasm in the wild

^
-> Serverless deployments

^
-> Blockchain

^
-> Edge computing

-------------------------------------------------

-> # Why Would You Want

^
-> a *polyglot* web?

-------------------------------------------------

-> # Javascript

^
-> is *not* the *firts* language in computing history

^
-> hopefully it will *not* be the *last* one

-------------------------------------------------

-> # Javascript, browsers, and node

^
-> a _unified_ development platform

^
-> for *front* end _and_ *back* end
^
-> _

-------------------------------------------------

-> # The Wasm Perspective

^
-> the same _unified_ environent

^
-> but *wider*
^
-> with *better engineering*
^
-> and  _*polyglot*_!

^
-> (anyref proposal)
^
-> (type safe, _direct_ browser API calls)

-------------------------------------------------

-> Should Wasm _replace_ Javascript?

^
-> *of course not*

^
-> Should Wasm be _allowed_ to replace Javascript?

^
-> _yes, absolutely_

^
-> ...otherwise...

^
-> _it will be *forced* to replace Javascript!_

-------------------------------------------------

-> # Interoperability

^
-> Right now there's a _wall_ between Wasm and Javascript

^
-> Javascript cannot share _objects_ with Wasm
^
-> only _primitive values_ can freely cross the wall
^
-> (also _functions_ but in a suboptimal way)

^
-> lots of *boilerplate code* is needed to build a bridge
^
-> (even if _bindgen_ helps a _lot_)

-------------------------------------------------

-> Wasm modules are

-> *bubbles*

-> in a _Javascript_ world

-------------------------------------------------

-> ...consider string handling...

-------------------------------------------------

-> Mixing _Wasm_ and _Javascript_

^
-> should be *seamless*

^
-> then Wasm could *reuse* any JS module

^
-> there would be no *need* to *rewrite* them!

-------------------------------------------------

-> # The web

^
-> is the agreement point of the world IT players

^
-> It evolves _slowly_
^
-> *(agreement is hard)*

^
-> It evolves _powerfully_
^
-> *(agreement is a necessity)*

-------------------------------------------------

-> # Takeaway

^
-> *Never* bet

^
-> *against* the _web_!

-------------------------------------------------


-> _Thanks!_

-> *Questions?*

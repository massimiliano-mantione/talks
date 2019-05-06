-------------------------------------------------

#     Javascript and the polyglot web

Massimiliano Mantione

JsDay 2019
##     March 8th, Verona

-------------------------------------------------

-> # Things I worked on

^
-> The Mono JIT Compiler
^
-> The Unity Game Engine
^
-> The V8 Team in Google

^
-> *_Now CTO and Full Stack developer at Hyperfair_*
^
-> *Virtual Reality on the Web*

-------------------------------------------------

-> # Javascript History

^
-> In the beginning...

^
-> lots of TCP/IP protocols

^
-> *Telnet, FTP, SMTP, NTP, Gopher...*

-------------------------------------------------

-> # Tim Berners-Lee

^
-> Let there be HTTP
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
-> Then developers Came

^
-> The Web Needed Life

^
-> Pages needed to be active

-------------------------------------------------

-> # Brendan Eich

^
-> Let there be *Javascript*
^
-> _and there was Javascript_

^
-> and he saw that it was good

^
-> _*or was it?*_

-------------------------------------------------

-> # Well...

^
-> Nobody in his right mind would have said that it was good

^
-> But there Javascript was
^
-> ...for the centuries to come...

-------------------------------------------------

-> # A bit of Philosophy

^
-> Two weeks from conception to implementation

^
-> Creationism or Evolutionism?

-------------------------------------------------

-> # Javascript Evolution

^
- September 1995: Netscape Navigator 2.0
^
  (Mocha or Livescript)

^
- Netscape browser version 2.0B3
^
  (Javascript)

^
- August 1996: Internet Explorer 3.0
^
  (JScript)

-------------------------------------------------

-> # Browser Wars

^
-> Enter ECMAScript

^
- November 1996: first submission to ECMA by Netscape
^
- June 1997, Version 1: First edition
^
- June 1998, Version 2: Align with ISO/IEC 16262

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

-------------------------------------------------

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

-------------------------------------------------

-> _Has it been_

^
-> *enough?*

-------------------------------------------------

-> _*No, it never was*_

^
-> _Developers always wanted more_

-------------------------------------------------

-> Remember Java applets?

-------------------------------------------------

-> Flash and Actionscript?

-------------------------------------------------

-> Coffeescript?

-------------------------------------------------

-> Silveright?

-------------------------------------------------

-> Browser Plugins?

-------------------------------------------------

-> What was the point?

-------------------------------------------------

-> # Lack of

^
-> Language features

^
-> API power

-------------------------------------------------

-> # Language features

^
-> Static typing
^
-> Functional constructs
^
-> async await
^
-> Syntactic sugar

^
-> *transpilers can do it*

-------------------------------------------------

-> # API Power

^
- Multimedia
^
  (WebGL, WebMedia)
^
- Networking
^
  (WS, WebRTC)
^
- Parallel computing
^
  (Service and Web Workers)

-------------------------------------------------

-> # Are we done yet?

^
-> Not really...

-------------------------------------------------

-> # Two more related issues

^
-> Raw performance

^
-> Reusing existing C++ code

-------------------------------------------------

-> _Pure JS_

^
-> and

^
-> *Raw CPU Power*

-------------------------------------------------

-> Remember the

-> source-map

-> story?

-------------------------------------------------

-> Nick Fitzgerald and Tom Tromey
^
-> reimplemented part of `source-map` in Rust
^

-> Vyacheslav Egorov
^
-> optimized a pure JS version

-------------------------------------------------

-> [Oxidizing Source Maps with Rust and WebAssembly]("https://hacks.mozilla.org/2018/01/oxidizing-source-maps-with-rust-and-webassembly")

^
-> [Maybe you don't need Rust and WASM to speed up your JS]("https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html")

^
-> [Speed Without Wizardry]("http://fitzgeraldnick.com/2018/02/26/speed-without-wizardry.html")

-------------------------------------------------

-> Running C++ code

^
-> inside a web page

-------------------------------------------------

-> # Remember Web Plugins?

^
-> NaCl

^
-> PNaCl
-> _(portable NaCl)_

-------------------------------------------------

-> _What went wrong?_

-------------------------------------------------

-> # Asm.JS

^
-> (March 2013)

^
-> Was it better?

^
-> __Yes, and No__

^
-> *But it was evolutionary*

-------------------------------------------------

-> WASM

^
-> Is getting more and more traction

^
-> Lots of use cases inside the web

^
-> _And outside!_

-------------------------------------------------

-> # Wasm in the wild

^
-> Blockchain

^
-> Edge computing

-------------------------------------------------

-> # A New trend?

^
-> *Before*: bring mainstream technologies to the web

^
-> *Now*: use web technologies in mainstream computing

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

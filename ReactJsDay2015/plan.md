
The benefits of React

...you should already know!
After all you are here today


But, to be explicit

View is a pure function of the "model"
No markup language, just code
  view is really a *function* of the model
Performance (thanks to shadow DOM)



What about data binding?
Since the view is a function of the model
Changes in the model are reflected in the view
This looks like "one way" data binding
Isn't this poor?

Two way data binding...
...is cool at first!
It works like magic
But when it fails, it fails in mysterious ways


Classical MVC

A two way data binding MVC framework does two things to the model
change detection
  usually automagical
  triggers change events
change injection
  which should not be detected!
  soon the dynamic behavior of your code is a jungle of events


You start thinking like this


But it works like this
(Facebook has been bitten by this)


One way data flow
Flux



Flux as a concept is great
but the reference implementation from Facebook leaves a lot to be desired

Why not flux?

Developer Experience
Editing stores breaks hot reloading (the store content is lost)
Implementing an undo-redo debugger (time traveling) is hard

Stores are singletons
Server-side rendering is possible but overcomplicated
(harder to separate data for different requests on the server)

Multiple isolated stores
Sharing code for common functionality, like pagination, is possible but overcomplicated

Poor extensibility
(at the framework level)
No hooks for third party extensions
Example: a logging extension would need to be aware every store, and subscribe to each separately



Why redux?

Reducer Composition
Redux has a single store, but reducers can be combined
Different reducers can handle
  different parts of the model
  different application concerns
    pagination
    undo-redo

Server side rendering
Executing reducers on the server is trivial
Just feed them an initial state and a few actions
Then you have your model and you can invoke render on it


Developer Experience
Reducer code is disentangled from the store state
Therefore it can be changed at run time (hot reloading)
Since the state is immutable, we can keep copies of it over time and have a time-traveling debugger


Ecosystem
Clever use of middleware as extension point, enabling:
logging
persistence
immutability checks
routing
asynchronous actions
  plain
  promises
  observables


Redux is like Flux
All the benefits of Flux
  recording and replaying of actions
  unidirectional data flow
  dependent mutations

Redux evolves Flux
Adding
  easy undo-redo
  hot reloading
  time traveling debugger
Removing
  dispatcher
  store registration.

Simplicity
Tiny API surface
Core code (removing warnings and sanity checks) is 99 lines
No tricky async code
  (confined to middleware)
You can actually read it all!

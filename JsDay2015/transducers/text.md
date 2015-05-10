
Functional Programming
a fashionable trand


What does it mean?

First-class and higher-order functions
Pure functions (no side effects)
Describe what to compute and not how to do it

Less object oriented

No mutable objects
General functions instead of specific methods
No entanglement of code and state


Why is underscore.js popular?

Functional approach (no monkey patching)
Useful functions that
  say what you want to do (each, map, filter...)
  instead of writing loops (how to do it)


Seriously...

Take the "30 days no-loop" challenge!
http://joelhooks.com/blog/2014/02/06/stop-writing-for-loops-start-using-underscorejs/


Isn't lodash.js better?

No flame wars, please!
It improves:
  completeness
  performance
  coherence
  customizability
Otherwise, it is really similar


What about Rambda?

It makes functional best practices even simpler
Function composition is useful if you have useful building blocks to compose
Rambda makes currying the default, making it easy to build the building blocks!


Let's prove the point

var incompleteTasks = tasks.filter(task => !task.complete);

var incompleteTasks = _.filter(tasks, {complete: false});

var incomplete = R.filter(R.where({complete: false});
var incompleteTasks = incomplete(tasks);


Enter transducers

Composable algorithmic transformations
Decoupled from input or output sources
They compose directly (like functions)
  no awareness of input or creation
  no need of intermediate aggregates


Transducer building blocks

Stepper
Transformer
Transducer
reduce and transduce


Stepper

Stepper<I,E> :: (I, E) -> I

A function that takes a initial value and an element, and returns a new value for the initial item
It is the typical argument of reduce


Transformer

Transformer<I,E,R> :: {
  init :: () -> I
  step :: Stepper<I,E>
  result :: I -> R
}

Three functions, like e generalized stepper (with added begin and completion handlers)


Transducer

TransformerOrStepper :: Transformer | Stepper

Transducer :: TransformerOrStepper -> Transformer

A function that transforms a transformer into another transformer
(let that sink in...)
It transforms transformers!


Where's thje catch?

A transformer can also be a simple stepper
Particularly, it can be an "iterator" that scans a sequence without transforming anything
Typically an "iterator transformer" of this kind is the starting point of a transduce chain


The base example: reduce

reduce<I,E,R> :: (
    TransformerOrStepper<I,E,R>
    I
    Iterator<E>
  ) -> R

(transformation, initialValue, collection) -> result


The generalized form: transduce

transduce<I,E,R> :: (
    Transducer<I,E,R>
    Stepper<I,E>
    I
    Iterator<E>
  ) -> R

transformation (over the input)
result builder (how to append into the intermediate results)
initial value (optional)
input sequence


Let's see some real code...




What about async?

What does "async computation" mean?
Push vs Pull


Iterable<T> :: {
  '@@iterator' :: Iterator<T>
}

Iterator<T> :: {
  next :: () -> ({done :: bool, value :: T} | throws Error)
}

Observable<T> :: {
  Subscribe :: Observer<T> -> (() -> ())
}

Observer<T> :: {
  onCompleted :: () -> ()
  onError :: Error -> ()
  onNext :: T -> ()
}


What do Iterator and Observer have in common?

Thay specofy what to do in case of
  next value
  completion
  error

What changes is just the push vs pull


Promises

Promise<T> :: {
  next :: T -> ()
  error :: Error -> ()
}

AsyncElement<T> :: {
  value :: T
  next :: Promise<AsyncElement<T>>
}

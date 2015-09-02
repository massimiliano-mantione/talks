// Stepper

sum = function(result, item){
  return result + item;
};

mult = function(result, item){
  return result * item;
};

// 10 (=1+2+3+4)
result = [2,3,4].reduce(sum, 1);

// 24 (=1*2*3*4)
result = [2,3,4].reduce(mult, 1);


// Transformer

transformer = function(reducingFunction){
  return {
    // 1. Start with an initial value
    init: function(){
      return 1;
    },

    // 2. Input one item at a time, passing
    //    each result to next iteration
    //    using reducing function
    step: reducingFunction,

    // 3. Output last computed result
    result: function(result){
      return result;
    }
  }
};

input = [2,3,4];

xf = transformer(sum);
output = input.reduce(xf.step, xf.init());
// output = 10 (=1+2+3+4)

xf = transformer(mult);
output = input.reduce(xf.step, xf.init());
// output = 24 (=1*2*3*4)



// wrap a stepper function into a transformer

wrap = function(f){
  return {
    // reduce requires init as arg, so no need here
    init: function(){
      throw new Error('init not supported');
    },

    // stepper function
    step: f,

    // output last computed result
    result: function(result){
      return result;
    }
  }
};


// reduce with wrapper (accepts a stepper or a transformer)

reduce = function(xf, init, input){
  if(typeof xf === 'function'){
    // make sure we have a transformer
    xf = wrap(xf);
  }
  var result = input.reduce(xf.step, init);
  return xf.result(result);
};


// now reduce also accepts a reducing function or a transformer

input = [2,3,4];

output = reduce(sum, 1, input);
// output = 10 (=1+2+3+4)

output = reduce(mult, 2, input);
// output = 48 (=2*2*3*4)

output = reduce(wrap(sum), 1, input);
// output = 11 (=2+2+3+4)

output = reduce(wrap(mult), 1, input);
// output = 24 (=1*2*3*4)



// reduce can also copy from one array into another

append = function(result, item){
  result.push(item);
  return result;
};

output = reduce(append, [], input);
// output = [2, 3, 4]



// combination of transformations, 1st attempt

// let's make a transformer that adds 1
// and then reduce it to the sum of the elements

plus1 = function(item){
  return item + 1;
};
xfplus1 = wrap (function(result, item) {
  return append(result, plus1(item));
});

// let's step through it manually
xf = xfplus1;
init = [];
result = xf.step(init, 2);
// [3] (=append([], 2+1)))
result = xf.step(result, 3);
// [3,4] (=append([3], 3+1)))
result = xf.step(result, 4);
// [3,4,5] (=append([3,4], 4+1)))
output = xf.result(result);
// [3,4,5]


// reduce works, but creates a new array...
output = reduce(sum, 0, output);
// output = 12 (=3+4+5)



// back to slides...



// out 1st transducer (it adds 1):

transducerPlus1 = function(xf){
  return {
    init: function(){
      return xf.init();
    },
    step: function(result, item){
      var plus1ed = plus1(item);
      return xf.step(result, plus1ed);
    },
    result: function(result){
      return xf.result(result);
    }
  }
};


// let's use it!

stepper = wrap(append);
init = [];
transducer = transducerPlus1;
xf = transducer(stepper);
result = xf.step(init, 2);
// [3] (=append([], 2+1)))
result = xf.step(result, 3);
// [3,4] (=append([3], 3+1)))
result = xf.step(result, 4);
// [3,4,5] (=append([3,4], 4+1)))
output = xf.result(result);
// [3,4,5]


// and now, let's combine it with add (to reduce to sum):

stepper = wrap(sum);
init = 0;
transducer = transducerPlus1;

// composition: combine plus1 and reduce(sum)
xf = transducer(stepper);
// equivalent to 'transducerPlus1(wrap(sum))'

result = xf.step(init, 2);
// 3 (=sum(0, 2+1)))
result = xf.step(result, 3);
// 7 (=sum(3, 3+1)))
result = xf.step(result, 4);
// 12 (=sum(7, 4+1)))
output = xf.result(result);
// 12



// transduce

var transduce = function(transducer, stepper, init, input){
  if(typeof stepper === 'function'){
    // make sure we have a transformer for stepping
    stepper = wrap(stepper);
  }

  // pass in stepper to create transformer
  var xf = transducer(stepper);

  // xf is now a transformer
  // we now can use reduce defined above to
  // iterate and transform input
  return reduce(xf, init, input);
};


// a useful transducer: map

map = function(f){
  return function(xf){
    return {
      init: function(){
        return xf.init();
      },
      step: function(result, item){
        var mapped = f(item);
        return xf.step(result, mapped);
      },
      result: function(result){
        return xf.result(result);
      }
    }
  }
};


input = [2,3,4];
output = transduce(map(plus1), append, [], input);
// [3,4,5]
output = transduce(map(plus1), sum, 0, input);
// 12
output = transduce(map(plus1), mult, 1, input);
// 60

plus2 = function(input){
  return input+2;
};
output = transduce(map(plus2), append, [], input);
// [4,5,6]
output = transduce(map(plus2), sum, 0, input);
// 15
output = transduce(map(plus2), mult, 1, input);
// 120


// more than one transformation...

compose2 = function(fn1, fn2){
  return function(item){
    var result = fn2(item);
    result = fn1(result);
    return result;
  }
}

output = transduce(map(compose2(plus1, plus2)), sum, 0, input);
// 18 (2+3 + 3+3 + 4+3)

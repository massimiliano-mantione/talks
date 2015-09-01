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


////////////////////
// Back to slides...
////////////////////





// Transformer

var one = function() { return 1; };
var identity = function(result) { return result; };

transformer = function(init, stepper, result){
  return {
    // 1. Start with an initial value
    init: init,

    // 2. Input one item at a time, passing
    //    each result to next iteration
    //    using reducing function
    step: stepper,

    // 3. Output last computed result
    result: result || identity
  }
};


input = [2,3,4];

xf = transformer(one, sum);
output = input.reduce(xf.step, xf.init());
// output = 10 (=1+2+3+4)

xf = transformer(one, mult);
output = input.reduce(xf.step, xf.init());
// output = 24 (=1*2*3*4)


////////////////////
// Back to slides...
////////////////////





// Reduce

// First we wrap a stepper function into a transformer

wrap = function(stepper){
  return transformer (
    // this transformer does not support initialization
    // (reduce will provide the initial value)
    function(){
      throw new Error('init not supported');
    },

    // stepper function
    stepper,

    // output last computed result
    identity
  )
};


// reduce with wrapper (accepts a stepper or a transformer)
// (for now we expect input to support the reduce method,
// which wirks on arrays)

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
// output = 10 (=1+2+3+4)

output = reduce(wrap(mult), 1, input);
// output = 24 (=1*2*3*4)



// reduce can also copy from one array into another!

append = function(result, item){
  result.push(item);
  return result;
};

output = reduce(append, [], input);
// output = [2, 3, 4]


////////////////////
// Back to slides...
////////////////////






// Transducer


// combination of transformations, 1st attempt

// let's make a transformer that adds 1

plus1 = function(item){
  return item + 1;
};
xfplus1 = wrap (function(result, item) {
  return append(result, plus1(item));
});

// let's step through it manually
xf = xfplus1;
result = xf.step([], 2);
// [3] (=append([], 2+1)))
result = xf.step(result, 3);
// [3,4] (=append([3], 3+1)))
result = xf.step(result, 4);
// [3,4,5] (=append([3,4], 4+1)))
output = xf.result(result);
// [3,4,5]


// now reduce the result to the sum of the elements

output = reduce(sum, 0, output);
// output = 12 (=3+4+5)
// (reduce worked, but it created a new array...)




// out 1st transducer (it adds 1):

transducerPlus1 = function(xf){
  return transformer (
    // init:
    function(){
      return xf.init();
    },
    // step:
    function(result, item){
      var plus1ed = plus1(item);
      return xf.step(result, plus1ed);
    },
    // result:
    function(result){
      return xf.result(result);
    }
  );
};


// let's use it!

xf = transducerPlus1(wrap(append));
result = xf.step([], 2);
// [3] (=append([], 2+1)))
result = xf.step(result, 3);
// [3,4] (=append([3], 3+1)))
result = xf.step(result, 4);
// [3,4,5] (=append([3,4], 4+1)))
output = xf.result(result);
// [3,4,5]


// and now, let's combine it with add (to reduce to sum):

xf = transducerPlus1(wrap(sum));

result = xf.step(0, 2);
// 3 (=sum(0, 2+1)))
result = xf.step(result, 3);
// 7 (=sum(3, 3+1)))
result = xf.step(result, 4);
// 12 (=sum(7, 4+1)))
output = xf.result(result);
// 12



////////////////////
// Back to slides...
////////////////////








// Transduce

var transduce = function(
      transducer,
      stepper,
      init,
      input) {
  if(typeof stepper === 'function'){
    // make sure we have a transformer for stepping
    stepper = wrap(stepper);
  }

  // pass in stepper to get the combined transformer
  var xf = transducer(stepper);

  // xf is now a transformer
  // we now can use reduce defined above to
  // iterate and transform input
  return reduce(xf, init, input);
};


// a useful transducer: map

map = function(f) {
  return function(xf){
    return transformer (
      // init:
      function(){
        return xf.init();
      },
      // step:
      function(result, item){
        var mapped = f(item);
        return xf.step(result, mapped);
      },
      // result:
      function(result){
        return xf.result(result);
      }
    );
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

// compose 2 functions
compose2 = function(fn1, fn2){
  return function(item){
    var result = fn2(item);
    result = fn1(result);
    return result;
  }
}

// transduce using a combined transformer
// (reduces to the sum of mapping plus1 and plus2)
output = transduce(map(compose2(plus1, plus2)), sum, 0, input);
// 18 (2+3 + 3+3 + 4+3)

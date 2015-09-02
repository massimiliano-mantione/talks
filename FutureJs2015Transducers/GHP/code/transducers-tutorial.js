// Stepper

sum = function(result, item){
  return result + item;
};

mult = function(result, item){
  return result * item;
};

var input = [2,3,4];

// 10 (=1+2+3+4)
result = input.reduce(sum, 1);

// 24 (=1*2*3*4)
result = input.reduce(mult, 1);


////////////////////
// Back to slides...
////////////////////





// Transformer

var one = function() { return 1; };
var identity = function(result) { return result; };

transformer = function(init, stepper, result) {
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

// If needed, wrap a stepper function into a transformer

wrap = function(stepperOrTransformer){
  if (typeof stepperOrTransformer === 'function') {
    // It was a stepper: return a transformer
    return transformer (
      // this transformer does not support initialization
      // (reduce will provide the initial value)
      function(){
        throw new Error('init not supported');
      },

      // step: (stepper function)
      stepperOrTransformer,

      // result: (compute final result)
      identity
    );
  } else {
    // It was a transformer: just return it
    return stepperOrTransformer;
  }
};


// reduce with wrapper (accepts a stepper or a transformer)
// (for now we expect input to support the reduce method,
// which works on arrays)

reduce = function(xf, init, input){
  // make sure we have a transformer
  xf = wrap(xf);
  var result = input.reduce(xf.step, init);
  return xf.result(result);
};


// now reduce also accepts a reducing function or a transformer

input = [2,3,4];

output = reduce(sum, 1, input);
// output = 10 (=1+2+3+4)

output = reduce(mult, 1, input);
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

// let's make a transformer that adds 1
// and combine it with the append stepper

plus1 = function(item){
  return item + 1;
};


// out 1st transducer (it adds 1):

transducerPlus1 = function(xf) {
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

// combine plus1 and append:

xf = transducerPlus1(wrap(append));

// Input was [2, 3, 4]
result = xf.step([], 2);
// [3] (=append([], 2+1)))
result = xf.step(result, 3);
// [3,4] (=append([3], 3+1)))
result = xf.step(result, 4);
// [3,4,5] (=append([3,4], 4+1)))
output = xf.result(result);
// [3,4,5] (=[2+1, 3+1. 4+1])


// now let's combine it with add (to reduce to sum):

xf = transducerPlus1(wrap(sum));

// Input was [2, 3, 4]
result = xf.step(0, 2);
// 3 (=sum(0, 2+1)))
result = xf.step(result, 3);
// 7 (=sum(3, 3+1)))
result = xf.step(result, 4);
// 12 (=sum(7, 4+1)))
output = xf.result(result);
// 12 (= 2+1 + 3+1 + 4+1)



////////////////////
// Back to slides...
////////////////////








// Transduce

var transduce = function(
      transducer,
      stepper,
      init,
      input) {
  // make sure we have a transformer for stepping
  stepper = wrap(stepper);

  // pass in stepper to get the combined transformer
  var xf = transducer(stepper);

  // xf is now the combined transformer
  // we now can use reduce defined above to
  // iterate and transform input
  return reduce(xf, init, input);
};


// a useful transducer: map

map = function(f) {
  // returns the transducer...
  return function(xf) {
    // the transducer builds a transformer...
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
// [3,4,5] (= [2+1, 3+1, 4+1])
output = transduce(map(plus1), sum, 0, input);
// 12 (= 0 + 2+1 + 3+1 + 4+1)
output = transduce(map(plus1), mult, 1, input);
// 60 (= 1 * 2+1 * 3+1 * 4+1)

plus2 = function(input){
  return input+2;
};
output = transduce(map(plus2), append, [], input);
// [4,5,6] (= [2+2, 3+2, 4+2])
output = transduce(map(plus2), sum, 0, input);
// 15 (= 0 + 2+2 + 3+2 + 4+2)
output = transduce(map(plus2), mult, 1, input);
// 120 (= 1 * 2+2 * 3+2 * 4+2)


// more than one transformation...

// compose 2 functions
compose2 = function(fn1, fn2) {
  return function(item) {
    return fn1(fn2(item));
  }
}

// transduce using a combined transformer
// (reduces to the sum of mapping plus1 and plus2)
output = transduce(map(compose2(plus1, plus2)), sum, 0, input);
// 18 (= 0 + 2+3 + 3+3 + 4+3)

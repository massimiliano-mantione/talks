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


// reduce that takes a transformer instead of a stepper

reduce = function(xf, init, input){
  var result = input.reduce(xf.step, init);
  return xf.result(result);
};


input = [2,3,4];
xf = transformer(sum);
output = reduce(xf, xf.init(), input);
// output = 10 (=1+2+3+4)

input = [2,3,4];
xf = transformer(mult);
output = reduce(xf, xf.init(), input);
// output = 24 (=1*2*3*4)

// we can choose an initial value different from the default one

input = [2,3,4];
xf = transformer(sum);
output = reduce(xf, 2, input);
// output = 11 (=2+2+3+4)

input = [2,3,4];
xf = transformer(mult);
output = reduce(xf, 2, input);
// output = 48 (=2*2*3*4)



// wrap a stepper function into a transformer

wrap = function(f){
  return {
    // 1. We require init as arg, so do not need here
    init: function(){
      throw new Error('init not supported');
    },

    // 2. Input one item at a time, passing
    //    each result to next iteration
    step: f,

    // 3. Output last computed result
    result: function(result){
      return result;
    }
  }
};


// reduce with wrapper (accepts eiter stepper or transformer)

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

input = [2,3,4];
output = reduce(mult, 2, input);
// output = 48 (=2*2*3*4)

input = [2,3,4];
xf = wrap(sum);
output = reduce(xf, 2, input);
// output = 11 (=2+2+3+4)

input = [2,3,4];
xf = wrap(mult);
output = reduce(xf, 1, input);
// output = 24 (=1*2*3*4)



// reduce can also copy from one array into another

append = function(result, item){
  result.push(item);
  return result;
};

input = [2,3,4];
output = reduce(append, [], input);
// output = [2, 3, 4]


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


// and now, let's combine it with reduce(add):

stepper = wrap(sum);
init = 0;
transducer = transducerPlus1;

// composition: combine plus1 and reduce(sum)
xf = transducer(stepper);

result = xf.step(init, 2);
// 3 (=sum(0, 2+1)))
result = xf.step(result, 3);
// 7 (=sum(3, 3+1)))
result = xf.step(result, 4);
// 12 (=sum(7, 4+1)))
output = xf.result(result);
// 12

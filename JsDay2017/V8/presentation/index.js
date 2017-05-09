// Import React
import React from 'react'

// Import Spectacle Core tags
import {
  Deck,
  Slide,
  Heading,
  Text,
  BlockQuote,
  Quote,
  Cite,
  ListItem,
  List,
  CodePane,
  Layout,
  Fit,
  Fill,
  Image,
  Appear
} from 'spectacle'

// Import image preloader util
import preloader from 'spectacle/lib/utils/preloader'

// Import theme
import createTheme from 'spectacle/lib/themes/default'

// Require CSS
require('normalize.css')
require('spectacle/lib/themes/default/index.css')

const images = {
  v8oldPipeline: require('../assets/v8-old-pipeline.png'),
  v8newPipeline: require('../assets/v8-new-pipeline.png'),
  v8turbofanPipeline: require('../assets/v8-turbofan-pipeline.png'),
  v8performanceProfiles: require('../assets/v8-performance-profiles.png'),
  speedtrap: require('../assets/speedtrap.jpg'),
  qrCode: require('../assets/jsday-2017-v8.png'),
  jsday: require('../assets/jsday.png')
}

preloader(images)

const theme = createTheme({
  primary: 'white',
  secondary: '#1F2022',
  tertiary: '#D01010',
  quartenary: '#4E4E4E'
}, {
  primary: 'Montserrat',
  secondary: 'Helvetica'
})

const slideZoom = (children) => {
  return <Slide transition={['zoom', 'slide']} bgColor="secondary" textColor="primary">{children}</Slide>
}
const slide = (children) => {
  return <Slide transition={['fade']} bgColor="secondary" textColor="primary">{children}</Slide>
}
const slideTrap = (children) => {
  return <Slide transition={['zoom', 'slide']} bgImage={images.speedtrap.replace("/", "")} bgDarken={0.75} textColor="primary">{children}</Slide>
}

const titleSetCaps = (text, caps, p1, p2) => {
  let fit = true
  let size = 2
  for (const p of [p1, p2]) {
    if (typeof p === 'boolean') {
      fit = p
    } else if (typeof p === 'number') {
      size = p
    }
  }
  return <Heading size={size} fit={fit} caps={caps} lineHeight={1.2} textColor="primary">{text}</Heading>
}
const title = (text, p1, p2) => {
  return titleSetCaps(text, true, p1, p2)
}
const titleNoCaps = (text, p1, p2) => {
  return titleSetCaps(text, false, p1, p2)
}
const titleTrap = (text) => {
  return <Heading size={2} fit caps lineHeight={1.2} textColor="tertiary">{text}</Heading>
}

const line = (props, children) => {
  if (children === undefined) {
    children = props
    props = {}
  }
  if (props.lh !== undefined) {
    props.lineHeight = props.lh
    delete props.lh
  }
  const p = {
    italic: false,
    bold: false,
    size: 5,
    caps: false,
    fit: false,
    lineSize: 1.3,
    padding: 0,
    margin: '0.3em',
    textColor: 'primary'
  }
  Object.assign(p, props)
  return (<Appear>
    <Text italic={p.italic}
      bold={p.bold}
      textSize={p.textSize}
      size={p.size}
      lineHeight={p.lineHeight}
      padding={p.padding}
      margin={p.margin}
      caps={p.caps}
      fit={p.fit}
      textColor={p.textColor}
    >
      {children}
    </Text>
  </Appear>)
}
const lineEm = (children) => {
  return line({ italic: true }, children)
}
const lineBold = (children) => {
  return line({ bold: true }, children)
}
const lineTrap = (children) => {
  return line({ bold: true, textColor: 'tertiary' }, children)
}

const quote = (text, cite) => {
  return (<BlockQuote>
    <Quote><Text size={2} textColor="primary">{text}</Text></Quote>
    <Cite>{cite}</Cite>
  </BlockQuote>)
}

const quoteImage = (text, cite, image) => {
  return (<Layout>
    <Fit>
      <div style={{ display: 'flex', heigth: '100%' }}>
        <div style={{ display: 'inline-block', alignSelf: 'center', verticalAlign: 'middle' }}>
          <Image src={image.replace('/', '')} width="15vw" heigth="auto" style={{ display: 'inline-block', alignItems: 'center' }}/>
        </div>
      </div>
    </Fit>
    <Fill>
      {quote(text, cite)}
    </Fill>
  </Layout>)
}

const codeBlock = (text, size = '0.7em') => {
  return <CodePane textSize={size} lang="jsx">{text}</CodePane>
}

const image = (name, size) => {
  return <Image src={name.replace('/', '')} width={size}/>
}

const logo = () => {
  return image(images.jsday, '20vw')
}
const talkQrCode = () => {
  return image(images.qrCode, '20vw')
}

const slides = () => {
  return [
    slideZoom([
      title('HOW MUCH PERFORMANCE'),
      title('CAN YOU GET', false, 4),
      title('OUT OF JAVASCRIPT?')
    ]),
    slideZoom([
      logo(),
      titleNoCaps('Verona, May 10 2017', false, 6),
      title('HOW MUCH PERFORMANCE', false, 5),
      title('CAN YOU GET', false, 5),
      title('OUT OF JAVASCRIPT?', false, 4),
      titleNoCaps('Massimiliano Mantione', false, 6),
      titleNoCaps('@M_a_s_s_i', false, 6)
    ]),
    slideZoom([
      title('Things I worked on'),
      line('The Mono JIT Compiler'),
      line('The Unity Game Engine'),
      line('The V8 Team in Google'),
      lineBold('Now CTO and Full Stack developer at Hyperfair'),
      lineEm('(Virtual Reality Platform)')
    ]),

    slide([
      title('Does Javascript Performance'),
      title('matter?'),
      lineBold('Of course it does...'),
      lineEm('Please, ask a better question')
    ]),

    slide([
      title('Does Javascript Performance'),
      title('matter to you?'),
      lineEm('It depends on the application you are developing'),
      lineBold('Something else, please')
    ]),

    slide([
      title('Should I know how to write'),
      title('High Performance Javascript?'),
      lineEm('Again, it depends'),
      lineBold('but we\'re getting there...')
    ]),

    slide([
      title('Should I know the'),
      title('potential'),
      title('of Javascript code Performance?'),
      lineEm('now,'),
      lineBold('this is the correct question')
    ]),

    slide([
      title('If you don\'t know it'),
      line('you cannot imagine anything new'),
      lineBold('and know if it is feasible')
    ]),

    slide([
      title('Would you imagine adding...'),
      line('...a neural network working in real time inside a web app?'),
      lineEm('How would you know if it would work?')
    ]),

    slide([
      title('A simple problem'),
      lineBold('find 25000 prime numbers'),
      lineEm('for x = 1 to infinity:'),
      lineEm('if x not divisible by any member of an initially empty list of primes,'),
      lineEm('add x to the list until we have 25000 elements')
    ]),

    slide([
      title('How fast will it be?'),
      line('How do I know?'),
      lineEm('Let\'s experiment!')
    ]),

    slide([
      title('The contenders: Js'),
      codeBlock(`function Primes() {
  this.prime_count = 0;
  this.primes = new Array(25000);
  this.getPrimeCount = function() { return this.prime_count; }
  this.getPrime = function(i) { return this.primes[i]; }
  this.addPrime = function(i) {
    this.primes[this.prime_count++] = i;
  }

  this.isPrimeDivisible = function(candidate) {
    for (var i = 1; i <= this.prime_count; ++i) {
      if ((candidate % this.primes[i]) == 0) return true;
    }
    return false;
  }
};

function main() {
  p = new Primes();
  var c = 1;
  while (p.getPrimeCount() < 25000) {
    if (!p.isPrimeDivisible(c)) {
      p.addPrime(c);
    }
    c++;
  }
  print(p.getPrime(p.getPrimeCount()-1));
}

main();`, '0.3em')
    ]),

    slide([
      title('The contenders: C++'),
      codeBlock(`class Primes {
 public:
  int getPrimeCount() const { return prime_count; }
  int getPrime(int i) const { return primes[i]; }
  void addPrime(int i) { primes[prime_count++] = i; }

  bool isDivisibe(int i, int by) { return (i % by) == 0; }

  bool isPrimeDivisible(int candidate) {
    for (int i = 1; i < prime_count; ++i) {
      if (isDivisibe(candidate, primes[i])) return true;
    }
    return false;
  }

 private:
  volatile int prime_count;
  volatile int primes[25000];
};

int main() {
  Primes p;
  int c = 1;
  while (p.getPrimeCount() < 25000) {
    if (!p.isPrimeDivisible(c)) {
      p.addPrime(c);
    }
    c++;
  }
  printf("%d\n", p.getPrime(p.getPrimeCount()-1));
}`, '0.3em')
    ]),

    slide([
      title('Let\'s', false),
      title('RACE!')
    ]),

    slide([
      title('Ok, we did it, now we know...'),
      line('C++ is about 5 times faster than JavaScript'),
      lineEm('I guess that\'s not so bad, right?'),
      lineBold('Of course it is SO BAD!')
    ]),

    slide([
      title('You deserve more'),
      line({ bold: true, fit: true, caps: true }, 'Don\'t give up!'),
      line({ bold: true, fit: true, caps: true }, 'Demand faster!')
    ]),

    slide([
      title('How much faster?'),
      line('3x?'),
      line('30x?'),
      line('300x?'),
      line('3000x?'),
      lineEm('How do we know?')
    ]),

    slide([
      title('We need to be prepared'),
      line('Know what to expect'),
      line('Know how the VM executes and optimizes your code'),
      line('Know how to inspect what is really going on'),
      lineEm('Know that you will never guess it right before experimenting!')
    ]),

    slide([
      title('Understanding how'),
      title('V8', false, 1),
      title('optimizes JavaScript')
    ]),

    slide([
      title('What is optimized code?'),
      lineEm('Several steps'),
      line('Interpreter: lots of branches to select the operation'),
      line('Fast JIT: machine code with calls to (slow) generic operations'),
      line('JIT with type info: machine code with calls to specific operations'),
      line('Optimizing JIT: as above but with compiler optimizations')
    ]),

    slide([
      title('Hidden Classes'),
      line('No type info in the source code means no optimizations'),
      line('Type info could make JavaScript faster (like C++?)'),
      lineEm('V8 internally creates hidden classes for objects at runtime'),
      lineBold('Objects with the same hidden class can use the same optimized code')
    ]),

    slide([
      title('code', false, 6),
      codeBlock(`function Point(x, y) {
  this.x = x;
  this.y = y;
}

var p1 = new Point(11, 22);
var p2 = new Point(33, 44);
p2.z = 55;`)
    ]),

    slideTrap([
      titleTrap('Avoid the speed trap'),
      lineTrap('Initialize all object members in constructor functions'),
      lineTrap('Always initialize object members in the same order')
    ]),

    slide([
      title('Fast Numbers'),
      line('Objects and numbers are very different'),
      lineEm('Javascript can mix them freely'),
      lineBold('V8 uses tagging: 1 bit in a pointer'),
      lineEm('Values can be objects, SMall Integers (SMI) or boxed double')
    ]),

    slideTrap([
      titleTrap('Avoid the speed trap'),
      lineTrap('Prefer numeric values that can be represented as 31-bit signed integers')
    ]),

    slide([
      title('Handling Large and Sparse Arrays'),
      line('Fast Elements: linear storage for compact key sets'),
      line('Dictionary Elements: hash table storage otherwise')
    ]),

    slideTrap([
      titleTrap('Avoid the speed trap'),
      lineTrap('Fast Elements: linear storage for compact key sets'),
      lineTrap('Dictionary Elements: hash table storage otherwise')
    ]),

    slide([
      title('code', false, 6),
      codeBlock(`a = new Array();
for (var b = 0; b < 10; b++) {
  a[0] |= b;  // Oh no!
}

a = new Array();
a[0] = 0;
for (var b = 0; b < 10; b++) {
  a[0] |= b;  // Much better! 2x faster.
}`)
    ]),

    slideTrap([
      titleTrap('Avoid the speed trap'),
      lineTrap('Use contiguous keys starting at 0 for Arrays'),
      lineTrap('Don\'t pre-allocate large Arrays (e.g. > 64K elements)'),
      lineTrap('Don\'t delete elements in arrays, especially numeric arrays'),
      lineTrap('Don\'t load uninitialized or deleted elements')
    ]),

    slide([
      title('Specialized array elements'),
      line('Arrays of "pure doubles" are not slow'),
      lineEm('In general, hidden classes track array element types'),
      lineBold('[un]boxing causes hidden array class change')
    ]),

    slide([
      title('code', false, 6),
      codeBlock(`// The bad way
var a = new Array();
a[0] = 77;    // Allocates
a[1] = 88;
a[2] = 0.5;   // Allocates, converts
a[3] = true;  // Allocates, converts

// Hidden Classes for Elements - A Better Way
var a = [77, 88, 0.5, true];`)
    ]),

    slideTrap([
      titleTrap('Avoid the speed trap'),
      lineTrap('Initialize using array literals for small fixed-sized arrays'),
      lineTrap('Preallocate small arrays to correct size before using them'),
      lineTrap('Don\'t store non-numeric values (objects) in numeric arrays')
    ]),

    slide([
      title('Fast or Optimizing?'),
      lineEm('Historically, V8 had two engines'),
      line('"Full" compiler (fullGen) can generate good code for any JavaScript'),
      line('Optimizing compiler (crankshaft) produces great code for most JavaScript')
    ]),

    slide([
      title('The fast compiler'),
      line('"Full" Compiler Starts Executing Code ASAP'),
      line('Quickly generates good but not great JIT code'),
      lineEm('Assumes (almost) nothing about types at compilation time')
    ]),

    slide([
      title('Inline Caches (ICs)'),
      line('Handle types efficiently in fullgen'),
      line('Type-dependent code for every operation'),
      line('Validate type assumptions first, then do work'),
      line('ICs self-modify at runtime via backpatching')
    ]),

    slide([
      title('Javascript Code'),
      codeBlock(`// Consider candidate % this.primes[i] 
this.isPrimeDivisible = function(candidate) {
  for (var i = 1; i <= this.prime_count; ++i) {
    if (candidate % this.primes[i] == 0) return true;
  }
  return false;
}`)
    ]),

    slide([
      title('Inline Cache Code'),
      codeBlock(`push [ebp+0x8]
mov eax,[ebp+0xc]
mov edx,eax
mov ecx,0x50b155dd 
call LoadIC_Initialize           ;; this.primes
push eax
mov eax,[ebp+0xf4]
pop edx
mov ecx,eax
call KeyedLoadIC_Initialize      ;; this.primes[i]
pop edx
call BinaryOpIC_Initialize Mod   ;; candidate % this.primes[i]`)
    ]),

    slide([
      title('More engines!'),
      lineEm('V8 gained two more engines'),
      line('Ignition, an interpreter for memory constrained devices'),
      line('Turbofan, an optimizing compiler even more sophisticated than crankshaft')
    ]),

    slide([
      title('Old pipeline', false, 6),
      image(images.v8oldPipeline, '90vw')
    ]),

    slide([
      title('New pipeline', false, 6),
      image(images.v8newPipeline, '90vw')
    ]),

    slide([
      title('Turbofan', false, 6),
      image(images.v8turbofanPipeline, '90vw')
    ]),

    slide([
      title('Megamorphic attack!'),
      line('Operations are monomorphic if the hidden class is always the same'),
      line('Otherwise they are polymorphic'),
      line('Monomorphic is better than polymorphic')
    ]),

    slide([
      title('code', false, 6),
      codeBlock(`function add(x, y) {
  return x + y;
}

add(1, 2);      // + in add is monomorphic
add("a", "b");  // + in add becomes polymorphic`)
    ]),

    slideTrap([
      titleTrap('Avoid the speed trap'),
      lineTrap('Prefer monomorphic over polymorphic wherever possible'),
      lineTrap('Redux issues (https://medium.com/@bmeurer/surprising-polymorphism-in-react-applications-63015b50abc)')
    ]),

    slide([
      title('The Optimizing Compiler'),
      line('V8 re-compiles hot functions with an optimizing compiler'),
      line('Type information makes code faster'),
      line('Operations speculatively get inlined'),
      line('Monomorphic calls and are also inlined'),
      line('Inlining enables other optimizations')
    ]),

    slide([
      codeBlock(`;; optimized code for candidate % this.primes[i] 
cmp [edi+0xff],0x4920d181   ;; Is this a Primes object?
jnz 0x2a90a03c              
mov eax,[edi+0xf]           ;; Fetch this.primes
test eax,0x1                ;; Is primes a SMI ?
jz 0x2a90a050               
cmp [eax+0xff],0x4920b001   ;; Is primes hidden class a packed SMI array? 
mov ebx,[eax+0x7]
mov esi,[eax+0xb]           ;; Load array length
sar esi,1                   ;; Convert SMI length to int32
cmp ecx,esi                 ;; Check array bounds
jnc 0x2a90a06e             
mov esi,[ebx+ecx*4+0x7]     ;; Load element
sar esi,1                   ;; Convert SMI element to int32
test esi,esi                ;; mod (int32)
jz 0x2a90a078               
... 				
cdq
idiv esi`, '0.5em')
    ]),

    slide([
      title('No more bailouts!'),
      line('In the past some constructs could not be optimized'),
      lineEm('(try-catch, with, generators...)'),
      lineBold('Now turbofan can optimize everything!')
    ]),

    slide([
      title('Aaarg... deoptimization!'),
      line('Optimizations are speculative'),
      lineBold('Usually, they pay off')
    ]),

    slide([
      title('Deoptimization:'),
      line('throws away optimized code (crankshaft or turbofan)'),
      line('resumes execution at the right place in fullgen or ignition'),
      lineEm('reoptimization might be triggered again later, but for the short term, execution slows down')
    ]),

    slideTrap([
      titleTrap('Avoid the speed trap'),
      lineTrap('Avoid hidden class changes in functions after they are optimized'),
      lineTrap('Even if indirectly, Typescript and Flowtype help!')
    ]),

    slide([
      title('Know your tools'),
      line('Using the profiler: --prof and --prof-process (nodejs)'),
      line('Logging what gets optimized: --trace-opt'),
      line('Detecting deoptimizations: --trace-deopt'),
      lineBold('Passing V8 options to Chrome: --js-flags="--trace-opt --trace-deopt"')
    ]),

    slide([
      title('Are you prepared?'),
      line('Ensure problem is JavaScript'),
      line('Reduce to pure JavaScript (no DOM!)'),
      line('Collect metrics'),
      line('Locate bottleneck(s)'),
      lineBold('Fix problems(s)!')
    ]),

    slide([
      title('Let\'s make it'),
      line({ fit: true, caps: true, bold: true }, 'FASTER')
    ]),

    slideZoom([
      title('That\'s all...', false, 5),
      title('Questions?')
    ]),
    slideZoom([
      title('Rate Talk on JoindIn', false, 4),
      talkQrCode(),
      titleNoCaps('https://joind.in/talk/0a58b', false, 6),
      title('Thank You!')
    ])
  ]
}

export default class Presentation extends React.Component {
  render () {
    return (
      <Deck
        transition={['zoom', 'slide']}
        transitionDuration={500}
        theme={theme}
        progress="bar"
        controls="false"
      >
        {slides()}
      </Deck>
    )
  }
}

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
  alan: require('../assets/alan-kay.jpg'),
  joe: require('../assets/joe-armstrong.jpg'),
  michael: require('../assets/michael-feathers.jpg'),
  rich: require('../assets/rich-hickey.png'),
  rust: require('../assets/rust-linz.png'),
  bg: require('../assets/rust-bg.jpg')
}

preloader(images)

const theme = createTheme({
  primary: 'white',
  secondary: '#1F2022',
  tertiary: '#03A9FC',
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
const slideRustZoom = (children) => {
  return <Slide transition={['zoom', 'slide']} bgColor="secondary" bgImage={images.bg} textColor="primary">{children}</Slide>
}
const slideRust = (children) => {
  return <Slide transition={['fade']} bgColor="secondary" bgImage={images.bg} textColor="primary">{children}</Slide>
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

const codeBlock = (text) => {
  return <CodePane textSize="0.7em" lang="jsx">{text}</CodePane>
}

const logo = () => {
  return (
    <div style={{ display: 'flex', alignSelf: 'center', verticalAlign: 'middle' }}>
      <Image src={images.rust.replace('/', '')} width="20vw"/>
    </div>
  )
}

const slides = () => {
  return [
    slideRustZoom([
      title('today', false, 4)
    ]),
    slideZoom([
      titleNoCaps('Rust Linz, Jan 25 2024', false, 8),
      logo(),
      title('Object Oriented'),
      title('Programming'),
      title('and Rust'),
      titleNoCaps('Massimiliano Mantione (@M_a_s_s_i)', false, 8)
    ]),

    slide([
      title('Why This Talk'),
      line('I literally grew up with OOP'),
      line('I actually liked it'),
      lineBold('then I decided to unlearn it'),
      line('this talk explains the journey'),
      lineEm('(which eventually took me to Rust)')
    ]),
    slideZoom([
      title('Things I worked on'),
      line('large embedded systems'),
      line('JIT compilers (Mono, V8 in Google)'),
      line('game engines (Unity 3D)'),
      line('collaborative virtual reality'),
      line('distributed systems'),
      line('blockchains'),
      lineBold('now operational research and logistics')
    ]),
    slide([
      title('Along this journey...'),
      line('I started with C++, then Java, C#...'),
      lineBold('I was always thinking in terms of classes'),
      lineEm('...I explored TypeScript, Clojure, Haskell...'),
      lineEm('...Ocaml, Go, Erlang...'),
      lineEm('(now Rust full-time)'),
      lineBold('It took me decades to think differently!')
    ]),

    slideZoom([
      title('OK, but Why?'),
      lineBold('why did I decide to unlearn OOP?'),
      lineEm('is OOP fundamentally bad?'),
      line('no, it\'s not'),
      lineBold('the principles are S.O.L.I.D.')
    ]),
    slide([
      title('S.O.L.I.D.', false, 2),
      lineEm('Robert C. Martin (Uncle Bob) ~2003'),
      line('S – Single-responsiblity principle'),
      line('O – Open-closed principle'),
      line('L – Liskov substitution principle'),
      line('I – Interface segregation principle'),
      line('D – Dependency Inversion Principle')
    ]),

    slide([
      title('OOP principles are OK'),
      lineBold('What\'s wrong then?')
    ]),
    slide([
      title('What does Object Oriented mean?'),
      line('Principles'),
      line('Practices'),
      line('Technologies'),
      lineEm('We usually get them backwards!')
    ]),

    slide([
      title('Object Oriented Technologies'),
      line('programming languages'),
      line('development environments'),
      line('tools and frameworks'),
      lineEm('(object relational mappers)'),
      lineEm('(dependency injection frameworks)')
    ]),

    slide([
      title('How do we write'),
      title('OO code?')
    ]),

    slide([
      title('We are not critical'),
      line('We take technical features'),
      lineBold('and just use them'),
      lineEm('if a feature is there...'),
      lineEm('...it must be for our own good, right?')
    ]),

    slide([
      title('The Core issue'),
      line('mainstream OOP languages and technologies'),
      lineBold('encourage bad practices'),
      lineBold('which go against the good principles'),
      lineEm('(IMHO, Rust is doing better in this field)')
    ]),

    slide([
      title('Problematic'),
      title('Object Oriented Practices'),
      line('Jungle of Dependencies'),
      line('Abstraction through Inheritance'),
      line('Abuse of Virtual Methods'),
      line('The "new" operator'),
      line('Leaking references to internal state'),
      lineBold('Pervasive Mutability')
    ]),

    slideZoom([
      title('Dependencies'),
      quoteImage('You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.', 'Joe Armstrong', images.joe)
    ]),

    slide([
      title('How does'),
      title('this', false, 4),
      title('happen?')
    ]),


    slide([
      title('You start with a small class'),
      codeBlock(`class Person {
  propA: string
  propB: string
  propC: string
}`)
    ]),

    slide([
      title('It gets too large'),
      codeBlock(`class Person {
  propA: string
  propB: string
  // ...
  propZ: string
}`)
    ]),

    slide([
      title('You break it up'),
      lineBold('But each helper class needs references to the others!')
    ]),

    slide([
      title('Person becomes...'),
      codeBlock(`class Person {
  aspectA: PersonAspectA
  aspectB: PersonAspectB
  aspectC: PersonAspectC
}`)
    ]),

    slide([
      title('Each helper class is...'),
      codeBlock(`class PersonAspectX {
  // Needed becuse aspect X
  // depends on Person :-/
  person: Person
  // Needed becuse aspect X
  // depends on aspect Z :-/
  aspectZ: PersonAspectZ
  propA: string
  propB: string
}`)
    ]),

    slide([
      title('The Dilemma'),
      lineBold('large classes'),
      line('are bad because of implicit internal dependencies'),
      lineBold('small classes'),
      line('introduce more references to other classes, which cause more dependencies'),
      lineBold('truly independent classes'),
      lineEm('are harder to design!')
    ]),

    slide([
      title('Now you see how'),
      lineEm('...a banana...'),
      lineEm('...requires a gorilla...'),
      lineEm('...that requires a jungle...')
    ]),

    slideRustZoom([
      title('How Rust'),
      title('is Different')
    ]),

    slideRust([
      title('Object References'),
      lineEm('especially references to mutable objects'),
      lineBold('are hard in Rust'),
      line('they are especially hard to store inside objects'),
      lineEm('mutual references are exceptionally hard'),
      lineBold('dependencies are caused by references'),
      lineEm('making reference downsides explicit'),
      lineEm('encourages independent components')
    ]),

    slideZoom([
      title('Inheritance'),
      title('and', false, 4),
      title('Virtual Methods')
    ]),

    slide([
      title('Inheritance'),
      line('mixes'),
      lineBold('implementation inheritance'),
      lineEm('with'),
      lineBold('interface inheritance')
    ]),

    slide([
      title('Virtual Methods'),
      line('...are an even bigger problem!'),
      lineEm('they mix'),
      lineBold('state definition'),
      lineEm('with'),
      lineBold('execution control flow')
    ]),

    slide([
      title('Example: Person'),
      line('Youngsters and Elders choose gifts differently'),
      lineBold('in typical OO style, we model age classes with classes'),
      lineEm('then we model age-related behaviour with'),
      lineBold('Virtual Methods')
    ]),

    slide([
      title('Abstract Class'),
      codeBlock(`abstract class Person {
  abstract chooseGifts(): Array<Gift>
}`)
    ]),



    slide([
      title('Concrete Class'),
      codeBlock(`class Youngster extends Person {
  chooseGifts(): Array<Gift> {
    return ['Spotify subscription'];
  }
}`)
    ]),

    slide([
      title('The Other Concrete Class'),
      codeBlock(`class Elder extends Person {
  chooseGifts(): Array<Gift> {
    return ['Financial Times subscription'];
  }
}`)
    ]),

    slide([
      title('Neat Code!'),
      codeBlock(`let p : Person = pickPerson();
// No need to know age :-)
let gifts = p.chooseGifts();`)
    ]),

    slide([
      title('Now Tell Me'),
      line('what must happen if somebody'),
      lineEm('(while the program is running)'),
      line({ caps: true, fit: true }, 'changes age?')
    ]),

    slide([
      title('We wanted clean code'),
      line('What we got'),
      line('is code hard to use'),
      line('when requirements change'),
      lineEm('unpredictably')
    ]),

    slideRustZoom([
      title('How Rust'),
      title('is Different')
    ]),

    slide([
      title('A Step Back'),
      lineBold('Who invented OOP?'),
      lineEm('Well...')
    ]),

    slide([
      quoteImage('Actually I made up the term "object-oriented", and I can tell you I did not have C++ in mind.', 'Alan Kay', images.alan),
      lineEm('What did he have in mind?')
    ]),

    slide([
      title('Ahead of His Time'),
      line('Alan Kay envisioned objects like cells'),
      line('Isolated and Autonomous'),
      line('No way to "get into" each other'),
      line('Communicate through message passing')
    ]),

    slideRust([
      title('Inheritance in Rust'),
      line('is only for pure interfaces'),
      lineEm('(traits)'),
      lineBold('a type (a struct)'),
      line('cannot inherit'),
      lineBold('properties that hold state'),
      lineEm('(it can only contain them)')
    ]),

    slideRust([
      title('Virtual Dispatch in Rust'),
      codeBlock('Box::new(my_value) as Box<dyn MyTrait>'),
      line('produces a true opaque reference'),
      line('it does not expose its internal state'),
      lineEm('it is impossible to mix'),
      lineBold('a data structure definition'),
      lineEm('with'),
      lineBold('virtual method definitions'),
      line('Box<dyn MyTrait> is really an OBJECT'),
    ]),

    slideZoom([
      title('The "new" operator'),
      line('Every piece of state must be created invoking the appropriate constructor'),
      line('Transmitting state to other environments requires serialization'),
      line('Recreating state requires deserialization'),
      lineEm('(picking the right constructor to invoke is always tricky)'),
      line('Changing "class" to a piece of data is cumbersome')
    ]),

    slideRustZoom([
      title('How Rust'),
      title('is Different'),
      line('no "new" operator'),
      line('any function can return a new value'),
      line('no compiler magic in creating new values'),
      lineEm('(of course "dyn trait" is different)')
    ]),

    slideZoom([
      title('PERVASIVE'),
      title('REFERENCES'),
      title('and', false, 4),
      title('MUTABILITY')
    ]),

    slide([
      title('OO, Java Style'),
      line('Model state with classes'),
      line('Store mutable state in objects'),
      line('Take mutable state for granted'),
      lineBold('Objects are Places'),
      lineEm('holding'),
      lineBold('MUTABLE STATE'),
    ]),

    slide([
      quoteImage('[OOP] ...is actually Place Oriented Programming', 'Rich Hickey', images.rich),
      titleNoCaps('(creator of Clojure)', false, 10)
    ]),

    slide([
      title('It was About Time!'),
      lineEm('Why does Rich Hickey'),
      lineEm('insist so much on immutability?'),
      lineBold('because reasoning about values'),
      lineEm('changing over time'),
      lineBold('is very hard!')
    ]),

    slide([
      title('Another basic assumption'),
      title('of mainstream OOP languages'),
      lineEm('everything happens'),
      lineBold('on a global timeline'),
      line('method calls'),
      line('argument passing'),
      line('object creation'),
      line('assignments'),
      lineBold('time and mutability mix badly'),
    ]),

    slideRustZoom([
      title('How Rust'),
      title('is Different')
    ]),

    slideRust([
      title('Mutable State'),
      line('...is allowed in Rust...'),
      lineEm('but'),
      lineBold('it is not the default'),
      lineEm('and the borrow checker'),
      lineEm('steers you out of it')
    ]),

    slide([
      title('OOP', false, 1),
      title('vs', false, 8),
      title('FP', false, 1)
    ]),


    slide([
      title('Functional Approach'),
      line('Model state with plain data structures'),
      lineEm('(preferably immutable)'),
      line('Write every "method" as a function'),
      lineEm('(possibly pure)')
    ]),

    slide([
      title('Functional Approach'),
      line('Dependencies are minimal'),
      line('Control flow becomes explicit'),
      line('[de]serialization becomes trivial'),
      line('Testing is a breeze')
    ]),

    slide([
      title('Let\'s compare OO and FP'),
      quoteImage('OO makes code understandable by encapsulating moving parts. FP makes code understandable by minimizing moving parts.', 'Michael Feathers', images.michael),
      lineEm('Working Effectively with Legacy Code (Prentice Hall, 2004)')
    ]),

    slideRust([
      title('The real solution'),
      lineBold('Functional in the small'),
      lineBold('OO in the large')
    ]),

    slideRust([
      title('In the Small'),
      lineEm('if a computation should happen instantly'),
      lineBold('usually inside an isolated component'),
      lineBold('with stateless dependencies'),
      line('implement it in functional style'),
      line('using immutable values'),
      line('and pure functions')
    ]),

    slideRust([
      title('In the Large'),
      lineEm('if several tasks interact during time'),
      lineBold('each task has its own state'),
      lineBold('event ordering can be cahotic'),
      line('go for the actor model'),
      line('isolate each task in its own actor'),
      line('make them exchange messages through channels'),
      lineEm('async Rust shines at this')
    ]),

    slideRust([
      title('Object Orientation'),
      lineEm('taking inspirations from'),
      lineEm('Erlang and Smalltalk'),
      lineBold('each object is an actor'),
      line('with its own private state'),
      line('they only interact through messages'),
      lineEm('events can induce state changes, but'),
      lineBold('internal changes are purely functional')
    ]),

    slide([
      title('Historical Considerations'),
      lineEm('Why did we get C++?'),
      line('In the \'80 computers were not so powerful'),
      line('Proper OO requires totally decoupled "objects"'),
      line('Think of them as independent, isolated processes'),
      line('We were not ready to accept that')
    ]),

    slide([
      title('Historical Considerations'),
      lineEm('Obsession with performance'),
      line('C++ promised "zero cost abstractions"'),
      line('C++ property accesses and virtual method calls'),
      line('cost 1 single machine instruction'),
      lineEm('no dynamic system could compete with that')
    ]),


    slide([
      title('TAKEAWAY'),
      lineBold('Be critical with the language you use'),
      line('If it has a feature, by default don\'t use it'),
      line('Use it only when you see that it makes your code better'),
      lineEm('and you see it does not cause problems!')
    ]),
    slide([
      title('TAKEAWAY'),
      lineBold('Learn lots of other languages'),
      lineEm('it will help you to think differently'),
      line('Closure, Erlang'),
      line('Go, Swift, Rust'),
      line('Reason, Haskell')
    ]),
    slide([
      title('TAKEAWAY'),
      lineBold('Apply the lessons you learned'),
      lineEm('even if you will not change language!')
    ]),

    slideRustZoom([
      title('That\'s all...', false, 5),
      title('Questions?')
    ]),
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

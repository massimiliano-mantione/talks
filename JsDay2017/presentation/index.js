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
  city: require('../assets/city.jpg'),
  kat: require('../assets/kat.png'),
  logo: require('../assets/formidable-logo.svg'),
  markdown: require('../assets/markdown.png')
}

preloader(images)

const theme = createTheme({
  primary: 'white',
  secondary: '#1F2022',
  tertiary: '#03A9FC',
  quartenary: '#CECECE'
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
const title = (text, p1, p2) => {
  let fit = true
  let size = 2
  for (const p of [p1, p2]) {
    if (typeof p === 'boolean') {
      fit = p
    } else if (typeof p === 'number') {
      size = p
    }
  }
  return <Heading size={size} fit={fit} caps lineHeight={1} textColor="primary">{text}</Heading>
}
const line = (props, children) => {
  if (typeof (props) !== 'object') {
    children = props
    props = {}
  }
  const p = {
    italic: false,
    bold: false,
    size: 5,
    textColor: 'primary'
  }
  Object.assign(p, props)
  return (<Appear>
    <Text italic={p.italic}
      bold={p.bold}
      textSize={p.textSize}
      size={p.size}
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
      <Image src={image.replace('/', '')} width="15vw"/>
    </Fit>
    <Fill>
      {quote(text, cite)}
    </Fill>
  </Layout>)
}

const codeBlock = (text) => {
  return line(text)
}

const slides = () => {
  return [
    slideZoom([
      title('The danger'),
      title('of', false, 4),
      title('object oriented designs')
    ]),
    slideZoom([
      title('START'),
      line('starting')
    ]),
    slide([
      title('Strange talk title'),
      lineBold('Why danger?'),
      line('What\'s wrong with Object Oriented software?'),
      lineEm('(or languages)')
    ]),

    slide([
      title('Think About Object Oriented'),
      line('What Comes to Mind?'),
      line('Classes, like in C++, Java, C#'),
      line('Class hierarchies'),
      line('Maybe UML graphs?'),
      line('Architectural design patterns?')
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
      line('Mostly programming languages'),
      line('Then, Tools and Frameworks'),
      line('IDEs and Refactoring Tools'),
      line('Object Relational Mappers'),
      line('Dependency Injection Frameworks'),
      line('Serialization Frameworks')
    ]),

    slide([
      title('Object Oriented Practices'),
      line('Abstraction and Inheritance'),
      line('Use of Virtual Methods'),
      line('Hide internal mutable state...'),
      line('(Encapsulation - Information Hiding)'),
      lineBold('...but use direct object references!')
    ]),

    slide([
      title('A Step Back'),
      lineBold('Who invented this?'),
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

    slide([
      title('OO, C++ Style'),
      line('Model state with classes'),
      line('Store mutable state in objects'),
      line('Take mutable state for granted'),
      lineBold('OOP -> POP'),
      lineEm('(Place Oriented Programming)')
    ]),

    slide([
      title('More OO C++ Style'),
      lineBold('Object References!'),
      line('Store them inside other objects'),
      line('Pass them as method arguments'),
      line('Keep them in local variables')
    ]),

    slide([
      title('Another basic assumption'),
      lineEm('Everything is synchronous by default'),
      line('Method calls'),
      line('Argument passing'),
      line('Object creation')
    ]),

    slide([
      title('So What?'),
      line('All the above are common practices'),
      line('What\'s the problem?')
    ]),

    slide([
      title('Three Major Issues'),
      line('Dependencies'),
      lineEm('(dependency injection)'),
      line('Code bound to objects'),
      lineEm('(reusability through inheritance)'),
      line('The new operator'),
      lineEm('([de]serialization)')
    ]),

    slide([
      title('Dependencies'),
      quoteImage('You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.', 'Joe Armstrong', images.joe)
    ]),

    slide([
      title('The full quote'),
      quoteImage('I think the lack of reusability comes in object-oriented languages, not functional languages. Because the problem with object-oriented languages is they’ve got all this implicit environment that they carry around with them. You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.', 'Joe Armstrong', images.joe)
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
      lineBold('But each aspect needs references to the others!')
    ]),

    slide([
      title('Each aspect is...'),
      codeBlock(`class PersonAspectX {
  // Needed becuse aspect X
  // depends on Person :-/
  person: Person
  propA: string
  propB: string
}`)
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
      title('Now you see...'),
      quoteImage('You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.', 'Joe Armstrong', images.joe)
    ]),

    slide([
      title('Code reuse'),
      line('Methods are bound to classes'),
      line('Reuse requires inheritance'),
      lineEm('Mixins can help, but...'),
      lineEm('...methods become bound to mixins!'),
      lineBold('In general, reusing a method on a different class is hard')
    ]),

    slide([
      title('Virtual Methods'),
      lineEm('...are an even bigger problem!'),
      lineBold('They mix state definition with execution control flow')
    ]),

    slide([
      title('Example: Person'),
      line('Men and Women choose gifts differently'),
      line('In typical OO style, we model this with'),
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
      codeBlock(`class Man extends Person {
  chooseGifts(): Array<Gift> {
    return ['sexy underwear'];
  }
}`)
    ]),

    slide([
      title('The Other Concrete Class'),
      codeBlock(`class Woman extends Person {
  chooseGifts(): Array<Gift> {
    return ['romantic book'];
  }
}`)
    ]),

    slide([
      title('Neat Code'),
      codeBlock(`let p : Person = pickPerson();
// No need to know gender :-)
let gifts = p.chooseGifts();`)
    ]),

    slide([
      title('Now Tell Me...'),
      line('...what happens if somebody'),
      lineEm('(while the program is running)'),
      lineBold('changes sex?')
    ]),

    slide([
      title('We wanted clean code'),
      line('What we got'),
      line('is code hard to change'),
      line('when requirements change'),
      lineEm('unpredictably')
    ]),

    slide([
      title('The new operator'),
      line('Every piece of state must be created invoking the appropriate constructor'),
      line('Transmitting state to other environments requires serialization'),
      line('Recreating state requires deserialization'),
      lineEm('(picking the right constructor to invoke is always tricky)')
    ]),

    slide([
      title('Can we do better?'),
      lineEm('Yes, we can'),
      lineBold('Just don\'t use classes top model state!')
    ]),

    slide([
      title('I was kidding :-)'),
      lineEm('but not do much'),
      line('what I mean was'),
      lineBold('Apply Functional Programming'),
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
      title('Is OO fundamentally bad?'),
      lineBold('No, it\'s not'),
      lineEm('The principles are S.O.L.I.D.')
    ]),

    slide([
      title('S.O.L.I.D.'),
      lineEm('Robert C. Martin (Uncle Bob) ~2003'),
      line('S – Single-responsiblity principle'),
      line('O – Open-closed principle'),
      line('L – Liskov substitution principle'),
      line('I – Interface segregation principle'),
      line('D – Dependency Inversion Principle')
    ]),

    slide([
      title('Than, what\'s bad?'),
      line('Our practices are wrong'),
      line('Mainstream OO languages are particularly misleading'),
      line('Alan Kay said he did not have C++ in mind')
    ]),

    slide([
      title('Why did we get C++?'),
      line('In the \'80 computers were not so powerful'),
      line('Proper OO requires totally decoupled "objects"'),
      line('Think of them as independent, isolated processes'),
      line('We were not ready to accept that')
    ]),

    slide([
      title('Obsession with performance'),
      line('C++ promised "zero cost abstractions"'),
      line('Property access and virtual method call...'),
      line('...cost 1 single machine instruction cost (x86)'),
      lineEm('No dynamic system can compete with that')
    ]),

    slide([
      title('Let\'s compare OO and FP'),
      quoteImage('OO makes code understandable by encapsulating moving parts. FP makes code understandable by minimizing moving parts.', 'Michael Feathers', images.michael),
      lineEm('Working Effectively with Legacy Code (Prentice Hall, 2004)')
    ]),

    slide([
      title('The real solution'),
      line('Functional in the small'),
      line('OO in the large')
    ]),

    slide([
      title('Javascript OO systems'),
      line('A pipeline of Observables'),
      line('CSP in Javascript (when used like Erlang actors)'),
      line('The separation of state, side effects and render in Redux'),
    ]),

    slide([
      title('Larger OO systems'),
      line('The Seneca framework'),
      line('More generally, a web of microservices'),
      lineEm('Let\'s learn from Erlang...')
    ]),

    slideZoom([
      title('Done'),
      title('and', false, 4),
      title('thank you')
    ])
  ]
}

export default class Presentation extends React.Component {
  render () {
    return (
      <Deck transition={['zoom', 'slide']} transitionDuration={500} theme={theme}>
        {slides()}
      </Deck>
    )
  }
}

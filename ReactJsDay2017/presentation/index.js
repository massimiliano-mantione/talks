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
  react: require('../assets/react-logo.svg'),
  preact: require('../assets/preact-logo.png'),
  inferno: require('../assets/infernojs-logo.png'),
  richHarris: require('../assets/rich-harris.jpg'),
  danAbramov: require('../assets/dan-abramov.jpg')
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
  return <Image src={images.react.replace('/', '')} width="20vw"/>
}
const preactLogo = () => {
  return <Image src={images.preact.replace('/', '')} width="20vw"/>
}
const infernoLogo = () => {
  return <Image src={images.inferno.replace('/', '')} width="20vw"/>
}
const talkQrCode = () => {
  return <Image src={images.react.replace('/', '')} width="20vw"/>
}

const slides = () => {
  return [
    slideZoom([
      logo(),
      titleNoCaps('Verona, Oct 6 2017', false, 6),
      title('If it quacks like React', false, 4),
      title('and renders like React', false, 4),
      title('is it React?', false, 3),
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
      title('Strange talk title'),
      lineEm('What should quack like react?'),
      line('We are talking about React.js alternatives'),
      line('Specifically, API-compatible implementations'),
      lineBold('Yes, there are such things!')
    ]),
    slide([
      title('To make it clear'),
      line('We are not talking about different UI frameworks'),
      lineEm('(Angular, Ember, Polymer, Knockout...)'),
      line('And neither react-like virtual-DOM-based frameworks'),
      lineEm('(Cycle, Vue, Riot, Ractive, Mithril, Maquette...)')
    ]),
    
    slide([
      title('Actual focus of this talk'),
      line('Preact'),
      lineEm('(maybe react-lite)'),
      line('Inferno'),
      lineBold('React-fiber!')
    ]),
    slide([
      title('Why these alternatives?'),
      line('Mostly, React is big'),
      line('While relatively fast, it can be relatively slow'),
      lineEm('The community likes experimenting!')
    ]),

    slideZoom([
      preactLogo(),
      title('Preact')
    ]),
    slide([
      title('Preact', false),
      line('Mostly focused on size'),
      lineEm('(3.4 Kb core + 3.6Kb compat vs 47.4 Kb)'),
      line('Clean and understandable code'),
      lineEm('(can be understood in one evening)'),
      line('Also focused on speed')
    ]),
    slide([
      title('Lean', false),
      line('Closer to the DOM'),
      line('Reconciler diffs against the DOM'),
      line('Uses the DOM event handlers'),
      line('Avoids "reinventing the web"'),
      line('Plays nice with other code')
    ]),
    slide([
      title('Easy to Use', false),
      line('props, state and context are passed to render()'),
      line('Use standard HTML attributes like class and for'),
      line('Works with React DevTools out of the box'),
    ]),
    slide([
      title('What\'s Missing?'),
      lineBold('PropType Validation'),
      lineEm('(supported in preact-compat)'),
      lineBold('React.Children'),
      lineEm('(supported in preact-compat)'),
      lineEm('plus, props.children is always an Array'),
      lineBold('Synthetic Events'),
      lineEm('(unneeded extra overhead)'),
    ]),
    slide([
      title('What\'s Different?'),
      line('render() has a third argument: the root node to replace'),
      lineEm('(otherwise it appends)'),
      line('No contextTypes and childContextTypes'),
      lineEm('(children receive context entries from getChildContext)')
    ]),
    slide([
      title('Used in Production'),
      line('Uber, Lyft, New York Times, Pepsi, Finantial times...'),
      line('several ecommerce sites...'),
      line('...and many others!'),
      lineBold('Mostly wherever the size difference matters'),
      lineEm('(often for mobile)')
    ]),

    slideZoom([
      infernoLogo(),
      title('Inferno')
    ]),
    slide([
      title('Inferno', false),
      line('Also smaller than React'),
      lineEm('(9.1 Kb core + 8.3Kb compat vs 47.4 Kb)'),
      line('Very clean and modular code'),
      lineBold('Its focus is different...')
    ]),
    slide([
      title('SPEED'),
      line('I mean real speed'),
      line('Written to be fast'),
      line('Focused on performance'),
      lineEm('besides...'),
      lineBold('...did I mention SPEED?')
    ]),
    slide([
      title('How Did He Do It?'),
      lineEm('(I mean Dominic Gannaway)'),
      line('Persistency and Cleverness'),
      line('Good knowledge of JS VMs'),
      line('Scientific application of this knowledge'),
      lineBold('try, experiment, measure, retry')
    ]),
    slide([
      title('Inferno vs React'),
      line('Smaller and faster'),
      line('Partial system of syntethic events'),
      line('No string refs (supported in inferno-compat)'),
      line('Same dev tools (with inferno-devtools)'),
      lineBold('Lifecycle events on functional components!')
    ]),
    slide([
      title('Inferno vs Preact'),
      line('Larger but faster'),
      line('Diffs against the virtual DOM'),
      line('Synthetic events also help performance'),
      line('Supports controlled components'),
      lineEm('Lifecycle events on functional components')
    ]),
    slide([
      title('Inferno is Faster'),
      lineBold('...but...'),
      lineBold('HOW MUCH FASTER?')
    ]),
    slide([
      title('Measuring Performance'),
      lineEm('Three kind of lies'),
      line('Lies'),
      line('Damn Lies'),
      lineBold('And then there\'s Benchmarks')
    ]),
    slide([
      title('Benchmarks are not Lies'),
      line('Its just that they are unlikely to measure what is relevant to your case'),
      lineEm('You should measure performance in your application'),
      lineBold('That said, Inferno does win benchmarks'),
      // lineEm({size: 3}, 'http://www.stefankrause.net/js-frameworks-benchmark6/webdriver-ts-results/table.html')
    ]),
    slide([
      title('Svelte Creator'),
      quoteImage('It\'s competitive with Inferno, which is probably the fastest UI framework in the world, for now, because Dominic Gannaway is a wizard', 'Rich Harris', images.richHarris),
      lineEm('(BTW: Facebook hired Dominic!)')
    ]),
    slide([
      title('And Now Something'),
      line({caps: true, fit: true, bold: true}, 'Completely Different'),
      line({caps: true, fit: true, bold: true}, 'Yet Another API-compatible'),
      line({caps: true, fit: true, bold: true}, 'React reimplementation')
    ]),
    slide([
      title('React'),
      line({caps: true, fit: true, bold: true}, 'Itself')
    ]),
    slide([
      title('This reimplementation'),
      lineEm('is called'),
      line({caps: true, fit: true, bold: true}, 'React 16')
    ]),
    slide([
      title('What happened?'),
      line('Also Facebook was not fully happy with React'),
      line('They went for a core rewrite'),
      lineBold('Sensibly, they put API compatibility as a top priority'),
      lineEm('(nobody likes breaking working applications)')
    ]),
    slide([
      title('What was Wrong'),
      line({caps: true, fit: true, bold: true}, 'with React'),
      line({caps: true, fit: true, bold: true}, 'for Facebook?')
    ]),
    slide([
      title('Neither size nor raw speed'),
      line('Inferno is faster, but not orders of magnitude faster'),
      lineEm('...but...'),
      lineBold('What if you application became orders of magnitudes more complex?')
    ]),
    slide([
      title('Rendering and Reconciling'),
      line('Take a time proportional to the size of your DOM tree'),
      line('In React 15 they are synchronous operations'),
      lineBold('What if they took more than one frame?'),
      lineEm('Let\'s see a synthetic benchmark')
    ]),
    slide([
      title('The solution'),
      lineBold('Make reconciliation asynchronous')
    ]),
    slide([
      title('Async Reconciliation'),
      line('Each "atomic batch" that updates the DOM runs in a "fiber"'),
      line('React has a "scheduler" that can run fibers one at a time'),
      line('Rendering the whole Virtual DOM can span several frames')
    ]),
    slide([
      title('Async Reconciliation'),
      line('Applying a batch of rendering means reconciling its virtual DOM section with the real DOM'),
      line('The commit of each batch is atomic (it must be)...'),
      lineBold('...but the whole process is not!'),
      lineEm('Let\'s see')
    ]),
    slide([
      title('This is still experimental'),
      line('React 16 uses the fiber-based reconciler'),
      line('but'),
      lineBold('the async reconciliation is disabled by default'),
      lineEm('(React 16 focuses on fibers causing no regressions)')
    ]),
    slide([
      title('Are Preact and Inferno useful?'),
      quoteImage('Success of Preact and Inferno = success of React. Different constraints and features but knowledge almost entirely transferable.', 'Dan Abramov', images.danAbramov),
    ]),
    slide([
      title('Do you need them?'),
      lineEm('...well...'),
      lineBold('Do you have a problem with React?')
    ]),
    slide([
      title('How do you know?'),
      line({caps: true, fit: true, bold: true}, 'Measure!'),
      line('load time (bundle size)'),
      line('render performance')
    ]),
    slide([
      title('Trying Preact or Inferno'),
      codeBlock(`resolve.alias = {
  "react": "preact-compat",
  "react-dom": "preact-compat"
}`),
      line('just put this in WebPack config'),
      lineEm('if you are shy about it...')
    ]),

    slide([
      title('A final thought', false, 2),
      lineEm('If frameworks were vehicles...'),
      lineEm('...and React 15 were a car...'),
      line('Preact would be a motorbike'),
      line('Inferno would be a racing car'),
      line('React fiber would likely be a large bus with the speed and agility of a sports car'),
      lineBold('Pick according to your needs!')
    ]),

    slideZoom([
      title('That\'s all...', false, 5),
      lineEm('Thanks, and...'),
      line({caps: true, fit: true, bold: true}, 'Questions?')
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

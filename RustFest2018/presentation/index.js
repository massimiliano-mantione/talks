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
  logo: require('../assets/RustFestLogo.svg'),
  team: require('../assets/polonia2018.jpg')
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
  return <Image src={images.logo.replace('/', '')} width="10vw"/>
}
const team = () => {
  return <Image src={images.team.replace('/', '')} width="60vw"/>
}
const video = (file, width) => {
  return <video src={'assets/' + file} width={width} autoPlay="true" loop="true"/>
}

const slides = () => {
  return [
    slideZoom([
      logo(),
      titleNoCaps('Rome, November 24 2018', false, 6),
      title('Fun with', false, 4),
      title('Rusty Robots', false, 3),
      titleNoCaps('Massimiliano Mantione', false, 6),
      titleNoCaps('@M_a_s_s_i', false, 6)
    ]),

    slideZoom([
      title('Things I worked on'),
      line('The Mono JIT Compiler'),
      line('The Unity Game Engine'),
      line('The V8 Team in Google'),
      lineBold('Now CTO and Full Stack developer at Hyperfair'),
      lineEm('(Virtual Reality on the Web)')
    ]),

    slide([
      title('Talk Roadmap'),
      line('A story (my path to Rust on robots)'),
      line('A couple of examples'),
      line('What\'s special about Rust on Robots')
    ]),

    slide([
      title('Me and Rust'),
      line('I liked its concepts, but I lacked time'),
      line('I feared the leaning curve'),
      lineEm('(borrow checker)'),
      lineBold('So I just watched it from a distance')
    ]),

    slide([
      title('Me and Robots'),
      line('I liked the idea, but I lacked time'),
      line('Then we sow a Lego Sumo event'),
      lineEm('(me and my son, he was 12)'),
      lineBold('It was love at first sight!'),
      line('We started building one...')
    ]),

    slide([
      title('Some perspective'),
      line('Hobby projects, mostly Lego'),
      lineEm('For competitions'),
      lineBold('Sumo'),
      lineBold('Line Follower')
    ]),

    slide([
      title('Sumo', false),
      video('sumo.mp4', '800px')
    ]),

    slide([
      title('Line Follower', false),
      video('line-follower.mp4', '300px')
    ]),

    slide([
      title('We are a team!'),
      team()
    ]),

    slide([
      title('Our First Lego Robot'),
      line('Opereting system: Ev3Dev'),
      line('First language: nodejs'),
      line('Next one: python'),
      line('Let\'s go faster: golang')
    ]),

    slide([
      title('Let there be latency'),
      line('...and there was latency'),
      lineEm('Doing things takes time'),
      lineEm('This can be significant'),
      lineBold('Our robots did not react in time')
    ]),

    slide([
      title('Latency test'),
      video('Latency-tester.mp4', "800px"),
      lineBold('We got 50ms latency spikes!')
    ]),

    slide([
      title('Hard Real Time?'),
      lineEm('...is not about performance'),
      line('It is about time-related correctness'),
      lineBold('Predictable latency')
    ]),

    slide([
      title('Real Time Examples'),
      line('Self driving car on a highway'),
      lineEm('[108 Km/h == 30 m/s]'),
      lineBold('100ms is 3m'),
      line('Line follower robot'),
      lineEm('[2 m/s]'),
      lineBold('10ms is 20mm')
    ]),

    slide([
      title('The root of the problem'),
      line('was not the language'),
      lineBold('It was the OS'),
      lineEm('Linux without PREEMPT_RT'),
      lineEm('ARMv5 cache addressing')
    ]),

    slide([
      title('New OS: Ev3RT'),
      line('A small real time kernel'),
      lineBold('Sub ms max latencies!'),
      lineBold('Event loop at 10KHz!'),
      lineEm('Documented in Japanese'),
      lineEm('User code must be written in C'),
      lineEm('My son got sad...')
    ]),

    slide([
      title('Enter Rust'),
      line('An excuse for using Rust'),
      line('It is actually a perfect fit'),
      line('No GC (predictable latency)'),
      line('C ABI interoperability'),
      line('Drop in replacement for C')
    ]),

    slide([
      title('Baby steps'),
      line('Enter no-std land'),
      line('Use ARMv5 target'),
      lineEm('POC: a single rust file, compiled with rustc, replacing a single C object file'),
      lineBold('It works!')
    ]),

    slide([
      title('Integrate with Ev3RT'),
      line('No simple syscall ABI'),
      lineEm('Wrap syscalls with C functions'),
      line('Binary file format is tricky'),
      lineEm('Reuse C SDK linker script'),
      lineBold('Compile my app crate to a static lib used by an Ev3RT C app')
    ]),

    slide([
      title('It started working, but...'),
      line('Linked files became too big'),
      lineEm('Linker GC breaks the build'),
      line('Recompile libcore'),
      lineEm('Use xargo'),
      lineBold('Then cargo xbuild...')
    ]),

    slide([
      title('IT WORKS!')
    ]),

    slide([
      title('Makeblock'),
      line('Next robot: use an available platform'),
      lineBold('MBot (by Makeblock)'),
      line('Arduino inside (ATMega328)'),
      lineEm('Spoiler alert: this story does not have a fully happy ending')
    ]),

    slide([
      title('Rust on AVR'),
      line('A lot of hurdles'),
      line('Must build a Rust fork'),
      lineEm('which uses a forked LLVM'),
      lineBold('The LLVM build failed on my Fedora environment')
    ]),

    slide([
      title('A more stable environment'),
      line('Use an Ubuntu container to build and run the compiler'),
      line('After 4 hours, and 10Gb...'),
      line('After fighting with the libcore build...'),
      lineBold('I have a running hello world')
    ]),

    slide([
      title('A moving target'),
      line('I left it there for a while'),
      line('When I resumed my effort, a one year old repo had a 4 hours old push!'),
      lineEm('The new work looked useful')
    ]),

    slide([
      title('Cathing up'),
      line('Try to use the new code with my old Rust'),
      lineEm('It won\'t work'),
      lineBold('Let\'s rebuild the compiler!')
    ]),

    slide([
      title('Bleeding Edge avr-rust'),
      line('Compiler builds out of the box'),
      line('It can now compile libcore!'),
      lineEm('(but you must build it yourself)'),
      line('I could not get xargo working...'),
      lineEm('(but cargo xbuild was fine)'),
      lineBold('"hello world" runs again!')
    ]),

    slide([
      title('Ecosystem issues'),
      line('Bare-metal instructions work'),
      line('Serials, timers and pins are usable'),
      lineEm('For anything else...'),
    ]),

    slide([
      title('Robot Hardware'),
      line('Simple r/w on pins is easy'),
      line('With timers you get hardware PWM'),
      lineEm('(DC motors and servos)'),
      line('With UARTs (serial, SPI) you can talk to smart devices'),
      lineBold('However...')
    ]),

    slide([
      title('MBot hardware'),
      line('Motors and button are ok'),
      lineEm('(PWM and analog read)'),
      line('Ultrasound easy to do'),
      lineEm('(measure response time on a pin)'),
      lineBold('Anything else is hard')
    ]),

    slide([
      title('BIT Banging!'),
      line('The RGB leds work on a single pin'),
      line('with 800 nanosecond precision pulses'),
      lineEm('mainstream Arduino library:'),
      lineBold('a pile of macros and finely tuned inline assembly'),
      line('The line array is similar')
    ]),

    slide([
      title('Back to Rust'),
      line('Writing this in Rust is feasible'),
      lineEm('(like everything)'),
      line('But it\'s tricky'),
      lineBold('I tried to reuse the C code')
    ]),

    slide([
      title('Mix Rust and Arduino'),
      lineEm('Which should we put inside the other?'),
      line('Arduino sketch linking a Rust library?'),
      line('A Rust program linking the Arduino core?')
    ]),

    slide([
      title('Rust inside Arduino'),
      line('Doable in principle'),
      line('Linking fails because of missing symbols'),
      lineEm('It seems that the a static lib crate is not "compatible" with the Arduino world')
    ]),

    slide([
      title('Arduino inside Rust'),
      line('Create a base Arduino sketch'),
      line('Build it, and note all the artifacts'),
      line('(libcore.a and several object files)'),
      line('Link all of it into the Rust program')
    ]),

    slide([
      title('Fix details'),
      line('Make sure all required symbols are exported'),
      codeBlock(`extern "C" __attribute__((externally_visible, used))`),
      line('Include all needed libraries'),
      lineBold('It works!'),
      lineEm('Until it breaks...')
    ]),

    slide([
      title('My thoughts'),
      lineBold('Rust does work on AVR'),
      line('It is still painful to use'),
      line('The ecosystem is totally missing'),
      line('C integration is useful but tricky'),
      lineEm('Probably mine was just bad timing'),
      lineBold('Let\'s see when it will be merged!')
    ]),

    slide([
      title('Let\'s turn page'),
      line('Until now I have told you stories'),
      lineEm('but...')
    ]),

    slide([
      title('What about Rust?'),
      line('I mean, is Rust helping at all?'),
      lineBold('TL;DR; Yes, it does.'),
      lineEm('Longer answer: it depends on how your robot code is done')
    ]),

    slide([
      title('The Megaloop'),
      lineBold('A big "read -> think -> act" loop'),
      line('Simplest possible approach'),
      lineEm('(it\'s what Arduino encourages)')
    ]),

    slide([
      title('Megaloop expanded'),
      codeBlock(`read() -> Data
think(d: Data, s: State) -> (State, Cmd)
act(Cmd)`)
    ]),

    slide([
      title('More C-Like'),
      codeBlock(`read() -> Data
think(s: &mut State) -> Cmd
act(Cmd)`)
    ]),

    slide([
      title('How it ends up'),
      codeBlock(`read(d: &mut Data)
think(d: &Data, s: &mut State, c: &mut Cmd)
act(c: &mut Cmd)`)
    ]),

    slide([
      title('Object Oriented'),
      codeBlock(`loop {
    let data = reader.read();
    let cmd = state.think(data);
    actuator.act(cmd);
}`)
    ]),

    slide([
      title('Functional Pseudocode'),
      codeBlock(`loop {
    data = read(data);
    (state, cmd) = think(&data, state, cmd);
    cmd = act(cmd);
}`)
    ]),

    slide([
      title('Smile!'),
      line('All these styles are fine'),
      lineEm('The borrow checker...'),
      lineBold('...is helping either way!')
    ]),

    slide([
      title('Rust gives you a choice'),
      lineEm('either'),
      lineBold('Purely functional code that performs as C-like memory sharing code'),
      lineEm('or'),
      lineBold('C-like memory sharing code as safe as purely functional code')
    ]),

    slide([
      title('Realistically'),
      line('think can be complex'),
      lineBold('it must be modularized')
    ]),

    slide([
      title('Think can be'),
      line('a match calling sub-functions'),
      line('a function pointer (part of the state)'),
      line('we can have many sub-loops'),
      lineEm('(maybe macros could help?)')
    ]),

    slide([
      title('Smile!'),
      line('The Rust type system helps'),
      line('State can be an enum'),
      lineEm('with exhaustive pattern matching'),
      lineBold('This is way better than C(++)!')
    ]),

    slide([
      title('Are we done?'),
      line('Not really'),
      line('We still have a single megaloop'),
      lineEm('The response time (latency) is constrained by the loop complexity'),
      lineBold('All the complexity is inside a single function')
    ]),

    slide([
      title('Can we do better?'),
      line('We would need a multitasking system'),
      line('However, this means a scheduler'),
      lineBold('Particularly, a real time scheduler'),
      lineEm('Not "bare-metal" anymore...')
    ]),

    slide([
      title('Enter RTFM'),
      lineEm('Thanks to Jorge Aparicio'),
      line('A hardware scheduler'),
      line('Interrupt driven'),
      line('Sub-microsecond overhead'),
      lineBold('...with fearless concurrency!')
    ]),

    slide([
      title('Remember the mbot?'),
      line('Reading Ultrasound takes time'),
      lineEm('Could we spend that time doing something else?'),
      lineBold('Yes, if we detect the impulse through an interrupt!')
    ]),

    slide([
      title('RTFM magic'),
      line('Uses the Rust type system'),
      lineEm('(and "phantom" markers)'),
      lineBold('to prove that concurrent access to shared resources is safe'),
      line('AFAIK only ARM Cortex-M')
    ]),

    slide([
      title('ARM Cortex-M'),
      line('Is where the real action is'),
      line('You should seriously consider it'),
      line('Rust support is first class'),
      line('You don\'t even need another linker'),
      lineEm('Maybe start with bobbin?')
    ]),

    slide([
      title('What about Linux?'),
      line('Rust support is perfect'),
      line('The development experience is amazing'),
      line('The problem is the real time scheduler'),
      line('Either you use PREEMPT_RT'),
      line('Or stick to soft real time')
    ]),

    slide([
      title('Sum it Up'),
      line('Rust on robots is great'),
      lineEm('It even runs on Lego bricks!'),
      line('The language performs at least as well as C'),
      lineBold('The abstractions you can build are way better!')
    ]),

    slideZoom([
      title('That\'s all...', false, 5),
      lineEm('Thanks, and...'),
      line({ caps: true, fit: true, bold: true }, 'Questions?')
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

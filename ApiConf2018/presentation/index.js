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
  logo: require('../assets/apiconf-logo.png'),
  wlogo: require('../assets/apiconf-logo-white.png')
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
  return <Image src={images.logo.replace('/', '')} width="20vw"/>
}
const wlogo = () => {
  return <Image src={images.wlogo.replace('/', '')} width="20vw"/>
}

const slides = () => {
  return [
    slideZoom([
      wlogo(),
      titleNoCaps('Torino, Jun 21 2018', false, 6),
      title('GraphQL', false, 3),
      title('as an', false, 4),
      title('API Gateway', false, 3),
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
      title('What is GraphQL?'),
      line('From graphql.org'),
      lineBold('A query language for your API'),
      lineEm('Describe your data'),
      lineEm('Ask for what you want'),
      lineEm('Get predictable results')
    ]),

    slide([
      title('Data Description'),
      codeBlock(`type Project {
  name: String
  tagline: String
  contributors: [User]
}`)
    ]),
    slide([
      title('A Simple Query'),
      codeBlock(`{
  project(name: "GraphQL") {
    tagline
  }
}`)
    ]),
    slide([
      title('Query Result'),
      codeBlock(`{
  "project": {
    "tagline": "A query language for APIs"
  }
}`)
    ]),

    slide([
      title('OK, but... Why?'),
      line('Don\'t we already have REST?'),
      lineBold('Representational State Transfer'),
      line('\'State Transfer\' == \'Data Transfer\''),
      lineEm('Isn\'t this enough?')
    ]),

    slide([
      title('REST Issues'),
      line('Overfetching'),
      line('Underfetching'),
      line('Latency'),
      lineEm('(round trips)')
    ]),

    slide([
      title('Exact Fetching'),
      line('[over-under]fetching'),
      lineBold('REST has a fixed, URL-based resource granularity'),
      lineEm('Could use query args, but...')
    ]),

    slide([
      title('Multi-resource fetching'),
      line('Usually through pagination...'),
      line('...on another, "plural" resource...'),
      lineBold('Never on other resources'),
      lineEm('(unless you define custom routes)')
    ]),

    slide([
      title('REST is Getting a Mess'),
      line('Query arguments to limit data transfer'),
      line('Paging "plural" routes for collections'),
      line('Custom routes for aggregations')
    ]),

    slide([
      title('Enter GraphQL'),
      lineBold('One single "resource": the "graph"'),
      line('A query language to explore it'),
      line('A different route for mutations'),
      lineEm('(CQRS-ready!)')
    ]),

    slide([
      title('DEMO TIME')
    ]),

    slide([
      title('Lots of Tooling!'),
      line('Explicit formal API description'),
      line('API metadata (documentation...)'),
      line('Runtime query and result validation'),
      line('Schema stitching'),
      line('Interactive API explorer (GraphiQL)')
    ]),

    slide([
      title('Language support'),
      line('Javascript'),
      line('Python'),
      line('Golang'),
      line('Rust'),
      lineEm('JVM-based, Ruby, whatever...')
    ]),

    slide([
      title('Should you use it?'),
      lineBold('Simple vs Complex API'),
      line('Facebook'),
      line('Github'),
      line('Netflix (Falcor)'),
      lineEm('And you?')
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

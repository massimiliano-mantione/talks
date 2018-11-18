

Torino, Jun 21 2018
GraphQL as an API Gateway
Massimiliano Mantione
@M_a_s_s_i


Who am I?
Software Engineer at Heart
Mostly JIT Compiler Engineer
(V8 @Google, previously Mono)
Now doing Virtual Reality on the Web
(CTO @Hyperfair, Inc)

What is GraphQL?

From graphql.org
A query language for your API
Describe your data
Ask for what you want
Get predictable results


Data Description
type Project {
  name: String
  tagline: String
  contributors: [User]
}

A Simple Query
{
  project(name: "GraphQL") {
    tagline
  }
}

Query Result
{
  "project": {
    "tagline": "A query language for APIs"
  }
}

OK, but... Why?
Don't we already have REST?
Representational State Transfer
'State Transfer' == 'Data Transfer'
Isn't this enough?

REST Issues
Overfetching
Underfetching
Latency
(round trips)

Exact Fetching
[over-under]fetching
REST has a fixed, URL-based resource granularity
Could use query args, but...

Multi-resource fetching
Usually through pagination
...on another, "plural" resource
Never on other resources
(unless you define custom routes)

REST is Getting a Mess
Query arguments to limit data transfer
Paging "plural" routes for collections
Custom routes for aggregations

Enter GraphQL
One single "resource": the "graph"
A query language to explore it
A different route for mutations
(CQRS-ready!)

DEMO TIME

Lots of Tooling!
Explicit formal API description
API metadata (documentation...)
Runtime query and result validation
Schema stitching
Interactive API explorer (GraphiQL)

Language support

Javascript
Python
Golang
Rust
JVM-based, Ruby, whatever


Should you use it?

Simple vs Complex API

Facebook
Github
Netflix (Falcor)
And you?

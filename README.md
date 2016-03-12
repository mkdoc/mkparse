Table of Contents
=================

* [Comment Parser](#comment-parser)
  * [Install](#install)
  * [Usage](#usage)
  * [Comments](#comments)
    * [Block](#block)
  * [API](#api)
    * [load](#load)
    * [parse](#parse)
    * [Collator](#collator)
      * [Options](#options)
    * [Comment](#comment)
      * [Options](#options-1)
    * [Parser](#parser)
      * [Options](#options-2)
      * [Events](#events)
    * [.stringify](#stringify)
    * [Tag](#tag)
      * [rule](#rule)
      * [pattern](#pattern)
      * [optional](#optional)
      * [whitespace](#whitespace)
      * [parse](#parse-1)
    * [Language](#language)
      * [actionscript](#actionscript)
      * [c](#c)
        * [Options](#options-3)
      * [coffeescript](#coffeescript)
      * [conf](#conf)
      * [cpp](#cpp)
        * [Options](#options-4)
      * [css](#css)
      * [erlang](#erlang)
      * [go](#go)
      * [groovy](#groovy)
      * [html](#html)
      * [defaults](#defaults)
        * [Options](#options-5)
      * [#multi](#multi)
        * [Options](#options-6)
      * [#single](#single)
        * [Options](#options-7)
      * [ini](#ini)
        * [Options](#options-8)
      * [jade](#jade)
      * [java](#java)
      * [javascript](#javascript)
      * [markdown](#markdown)
      * [pandoc](#pandoc)
      * [php](#php)
      * [pi](#pi)
      * [properties](#properties)
      * [python](#python)
      * [ruby](#ruby)
        * [Options](#options-9)
      * [scala](#scala)
      * [shell](#shell)
        * [Options](#options-10)
      * [sql](#sql)
        * [Options](#options-11)
      * [toml](#toml)
      * [typescript](#typescript)
      * [vim](#vim)
        * [Options](#options-12)
      * [xml](#xml)
      * [yaml](#yaml)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Lint](#lint)
    * [Clean](#clean)
    * [Readme](#readme)

Comment Parser
==============

[<img src="https://travis-ci.org/tmpfs/cparse.svg?v=2" alt="Build Status">](https://travis-ci.org/tmpfs/cparse)
[<img src="http://img.shields.io/npm/v/cparse.svg?v=2" alt="npm version">](https://npmjs.org/package/cparse)
[<img src="https://coveralls.io/repos/tmpfs/cparse/badge.svg?branch=master&service=github&v=2" alt="Coverage Status">](https://coveralls.io/github/tmpfs/cparse?branch=master).

Fast, streaming and configurable comment parser.

## Install

```
npm i cparse
```

## Usage

Parse a string or buffer:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse('/**Compact comment*/');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Load and parse file contents:

```javascript
var cparse = require('cparse')
  , stream = cparse.load('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Parse and write comment data to file as newline delimited JSON:

```javascript
var cparse = require('cparse')
  , fs = require('fs')
  , stream = cparse.load('index.js').stringify();
stream.pipe(fs.createWriteStream('index-ast.json.log'));
```

Use a language pack:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse(
      '# @file spec.rb', {rules: require('cparse/lang/ruby')});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Combine language pack rules:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse(
      '; ini style comment\n# shell style comment',
      {rules: [require('cparse/lang/ini'), require('cparse/lang/shell')]});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

## Comments

See [EXAMPLE.md](https://github.com/tmpfs/cparse/blob/master/EXAMPLE.md) for input and output, all the following comments resolve to the same description with the default settings:

```javascript
/** Comment description */

/**
 * Comment description
 */

/*************************
 * Comment description   *
 ************************/

// Comment description //

//
// Comment description
//
```

### Block

By default continuous single-line comments are gathered into a single `comment` object. The 
rule is that if the next line does not match whitespace followed by the start of a 
single-line comment then the block is terminated.

Note that inline comments also break the block:

```javascript
// 
// Comment description
// 
var foo; // Separate inline comment
```

Will result in two comments, whilst:

```javascript
// Comment description
// 
// More information.
```

Results in a single comment.

## API

### load

```javascript
load(file[, opts])
```

Load and parse file contents.

The options are passed to the `LineStream`, `Comment` and `Parser`.

Returns the parser stream.

* `file` String path.
* `opts` Object processing options.

### parse

```javascript
parse(buffer[, opts][, cb])
```

Parse a string or buffer.

When a callback function is given it is added as a listener for
the error and finish events on the parser stream.

Returns the parser stream.

* `buffer` String|Buffer input data.
* `opts` Object processing options.
* `cb` Function callback function.

### Collator

```javascript
Collator([opts])
```

Collate comments and source content into a stream.

Allows for writing files that contains only content, only comments or
both content and comments. By default this stream will pass through
comments and content.

To disable content from the stream (comments only) use:

```javascript
{content: false}
```

To disable comments from the stream (source content only) use:

```javascript
{comment: false}
```

When the `buffer` option is set all output is buffered into
the `buffer` property as a `string`, listen for the `finish` event before
attempting to access the buffer contents.

* `opts` Object stream options.

#### Options

* `content` Boolean push content chunks to the stream.
* `comment` Boolean push comment chunks to the stream.
* `buffer` Boolean buffer output.
* `stringify` Boolean convert output to JSON strings.
* `indent` Number number of spaces to indent JSON.

### Comment

```javascript
Comment([opts])
```

Parse comments from an array of lines.

When a comment is parsed an object is pushed to the stream
with an array of `lines`, the `rule` for the comment and the
`start` and `end` line numbers.

When a content block is encountered a string is pushed for inline content
(between comments on a single-line or trailing content),
otherwise an array of lines is pushed.

* `opts` Object stream options.

#### Options

* `rules` Array|Function defines the comment rules.
* `options` Object to pass to the `rules` function.

### Parser

```javascript
Parser([opts])
```

Comment and tag parser, parses comment description and tags.

* `opts` Object stream options.

#### Options

* `tag` Object defines the tag patterns, see [tag](#tag).
* `dotted` Boolean parse dotted names in tags.

#### Events

* `comment` when a comment has been parsed.
* `content` when a content chunk is received.

### .stringify

```javascript
Parser.prototype.stringify(indent, comment)
```

Creates a stream that transforms to newline-delimited JSON, the
created stream is piped from this parser.

Returns the stringify stream.

* `indent` Number the number of spaces to indent the JSON.
* `comment` Boolean only include comment output.

### Tag

Defines the patterns and functions that perform the tag parsing.

Create a custom tag definition if you wanted to use an alternative
syntax or prefer something other than `@` as the tag identifier.

The generic syntax for tags is: `@id {type[=value]} name description`;
everything but the tag `id` is considered optional.

Which when given: `@property {String=tmpfs} [nickname] user` will expand
to a tag object such as:

```javascript
{
id: 'property',
type: 'String',
value: 'tmpfs',
name: 'nickname',
description: 'user',
optional: true
}
```

See the [tag parser](#parser).

#### rule

```javascript
RegExp rule
```

Pattern that collects tag lines.

#### pattern

```javascript
RegExp pattern
```

Pattern that collects tag component parts.

#### optional

```javascript
RegExp optional
```

Pattern that determines optionality.

#### whitespace

```javascript
RegExp whitespace
```

Pattern that determines how to strip leading whitespace from
lines.

By default will match a single space or a tab character once, depending
upon your comment style you should adjust this so that whitespace is
preserved as intended.

#### parse

```javascript
parse(line, tag)
```

Parses the component parts of a tag definition.

This will add the `id`, `type`, `name` and `description`
fields to the input `tag` argument.

* `line` String current line being parsed.
* `tag` Object target for parsed data.

### Language

Collection of language packs.

Default language pack used is the [cpp language](#cpp).

A language rule is an object containing the `open`, `close` and `strip`
functions.

The open and close functions are passed the current line and should
return the `exec` match for the pattern.

The strip function is passed an array of lines for the entire comment and
should remove comment meta characters from all lines.

#### actionscript

```javascript
actionscript([opts])
```

Creates an array of language rules for actionscript files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

#### c

```javascript
c([opts])
```

Creates an array of language rules for C files.

Recognises terminated multi-line comments starting with `/*`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `greedy` Boolean=true disable to use `/**` comments only.

#### coffeescript

```javascript
coffeescript([opts])
```

Creates an array of language rules for coffeescript files.

Recognises continuous blocks of lines beginning with `#` and multi-line
comments delimited with `###`.

Returns list of language rules.

* `opts` Object processing options.

#### conf

```javascript
conf([opts])
```

Creates an array of language rules for conf files.

Recognises continuous blocks of lines beginning with `#`.

See the [shell language](#shell).

Returns list of language rules.

* `opts` Object processing options.

#### cpp

```javascript
cpp([opts])
```

Creates an array of language rules for C++ files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `greedy` Boolean include `/*` comments.

#### css

```javascript
css([opts])
```

Creates an array of language rules for css files.

Recognises terminated multi-line comments starting with `/*`.

See the [c language](#c).

Returns list of language rules.

* `opts` Object processing options.

#### erlang

```javascript
erlang([opts])
```

Creates an array of language rules for erlang files.

Recognises continuous blocks of lines beginning with `%`.

Returns list of language rules.

* `opts` Object processing options.

#### go

```javascript
go([opts])
```

Creates an array of language rules for go files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

#### groovy

```javascript
groovy([opts])
```

Creates an array of language rules for groovy files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

#### html

```javascript
html([opts])
```

Creates an array of language rules for HTML files.

Recognises multi-line comments started with `<!--` and terminated
with `-->`.

Returns list of language rules.

* `opts` Object processing options.

#### defaults

```javascript
defaults([opts])
```

Creates the default language rules for the C family of languages.

By default recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

To include `/*` comments as well set the `greedy` option:

```javascript
{multi: {greedy: true}
```

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `multi` Object multi-line rule configuration.
* `single` Object single-line rule configuration.

#### #multi

```javascript
static multi([opts])
```

Creates a multi-line rule, when no options are given creates the
default C family multi-line rule.

Returns multi-line language rule.

* `opts` Object processing options.

##### Options

* `greedy` Boolean include `/*` comments.
* `start` RegExp comment start pattern.
* `end` RegExp comment end pattern.
* `lead` RegExp remove leading meta characters that match.
* `trail` RegExp remove trailing meta characters that match.
* `open` Function override default open function.
* `close` Function override default close function.
* `strip` Function override default strip function.

#### #single

```javascript
static single([opts])
```

Creates a single-line rule, when no options are given creates the
default C family single-line rule.

Returns single-line language rule.

* `opts` Object processing options.

##### Options

* `mark` RegExp sub pattern.
* `start` RegExp comment start pattern.
* `end` RegExp comment end pattern.
* `lead` RegExp remove leading meta characters that match.
* `trail` RegExp remove trailing meta characters that match.
* `open` Function override default open function.
* `close` Function override default close function.
* `strip` Function override default strip function.

#### ini

```javascript
ini([opts])
```

Creates an array of language rules for ini files.

Recognises continuous blocks of lines beginning with `;`.

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `mark` RegExp sub pattern.
* `trail` RegExp pattern to strip trailing meta characters.

#### jade

```javascript
jade([opts])
```

Creates an array of language rules for jade files.

Recognises continuous blocks starting with `//-` or `//`.

Returns list of language rules.

* `opts` Object processing options.

#### java

```javascript
java([opts])
```

Creates an array of language rules for java files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

#### javascript

```javascript
javascript([opts])
```

Creates an array of language rules for javascript files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

#### markdown

```javascript
markdown([opts])
```

Creates an array of language rules for markdown files.

Recognises multi-line comments started with `<!--` and terminated
with `-->`.

See the [html language](#html).

Returns list of language rules.

* `opts` Object processing options.

#### pandoc

```javascript
pandoc([opts])
```

Creates an array of language rules for pandoc files.

Recognises multi-line comments starting with `<!--` or `<!---` and
terminated with `-->`, extends the [html language](#html).

See the [pandoc website](http://pandoc.org).

Returns list of language rules.

* `opts` Object processing options.

#### php

```javascript
php([opts])
```

Creates an array of language rules for php files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

#### pi

```javascript
pi([opts])
```

Creates an array of language rules for SGML/XML processing instructions.

Recognises multi-line comments started with `<?` and terminated
with `?>`.

Returns list of language rules.

* `opts` Object processing options.

#### properties

```javascript
properties([opts])
```

Creates an array of language rules for Java properties files.

Recognises continuous blocks of lines beginning with `#`.

See the [shell language](#shell).

Returns list of language rules.

* `opts` Object processing options.

#### python

```javascript
python([opts])
```

Creates an array of language rules for python files.

Recognises continuous blocks of lines beginning with `#` and multi-line
comments delimited with `"""`.

Returns list of language rules.

* `opts` Object processing options.

#### ruby

```javascript
ruby([opts])
```

Creates an array of language rules for ruby files.

Recognises continuous blocks of lines beginning with `#`
and `=begin`, `=end` multi-line comments.

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `multi` Object multi-line rule configuration.
* `single` Object single-line rule configuration.

#### scala

```javascript
scala([opts])
```

Creates an array of language rules for scala files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

#### shell

```javascript
shell([opts])
```

Creates an array of language rules for shell files.

Recognises continuous blocks of lines beginning with `#`.

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `mark` RegExp sub pattern.
* `trail` RegExp pattern to strip trailing meta characters.

#### sql

```javascript
sql([opts])
```

Creates an array of language rules for SQL statements.

Recognises terminated multi-line comments started with `/*` and
continuous lines beginning with `--`.

If the `mysql` option is given continuous lines beginning with `#` are
also recognised.

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `include` Boolean mysql specific comment rule.

#### toml

```javascript
toml([opts])
```

Creates an array of language rules for TOML files.

Recognises continuous blocks of lines beginning with `#`.

See the [shell language](#shell).

Returns list of language rules.

* `opts` Object processing options.

#### typescript

```javascript
typescript([opts])
```

Creates an array of language rules for typescript files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

Returns list of language rules.

* `opts` Object processing options.

#### vim

```javascript
vim([opts])
```

Creates an array of language rules for vim files.

Recognises continuous blocks of lines beginning with `"`.

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `mark` RegExp sub pattern.
* `trail` RegExp pattern to strip trailing meta characters.

#### xml

```javascript
xml([opts])
```

Creates an array of language rules for XML files.

Recognises multi-line comments started with `<!--` and terminated
with `-->`.

See the [html language](#html).

Returns list of language rules.

* `opts` Object processing options.

#### yaml

```javascript
yaml([opts])
```

Creates an array of language rules for YAML files.

Recognises continuous blocks of lines beginning with `#`.

See the [shell language](#shell).

Returns list of language rules.

* `opts` Object processing options.

## Developer

### Test

To run the test suite:

```
npm test
```

### Cover

To generate code coverage run:

```
npm run cover
```

### Lint

Run the source tree through [jshint](http://jshint.com) and [jscs](http://jscs.info):

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Readme

To build the readme file from the partial definitions (requires [mdp](https://github.com/tmpfs/mdp)):

```
npm run readme
```

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[jshint]: http://jshint.com
[jscs]: http://jscs.info
[mdp]: https://github.com/tmpfs/mdp

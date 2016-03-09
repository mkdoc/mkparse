Table of Contents
=================

* [Comment Parser](#comment-parser)
  * [Install](#install)
  * [Usage](#usage)
  * [Input](#input)
  * [Output](#output)
  * [API](#api)
    * [load](#load)
    * [parse](#parse)
    * [language](#language)
      * [c](#c)
        * [Options](#options)
      * [#multi](#multi)
        * [Options](#options-1)
      * [#single](#single)
        * [Options](#options-2)
      * [shell](#shell)
        * [Options](#options-3)
    * [Comment](#comment)
    * [Parser](#parser)
      * [.stringify](#stringify)
    * [Tag](#tag)
      * [rule](#rule)
      * [pattern](#pattern)
      * [optional](#optional)
      * [whitespace](#whitespace)
      * [parse](#parse-1)
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
}
```

Load and parse file contents:

```javascript
var cparse = require('cparse')
  , stream = cparse.load('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
}
```

Parse and write comment data to file as newline delimited JSON:

```javascript
var cparse = require('cparse')
  , fs = require('fs')
  , stream = cparse.load('index.js').stringify();
stream.pipe(fs.createWriteStream('index-ast.json.log'));
```

## Input

```javascript
/**Short multi-line comment*/

/*
 *  Comment is ignored, single leading asterisk.
 */

// Single-line comment

// 
// Super fly
//
// @public {function} getNinja super fly stuff.
// @param {Object} [opts] configuration options.
// @returns {Object} a command line ninja.

/**
 * @usage
 *
 * var x = 'y'
 *   , v = 'w';
 */

/**
 *  @object point.x
 *  @object point.x.y.z
 */

function request(url, opts /** @param {Object} opts request options */){}

const foo = 'bar';  // @private {String} foo private constant
```

## Output

```json
{
  "source": "/**Short multi-line comment*/",
  "description": "Short multi-line comment",
  "line": 1,
  "pos": {
    "start": 1,
    "end": 1
  },
  "tags": []
}
{
  "source": "// Single-line comment",
  "description": "Single-line comment",
  "line": 7,
  "pos": {
    "start": 7,
    "end": 7
  },
  "tags": []
}
{
  "source": "// \n// Super fly\n//\n// @public {function} getNinja super fly stuff.\n// @param {Object} [opts] configuration options.\n// @returns {Object} a command line ninja.",
  "description": "Super fly",
  "line": 9,
  "pos": {
    "start": 9,
    "end": 14
  },
  "tags": [
    {
      "id": "public",
      "type": "function",
      "optional": false,
      "line": 12,
      "source": "@public {function} getNinja super fly stuff.",
      "name": "getNinja",
      "description": "super fly stuff."
    },
    {
      "id": "param",
      "type": "Object",
      "optional": true,
      "line": 13,
      "source": "@param {Object} [opts] configuration options.",
      "name": "opts",
      "description": "configuration options."
    },
    {
      "id": "returns",
      "type": "Object",
      "optional": false,
      "line": 14,
      "source": "@returns {Object} a command line ninja.",
      "name": "a",
      "description": "command line ninja."
    }
  ]
}
{
  "source": "/**\n * @usage\n *\n * var x = 'y'\n *   , v = 'w';\n */",
  "description": "",
  "line": 16,
  "pos": {
    "start": 16,
    "end": 21
  },
  "tags": [
    {
      "id": "usage",
      "type": "",
      "optional": false,
      "line": 17,
      "source": "@usage\n var x = 'y'\n   , v = 'w';\n \n",
      "name": "",
      "description": "var x = 'y'\n  , v = 'w';"
    }
  ]
}
{
  "source": "/**\n *  @object point.x\n *  @object point.x.y.z\n */",
  "description": "",
  "line": 23,
  "pos": {
    "start": 23,
    "end": 26
  },
  "tags": [
    {
      "id": "object",
      "line": 24,
      "name": "point",
      "type": "",
      "description": "",
      "tags": [
        {
          "id": "object",
          "type": "",
          "optional": false,
          "line": 24,
          "source": " @object point.x",
          "name": "x",
          "description": "",
          "tags": [
            {
              "id": "object",
              "line": 25,
              "name": "y",
              "type": "",
              "description": "",
              "tags": [
                {
                  "id": "object",
                  "type": "",
                  "optional": false,
                  "line": 25,
                  "source": " @object point.x.y.z \n",
                  "name": "z",
                  "description": ""
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
{
  "source": "/** @param {Object} opts request options */",
  "description": "",
  "line": 28,
  "pos": {
    "start": 28,
    "end": 28
  },
  "tags": [
    {
      "id": "param",
      "type": "Object",
      "optional": false,
      "line": 28,
      "source": "@param {Object} opts request options ",
      "name": "opts",
      "description": "request options"
    }
  ]
}
{
  "source": "// @private {String} foo private constant",
  "description": "",
  "line": 30,
  "pos": {
    "start": 30,
    "end": 30
  },
  "tags": [
    {
      "id": "private",
      "type": "String",
      "optional": false,
      "line": 30,
      "source": "@private {String} foo private constant",
      "name": "foo",
      "description": "private constant"
    }
  ]
}
```

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

### language

A language rule is an object containing the `open`, `close` and `strip`
functions.

The start and end functions are passed the current line and should
return the `exec` match for the pattern.

The strip function is passed an array of lines for the entire comment and
should remove comment start, end and intermediate markup.

#### c

```javascript
c([opts])
```

Creates an array of language rules for the C family of languages.

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
* `strip` RegExp comment strip pattern.
* `last` Boolean extract description from the last line.

#### #single

```javascript
static single([opts])
```

Creates a single-line rule, when no options are given creates the
default C family single-line rule.

Returns single-line language rule.

* `opts` Object processing options.

##### Options

* `start` RegExp comment start pattern.
* `end` RegExp comment end pattern.
* `strip` RegExp comment strip pattern.
* `last` Boolean extract description from the last line.

#### shell

```javascript
shell([opts])
```

Creates an array of language rules for shell and configuration files.

Recognises continuous blocks of lines beginning with `#`.

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `start` RegExp comment start pattern.
* `end` RegExp comment end pattern.
* `strip` RegExp comment strip pattern.
* `trail` RegExp pattern to strip trailing comment characters.
* `last` Boolean extract description from the last line.

### Comment

Parse comments from an array of lines.

When a comment is parsed an object is pushed to the stream
with an array of `lines`, the `rule` for the comment and the
`start` and `end` line numbers.

### Parser

Comment and tag parser, parses comment description and tags.

#### .stringify

```javascript
Parser.prototype.stringify(indent)
```

Creates a stream that transforms to newline-delimited JSON, the
created stream is piped from this parser.

Returns the stringify stream.

* `indent` Number the number of spaces to indent the JSON.

### Tag

Defines the patterns and functions that perform the tag parsing.

Create a custom tag definition if you wanted to use an alternative
syntax or prefer something other than `@` as the tag identifier.

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

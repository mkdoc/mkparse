Table of Contents
=================

* [Comment Parser](#comment-parser)
  * [Install](#install)
  * [Usage](#usage)
  * [Input](#input)
  * [Output](#output)
  * [API](#api)
    * [file](#file)
    * [Comment](#comment)
      * [Options](#options)
    * [comment](#comment)
    * [Parser](#parser)
      * [Options](#options-1)
    * [parser](#parser)
      * [Events](#events)
    * [Tag](#tag)
      * [rule](#rule)
      * [pattern](#pattern)
      * [optional](#optional)
      * [whitespace](#whitespace)
      * [parse](#parse)
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

```javascript
var cparse = require('cparse')
  , stream = cparse.file('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
}
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
// @function {Object} method super fly stuff.
// @param {Object} [opts] configuration options.

/**
 * @usage
 *
 * var x = 'y'
 *   , v = 'w';
 */

/**
 *  @object point.x
 *  @object point.y
 *  @object point.z
 */
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
  "source": "// \n// Super fly\n//\n// @function {Object} method super fly stuff.\n// @param {Object} [opts] configuration options.",
  "description": "Super fly",
  "line": 9,
  "pos": {
    "start": 9,
    "end": 13
  },
  "tags": [
    {
      "tag": "function",
      "type": "Object",
      "optional": false,
      "line": 12,
      "source": "@function {Object} method super fly stuff.",
      "name": "method",
      "description": "super fly stuff."
    },
    {
      "tag": "param",
      "type": "Object",
      "optional": true,
      "line": 13,
      "source": "@param {Object} [opts] configuration options.",
      "name": "opts",
      "description": "configuration options."
    }
  ]
}
{
  "source": "/**\n * @usage\n *\n * var x = 'y'\n *   , v = 'w';\n */",
  "description": "",
  "line": 15,
  "pos": {
    "start": 15,
    "end": 20
  },
  "tags": [
    {
      "tag": "usage",
      "type": "",
      "optional": false,
      "line": 16,
      "source": "@usage\n var x = 'y'\n   , v = 'w';\n \n",
      "name": "",
      "description": "var x = 'y'\n  , v = 'w';"
    }
  ]
}
{
  "source": "/**\n *  @object point.x\n *  @object point.y\n *  @object point.z\n */",
  "description": "",
  "line": 22,
  "pos": {
    "start": 22,
    "end": 26
  },
  "tags": [
    {
      "tag": "object",
      "line": 23,
      "name": "point",
      "type": "",
      "description": "",
      "tags": [
        {
          "tag": "object",
          "type": "",
          "optional": false,
          "line": 23,
          "source": " @object point.x",
          "name": "x",
          "description": ""
        },
        {
          "tag": "object",
          "type": "",
          "optional": false,
          "line": 24,
          "source": " @object point.y",
          "name": "y",
          "description": ""
        },
        {
          "tag": "object",
          "type": "",
          "optional": false,
          "line": 25,
          "source": " @object point.z \n",
          "name": "z",
          "description": ""
        }
      ]
    }
  ]
}
```

## API

### file

```javascript
file(file[, opts])
```

Parse a file.

The options are passed to the `LineStream`, `Comment` and `Parser`.

* `file` String path.
* `opts` Object processing options.

### Comment

```javascript
new Comment([opts])
```

Creates a comment stream.

* `opts` Object stream options.

#### Options

* `rules` Object defines the comment rules.

### comment

```javascript
protected comment(chunk, encoding, callback)
```

Parse comments from an array of lines.

When a comment is parsed an object is pushed to the stream
with an array of `lines`, the `rule` for the comment and the
`start` and `end` line numbers.

* `chunk` Array lines to process.
* `encoding` String character encoding.
* `callback` Function function.

### Parser

```javascript
new Parser([opts])
```

Creates a tag parser stream.

* `opts` Object stream options.

#### Options

* `tag` Object defines the tag patterns, see [tag](#tag).
* `dotted` Boolean parse dotted names in tags.

### parser

```javascript
protected parser(chunk, encoding, callback)
```

Comment and tag parser, parses comment description and tags.

* `chunk` Array lines to process.
* `encoding` String character encoding.
* `callback` Function function.

#### Events

* `comment` when a comment has been parsed.

### Tag

Defines the patterns and functions that perform the tag parsing.

Create a custom tag definition if you wanted to use an alternative
syntax or prefer something other than `@` as the tag identifier.

See the [tag parser](#parser).

#### rule

```javascript
rule
```

Pattern that collects tag lines.

#### pattern

```javascript
pattern
```

Pattern that collects tag component parts.

#### optional

```javascript
optional
```

Pattern that determines optionality.

#### whitespace

```javascript
whitespace
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

This will add the `tag`, `type`, `name` and `description`
fields to the input `tag` argument.

* `TODO` rename tag field to `id`.
* `line` String the current line being parsed.
* `tag` Object the target for parsed data.

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

Table of Contents
=================

* [Comment Parser API](#comment-parser-api)
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
    * [rule](#rule)
      * [defaults](#defaults)
        * [Options](#options-3)
      * [#multi](#multi)
        * [Options](#options-4)
      * [#single](#single)
        * [Options](#options-5)
    * [Tag](#tag)
      * [rule](#rule-1)
      * [pattern](#pattern)
      * [optional](#optional)
      * [whitespace](#whitespace)
      * [parse](#parse-1)
    * [language](#language)
      * [exists](#exists)
      * [load](#load-1)
        * [Throws](#throws)
    * [Languages](#languages)
      * [actionscript](#actionscript)
      * [c](#c)
        * [Options](#options-6)
      * [coffeescript](#coffeescript)
      * [conf](#conf)
      * [cpp](#cpp)
        * [Options](#options-7)
      * [css](#css)
      * [erlang](#erlang)
      * [go](#go)
      * [groovy](#groovy)
      * [html](#html)
      * [ini](#ini)
        * [Options](#options-8)
      * [jade](#jade)
      * [java](#java)
      * [javascript](#javascript)
      * [less](#less)
      * [markdown](#markdown)
      * [pandoc](#pandoc)
      * [php](#php)
      * [pi](#pi)
      * [processing](#processing)
      * [properties](#properties)
      * [python](#python)
      * [ruby](#ruby)
        * [Options](#options-9)
      * [sass](#sass)
      * [scala](#scala)
      * [shell](#shell)
        * [Options](#options-10)
      * [sql](#sql)
        * [Options](#options-11)
      * [stylus](#stylus)
        * [Options](#options-12)
      * [toml](#toml)
      * [typescript](#typescript)
      * [vim](#vim)
        * [Options](#options-13)
      * [xml](#xml)
      * [yaml](#yaml)

Comment Parser API
==================

## load

```javascript
load(file[, opts][, cb])
```

Load and parse file contents.

When a callback function is given it is added as a listener for
the error and end events on the source file stream.

Returns the parser stream.

* `file` String path.
* `opts` Object processing options.
* `cb` Function callback function.

## parse

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

## Collator

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

### Options

* `content` Boolean push content chunks to the stream.
* `comment` Boolean push comment chunks to the stream.
* `buffer` Boolean buffer output.
* `stringify` Boolean convert output to JSON strings.
* `indent` Number number of spaces to indent JSON.

## Comment

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

### Options

* `rules` Array|Function defines the comment rules.
* `options` Object to pass to the `rules` function.

## Parser

```javascript
Parser([opts])
```

Comment and tag parser, parses comment description and tags.

* `opts` Object stream options.

### Options

* `tag` Object defines the tag patterns, see [tag](#tag).
* `dotted` Boolean parse dotted names in tags.

### Events

* `comment` when a comment has been parsed.
* `content` when a content chunk is received.

## .stringify

```javascript
Parser.prototype.stringify(indent, comment)
```

Creates a stream that transforms to newline-delimited JSON, the
created stream is piped from this parser.

Returns the stringify stream.

* `indent` Number the number of spaces to indent the JSON.
* `comment` Boolean only include comment output.

### rule

A language rule is an object containing the `open`, `close` and `strip`
functions.

The open and close functions are passed the current line and should
return the `exec` match for the pattern.

The strip function is passed an array of lines for the entire comment and
should remove comment meta characters from all lines.

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

### Tag

Defines the patterns and functions that perform the tag parsing.

Create a custom tag definition if you wanted to use an alternative
syntax or prefer something other than `@` as the tag identifier.

The generic syntax for tags is: `@id {type[=value]} name description`;
everything but the tag `id` is considered optional.

Which when given: `@property {String=mkdoc} [nickname] user` will expand
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

### language

Contains utilities for testing whether a language id is valid, loading
language packs by id and finding language identifiers by file extension.

#### exists

```javascript
exists(id)
```

Test whether a language exists by identifier.

Returns whether the language pack exists.

* `id` String language pack identifier.

#### load

```javascript
load(id)
```

Load a language pack by identifier.

* `id` String language pack identifier.

##### Throws

* `if` Error the language pack does not exist.

### Languages

Collection of language packs.

Default language pack used is the [cpp language](#cpp).

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

#### less

```javascript
less([opts])
```

Creates an array of language rules for less files.

Recognises terminated multi-line comments starting with `/*` and
continuous blocks of single-line comments beginning with `//`.

See the [css language](#css).

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

#### processing

```javascript
processing([opts])
```

Creates an array of language rules for processing files.

Recognises continuous lines with `//` comments and terminated
multi-line comments starting with `/**`.

See the [default settings](#defaults).

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

#### sass

```javascript
sass([opts])
```

Creates an array of language rules for sass files.

Recognises terminated multi-line comments starting with `/*` and
continuous blocks of single-line comments beginning with `//`.

See the [css language](#css).

Returns list of language rules.

* `opts` Object processing options.

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

#### stylus

```javascript
stylus([opts])
```

Creates an array of language rules for stylus files.

Recognises terminated multi-line comments starting with `/*` and
buffered multi-line blocks starting with `/*!` as well as
continuous blocks of single-line comments beginning with `//`.

See the [css language](#css).

Returns list of language rules.

* `opts` Object processing options.

##### Options

* `single` Object|Boolean=true single-line comment options.
* `multi` Object|Boolean=true multi-line comment options.
* `buffer` Object|Boolean=true buffer comment options.

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

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[mkdoc]: https://github.com/mkdoc/mkdoc
[jshint]: http://jshint.com
[jscs]: http://jscs.info
[mdp]: https://github.com/tmpfs/mdp

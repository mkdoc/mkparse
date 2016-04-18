# Comment Parser

<? @include readme/badges.md ?>

> Parse source file comments

Fast, streaming and configurable comment parser; currently supports 30+ languages.

Designed for polyglot programmers to:

* Combine comments from various files (HTML, CSS and Javascript for example)
* Parse comments from any language
* Strip comments from any file
* Separate comments into another file
* Implement custom tag systems (annotations)
* Operate on processing instructions (see the [pi language](/API.md#pi))
* Document JSON files, read comments then strip in build process

See the [i/o sample](/EXAMPLE.md) and the [api docs](/API.md).

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md example.md comments.md ?>

<? @source {javascript} ../test/fixtures/comment-examples.js ?>

<? @include {=readme} guide.md help.md ?>

<? @include {=readme} license.md links.md ?>

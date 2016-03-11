/**
 *  Collection of language packs.
 *
 *  Default language pack used is the [cpp language](#cpp).
 *
 *  A language rule is an object containing the `open`, `close` and `strip` 
 *  functions.
 *
 *  The open and close functions are passed the current line and should 
 *  return the `exec` match for the pattern.
 *
 *  The strip function is passed an array of lines for the entire comment and 
 *  should remove comment meta characters from all lines.
 *
 *  @module Language Packs
 */

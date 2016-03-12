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

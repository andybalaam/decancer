# decancer
A Node.js module that removes common confusables from strings written in pure [Rust](https://rust-lang.org) without the use of Regexes.

__**As of version 1.1.0, This library supports 1,478 different code-points.**__

# installation
Install with npm:
```bash
$ npm install decancer
```

# example
```js
const decancer = require('decancer');

const noCancer = decancer('vＥⓡ𝔂 𝔽𝕌Ňℕｙ ţ乇𝕏𝓣');
console.log(noCancer); // 'very funny text'
```
> **NOTE:** output will ALWAYS be in lowercase.

# contributions
All contributions are welcome. If you want to, you can [make a fork here at GitHub.](https://github.com/vierofernando/decancer/fork) Thanks! &lt;3
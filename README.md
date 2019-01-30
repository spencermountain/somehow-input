
<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />
  <div>handy html inputs</div>

  <a href="https://npmjs.org/package/somehow-input">
    <img src="https://img.shields.io/npm/v/somehow-input.svg?style=flat-square" />
  </a>
  <a href="https://unpkg.com/somehow-input">
    <img src="https://badge-size.herokuapp.com/spencermountain/somehow-input/master/builds/somehow.min.js" />
  </a>
</div>


<div align="center">
  <code>npm install somehow-input</code>
</div>

<div align="center">
**work-in-progress**
</div>

**somehow** creates SVG, using your data, that you can throw-into your webpage.

```js
let inputs = require('somehow-input')
let slider = inputs.slider({
  el: '#stage',
  width: 600,
  max: 200,
  min: -100,
  value: 50,
  label: 'number'
})
document.body.innerHTML = slider.build()
```
these are used with [somehow](https://github.com/spencermountain/somehow) to easily create navigable infographics.

more to come

you can see some [demos here](http://thensome.how/)

MIT

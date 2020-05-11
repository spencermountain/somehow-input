
<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />
  <div>some svelte input elements</div>

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

just some plug+play svelte components that I like to use:

### Number
flexible way to select a number within a range
```html
<script>
let number=3
</script>
<Number bind:number={index} min={1} max={4} hasSlider={false} hasKeyboard={false}/>
```

### Choice
choose between an array of choices
```html
<script>
let choices=['a','b','c']
let choice='b'
</script>
<Choice bind:choice {choices} />
```

### Text
```html
<script>
let text='foo'
</script>
<Text bind:text />
```

### Legend
a color-based legend component
```html
<script>
let colors={'#dedded':'LabelA', 'red':'Label2'}
let selection=null
</script>
<Legend bind:selection colors={colors} />
```

### Button
just a nice button, nothing else.
```html
<Button label="hi" color="red" onClick={myFn}/>
```

### Tabs
```html
<script>
let choices=['a','b','c']
let choice='b'
</script>
<Tabs bind:choice {choices}/>
```

MIT

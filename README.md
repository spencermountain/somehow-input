<div align="center">
  <div><b>somehow-input</b></div>
  <img src="https://user-images.githubusercontent.com/399657/68222691-6597f180-ffb9-11e9-8a32-a7f38aa8bded.png"/>
  <div>— part of <a href="https://github.com/spencermountain/somehow">somehow</a> —</div>
  <div>WIP svelte infographics</div>
  <div align="center">
    <sub>
      by
      <a href="https://spencermounta.in/">Spencer Kelly</a> 
    </sub>
  </div>
</div>
<div align="right">
  <a href="https://npmjs.org/package/somehow-input">
    <img src="https://img.shields.io/npm/v/somehow-input.svg?style=flat-square" />
  </a>
</div>
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

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
  let number = 3
</script>
<Number
  bind:number="{index}"
  min="{1}"
  max="{4}"
  hasSlider="{false}"
  hasKeyboard="{false}"
/>
```

![image](https://user-images.githubusercontent.com/399657/92410104-093dbb00-f111-11ea-9de4-227b86aa7a80.png)

### Choice

choose between an array of choices

```html
<script>
  let choices = ['a', 'b', 'c']
  let choice = 'b'
</script>
<Choice bind:choice {choices} />
```

### Text

```html
<script>
  let text = 'foo'
</script>
<Text bind:text />
```

### Legend

a color-based legend component

```html
<script>
  let colors = { '#dedded': 'LabelA', red: 'Label2' }
  let selection = null
</script>
<legend bind:selection colors="{colors}" />
```

### Button

just a nice button, nothing else.

```html
<button label="hi" color="red" onClick="{myFn}" />
```

### Tabs

```html
<script>
  let choices = ['a', 'b', 'c']
  let choice = 'b'
</script>
<Tabs bind:choice {choices} />
```

MIT

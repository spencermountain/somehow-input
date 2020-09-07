<script>
  import {
    Choice,
    Number,
    Tabs,
    Button,
    Text,
    Legend,
    Slider,
    TextArea
  } from './src'

  let choices = ['a', 'b', 'c']
  let choice = 'b'

  let text = 'foobar'
  let number = 2
  let value = 2

  let colors = { '#dedded': 'LabelA', red: 'Label2' }
  let longText = `this is a test\n.red\n.green\noh yeah.\nthis is a test\n.red\n.green\noh yeah.\nthis is a test\n.red\n.green\noh yeah.\nthis is a test\n.red\n.green\noh yeah.`
</script>

<style>
  .col {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    align-self: stretch;
  }
  .mt3 {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
</style>

<div class="col">
  <div>
    <a
      style="font-size:2rem; color:steelblue; margin-top:2rem;"
      href="https://github.com/spencermountain/somehow-input">
      somehow-input
    </a>
  </div>
  <div>some handy svelte input components</div>

  <h2 class="mt3">Slider</h2>
  <div style="width:80%;">
    <Slider bind:value min={0} max={200} />
  </div>
  <h2 class="mt3">TextArea</h2>
  <div style="width:80%;">
    <TextArea bind:value={longText} />
  </div>

  <h2 class="mt3">Number</h2>
  <Number bind:number min={1} max={4} hasSlider={false} hasKeyboard={false} />

  <h2 class="mt3">Button</h2>
  <Button label="hi" color="red" onClick={() => console.log('hi')} />

  <h2 class="mt3">Choice</h2>
  <Choice bind:choice {choices} />

  <h2 class="mt3">Tabs</h2>
  <Tabs bind:choice {choices} hasKeyboard={false} />

  <h2 class="mt3">Text</h2>
  <Text bind:text />

  <h2 class="mt3">Legend</h2>
  <Legend {colors} />

  <div class="mt3" />
</div>

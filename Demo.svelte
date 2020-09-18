<script>
  import {
    Choice,
    Number,
    Tabs,
    Button,
    Text,
    Legend,
    Slider,
    NHL,
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
    justify-content: flex-start;
    align-items: flex-start;
    margin: 3rem;
    text-align: center;
    flex-wrap: wrap;
    align-self: stretch;
  }
  .mt5 {
    margin-top: 14rem;
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

  <h4 class="mt5">NHL-team selector</h4>
  <div style="width:80%;">
    <NHL />
  </div>

  <h4 class="mt5">Slider</h4>
  <div style="width:80%;">
    <Slider bind:value min={0} max={200} />
  </div>

  <h4 class="mt5">TextArea</h4>
  <div style="width:80%;">
    <TextArea bind:value={longText} />
  </div>

  <h4 class="mt5">Number</h4>
  <Number bind:number min={1} max={4} hasSlider={false} hasKeyboard={false} />

  <h4 class="mt5">Button</h4>
  <Button label="hi" color="red" onClick={() => console.log('hi')} />

  <h4 class="mt5">Choice</h4>
  <Choice bind:choice {choices} />

  <h4 class="mt5">Tabs</h4>
  <Tabs bind:choice {choices} />

  <h4 class="mt5">Text</h4>
  <Text bind:text />

  <h4 class="mt5">Legend</h4>
  <Legend {colors} />

  <div class="mt5" />
</div>

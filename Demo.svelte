<script>
  import { Choice, Number, Tabs, Button, Text } from './src'

  let choices = ['a', 'b', 'c']
  let choice = 'b'

  let text = 'foobar'
  let number = 2
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
    <a href="https://github.com/spencermountain/somehow-input">somehow-input</a>
  </div>
  <div>some handy svelte input components</div>

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
</div>

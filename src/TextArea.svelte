<script>
  import { onMount } from 'svelte'
  export let value = ''
  let el

  export function text_area_resize(el) {
    function resize({ target }) {
      target.style.height = '1px'
      target.style.height = +target.scrollHeight + 'px'
    }

    resize({ target: el })
    el.style.overflow = 'hidden'
    el.addEventListener('input', resize)

    return {
      destroy: () => el.removeEventListener('input', resize)
    }
  }

  onMount(() => {
    text_area_resize(el)
  })

  let bars = [
    '',
    '#AB5850',
    '#6accb2',
    '',
    '',
    '#AB5850',
    '#6accb2',
    '',
    '',
    '#AB5850',
    '#6accb2',
    '',
    '',
    '#AB5850',
    '#6accb2',
    ''
  ]
</script>

<style>
  .container {
    position: relative;
  }
  .input {
    font-family: 'avenir next', avenir, sans-serif;
    display: block;
    padding: 1rem 1.5rem 1rem 0.5rem;
    margin: 0.3em 0.6em 0.3rem 5px;
    width: 80%;
    max-width: 50rem;
    font-size: 1.2rem;
    line-height: 1.5;
    outline: 0;
    border: 0;
    border-radius: 0.4rem;
    font-style: normal;
    /* box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5); */
    box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
    transition: box-shadow 100ms;
    color: #c4cad5;
    resize: none;
    border-bottom: 2px solid transparent;
    border-left: 4px solid lightgrey;
  }
  .input:hover {
    color: #a3a5a5;
    box-shadow: 2px 1px 4px 0 rgba(0, 0, 0, 0.2);
    border-bottom: 2px solid lightsteelblue;
    /* color: #69c; */
  }
  .input:focus {
    color: #577c97;
    /* font-style: italic; */
    box-shadow: 2px 1px 5px 0 rgba(0, 0, 0, 0.2);
    border-bottom: 2px solid lightsteelblue;
    /* color: #69c; */
    /* border-bottom: 2px solid steelblue; */
  }
  .side {
    position: absolute;
    top: 1rem;
    left: 5px;
    width: 4px;
    height: 100%;
    /* border: 1px solid grey; */
  }
  .col {
    height: 100%;
  }
  .bar {
    height: 1.8rem;
    width: 4px;
    background-color: lightgrey;
    border-radius: 2px;
  }
</style>

<div class="container">
  <div class="side">
    <div class="col">
      {#each bars as bar}
        <div class="bar" style="background-color:{bar};" />
      {/each}
    </div>
  </div>
  <textarea
    class="input"
    spellcheck="false"
    type="text"
    {value}
    bind:this={el} />
</div>

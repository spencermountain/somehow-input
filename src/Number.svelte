<script>
  export let hasSlider = true
  export let hasKeyboard = true

  export let number = 0
  export let min = 0
  export let max = 100
  number = Number(number)
  min = Number(min)
  max = Number(max)

  const handle_pointerdown = e => {
    if (!e.isPrimary) {
      return
    }
    const start_x = e.clientX
    const start_value = Number(number)
    const handle_pointermove = e2 => {
      if (!e2.isPrimary) {
        return
      }
      const d = e2.clientX - start_x
      const step = Math.min(
        1,
        d > 0 ? (window.innerWidth - start_x) / (max - start_value) : start_x / (start_value - min)
      )
      const n = Math.round(d / step)
      number = Math.max(min, Math.min(max, start_value + Math.round(n * 0.1) * 1))
    }
    const handle_pointerup = e3 => {
      if (!e3.isPrimary) {
        return
      }
      window.removeEventListener('pointermove', handle_pointermove)
      window.removeEventListener('pointerup', handle_pointerup)
    }
    window.addEventListener('pointermove', handle_pointermove)
    window.addEventListener('pointerup', handle_pointerup)
  }

  function minus() {
    number -= 1
    if (number < min) {
      number = min
    }
  }
  function plus() {
    number += 1
    if (number > max) {
      number = max
    }
  }
  function handleKeydown(event) {
    if (hasKeyboard) {
      if (event.key === 'ArrowLeft') {
        minus()
      }
      if (event.key === 'ArrowRight') {
        plus()
      }
    }
  }
</script>

<style>
  .main-row {
    display: flex;
    position: relative;
    user-select: none;
    margin: 1rem;
    -moz-user-select: none;
    color: #50617a;
  }
  .main-row span {
    display: block;
    font-size: 2em;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white;
    cursor: ew-resize;
  }
  .main-row button[disabled] {
    opacity: 0.2;
  }
  .main-row button {
    background: none;
    border: none;
    font-size: 2em;
    margin: 0;
    padding: 0 0.2em;
    cursor: pointer;
    color: #50617a;
  }
</style>

<svelte:window on:keydown={handleKeydown} />
<div class="container">
  <div class="main-row">
    <button disabled={Number(number) === Number(min)} on:click={minus}>&larr;</button>
    <span on:pointerdown={handle_pointerdown}>{number}</span>
    <button disabled={Number(number) === Number(max)} on:click={plus}>&rarr;</button>
  </div>
  {#if hasSlider}
    <input type="range" bind:value={number} {min} {max} />
  {/if}
</div>

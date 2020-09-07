<script>
  import scaleLinear from './scale'
  export let value = 0
  export let max = 100
  export let min = 0
  let scale = scaleLinear({ world: [0, 100], minmax: [min, max] })
  let percent = scale(value)
  let dragStart = 0
  let el = null
  // let status = 'init'

  const moveHandle = function(e) {
    if (el.isSameNode(e.target) === true) {
      return
    }
    let total = e.target.clientWidth
    console.log(e)
    let val = e.layerX || 0

    percent = (val / total) * 100
    if (percent > 100) {
      percent = 100
    }
    if (percent < 0) {
      percent = 0
    }
    value = scale.backward(percent)
  }
  // end drag event
  const mouseUp = function(e) {
    stopDrag(e)
  }
  const didDrag = function(e) {
    moveHandle(e)
  }
  const stopDrag = function(e) {
    window.removeEventListener('pointermove', didDrag)
    window.removeEventListener('pointerup', mouseUp)
  }
  function startClick(e) {
    dragStart = e.layerX
    window.addEventListener('pointermove', didDrag)
    window.addEventListener('pointerup', mouseUp)
    moveHandle(e)
  }
</script>

<style>
  .container {
    position: relative;
    height: 40px;
    width: 100%;
    cursor: pointer;
  }
  .background {
    position: absolute;
    background-color: lightgrey;
    border-radius: 8px;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
    top: 33%;
    height: 33%;
    width: 100%;
    touch-action: none;
  }
  .handle {
    border-radius: 8px;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
    position: absolute;
    width: 15px;
    height: 100%;
    cursor: col-resize;
    border: 1px solid grey;
    position: relative;
    background-color: steelblue;
    touch-action: none;
  }
</style>

<!-- <div>{value}</div>
<div>{percent}</div> -->
<div class="container" on:pointerdown={startClick}>
  <div class="background" />
  <div
    class="handle"
    style="left:{percent}%;"
    on:pointerdown={startClick}
    bind:this={el} />
</div>

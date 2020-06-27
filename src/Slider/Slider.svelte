<script>
  import scaleLinear from './scale'
  export let value = 0
  export let max = 100
  export let min = 0
  let scale = scaleLinear({ world: [0, 100], minmax: [min, max] })
  let percent = scale(value)
  let dragStart = 0
  let el = null

  const moveHandle = function(e) {
    if (el.isSameNode(e.target) !== true) {
      return
    }
    let total = e.target.clientWidth
    let val = e.layerX || 0
    percent = (val / total) * 100
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
    window.removeEventListener('mousemove', didDrag)
    window.removeEventListener('pointerup', mouseUp)
  }
  function startClick(e) {
    dragStart = e.layerX
    window.addEventListener('mousemove', didDrag)
    window.addEventListener('pointerup', mouseUp)
    moveHandle(e)
  }
</script>

<style>
  .container {
    position: relative;
    height: 50px;
    width: 100%;
  }
  .background {
    position: absolute;
    background-color: lightgrey;
    border-radius: 2px;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
    top: 10%;
    height: 80%;
    width: 100%;
    cursor: pointer;
  }
  .handle {
    border-radius: 2px;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
    position: absolute;
    width: 15px;
    height: 100%;
    cursor: col-resize;
    border: 1px solid grey;
    position: relative;
    background-color: steelblue;
  }
</style>

<div>{value}</div>
<div class="container">
  <div class="background" on:pointerdown={startClick} bind:this={el} />
  <div class="handle" style="left:{percent}%;" on:pointerdown={startClick} />
</div>

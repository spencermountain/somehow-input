<script>
  export let colors = {}
</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    align-self: stretch;
  }
  .color {
    width: 25px;
    height: 20px;
    margin: 5px;
    border-radius: 5px;
  }
</style>

<div class="">
  {#each Object.keys(colors) as k}
    <div class="row">
      <div class="color" style="background-color:{k};" />
      <div class="label">{colors[k]}</div>
    </div>
  {/each}
</div>

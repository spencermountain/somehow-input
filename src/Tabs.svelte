<script>
  export let choices = []
  export let choice = null
  let index = choices.findIndex(tab => tab === choice)
  if (index === -1) {
    index = 0
  }
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
    font-size: 1.2rem;
  }
  .tab {
    cursor: pointer;
    flex-grow: 100;
    margin-left: 4px;
    margin-right: 4px;
    padding-left: 4px;
    padding-right: 4px;
    transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
    border-color: rgba(181, 187, 191, 0.1);
    border-bottom: 3px solid rgba(181, 187, 191, 0.1);
    color: rgb(181, 187, 191);
  }

  .selected {
    border-bottom: 3px solid #2d85a8;
    color: #2d85a8;
  }
</style>

<div class="row">
  {#each choices as choice, i}
    <div class="tab" class:selected={i === index} on:click={() => (index = i)}>
      {choice}
    </div>
  {/each}

</div>

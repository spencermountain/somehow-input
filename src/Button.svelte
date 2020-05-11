<script>
  export let label = ''
  export let color = ''
</script>

<style>
  .button {
    padding: 0.5rem;
    margin-left: 0.5rem;
    user-select: none;
    background-color: #2d85a8;
    font-family: 'avenir next', avenir, sans-serif;
    background-color: #fdfffd;
    color: #69c;
    min-width: 8rem;
    min-height: 1.2rem;
    font-size: 1.4rem;
    margin: 0.5rem;
    padding: 0.2rem;
    cursor: pointer;
    border: 0;
    border-radius: 3px;
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.5);
    transition: box-shadow 100ms;
    border-bottom: 2px solid #69c;
  }
  .button:hover {
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.5);
    border-bottom: 2px solid #69c;
    color: #cc8a66;
  }
  .button:focus {
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.5);
    border-bottom: 2px solid #69c;
    color: #cc8a66;
  }
</style>

<div class="button grey pointer ullighter b3 white" style="">{label}</div>

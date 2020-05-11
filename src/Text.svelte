<script>
  export let text = ''
</script>

<style>
  .text {
    max-width: 600px;
    min-width: 10px;
    max-width: 20rem;
    min-width: 10px;
  }
  .input {
    font-family: 'avenir next', avenir, sans-serif;
    display: block;
    padding: 0.5rem 1rem 0.5rem 1rem;
    margin: 0.3em 0.6em;
    width: 80%;
    color: #a3a5a5;
    max-width: 50rem;
    font-size: 2rem;
    line-height: 1rem;
    line-height: 1.25;
    outline: 0;
    border: 0;
    border-radius: 0.4rem;
    font-style: normal;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
    transition: box-shadow 100ms;
  }
  .input:hover {
    box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
    color: #69c;
  }
  .input:focus {
    font-style: italic;
    box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.5);
    color: #69c;
    border-bottom: 2px solid steelblue;
  }
</style>

<input class="input" style="" type="text" value={text} />

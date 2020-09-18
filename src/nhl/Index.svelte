<script>
  //export let name = ''
  import teams from './teams'
  export let selected = 'TOR'
  const isSelected = function(team) {
    return selected === team.short
  }
  const select = function(team) {
    selected = team.short
    console.log(selected)
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    align-self: stretch;
    border-left: 2px solid lightsteelblue;
    height: 300px;
    width: 600px;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    align-self: stretch;
  }
  .box {
    margin-top: 10px;
    width: 15px;
    height: 25px;
    border-radius: 3px;
  }
  .team {
    padding: 5px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.3;
    cursor: pointer;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .team:hover {
    opacity: 0.8;
    border: 2px solid #f2f2f2;
  }
  .name {
    font-size: 12px;
  }
  .selected {
    border: 2px solid grey !important;
    opacity: 1 !important;
  }
</style>

<div class="container">
  <div class="row">
    {#each teams.atlantic as team}
      <div
        class="team"
        class:selected={team.short === selected}
        on:click={() => select(team)}>
        <div class="box" style="background-color:{team.color};" />
        <div class="name">{team.short}</div>
      </div>
    {/each}
  </div>
  <div class="row">
    {#each teams.metro as team}
      <div
        class="team"
        class:selected={team.short === selected}
        on:click={() => select(team)}>
        <div class="box" style="background-color:{team.color};" />
        <div class="name">{team.short}</div>
      </div>
    {/each}
  </div>
  <div class="row">
    <!-- add dummy team -->
    <div class="team">
      <div class="box" style="background-color:none;" />
      <div class="name" />
    </div>
    {#each teams.central as team}
      <div
        class="team"
        class:selected={team.short === selected}
        on:click={() => select(team)}>
        <div class="box" style="background-color:{team.color};" />
        <div class="name">{team.short}</div>
      </div>
    {/each}
  </div>
  <div class="row">
    {#each teams.pacific as team}
      <div
        class="team"
        class:selected={team.short === selected}
        on:click={() => select(team)}>
        <div class="box" style="background-color:{team.color};" />
        <div class="name">{team.short}</div>
      </div>
    {/each}
  </div>
</div>

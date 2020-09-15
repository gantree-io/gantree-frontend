<script>
  import { onMount } from 'svelte'
  import sparkline from "@fnando/sparkline";

  export let stroke
  export let width
  export let height
  export let values
  export let stamps
  export let minScale
  export let format

  let el = ''
  let update = ''

  onMount(() => {
    values.subscribe(v => {
      console.log({v, el, minScale})
      sparkline(el, values, {
        spotRadius: 0.1,
        minScale: minScale,
        format: (e) => e
      });
    })
  })

  const onRef = (el) => {
    el = el;
  }

  const onTooltipInit = (update) => {
    update = update;
  }

  // onMouseMove = (event, data) => {
  //   const str = format ? format(data.value, stamps ? stamps[data.index] : null) : `${data.value}`;
  //   update(str);
  // }

</script>

<style>
  svg {
    fill-opacity: 0.35;
    margin: 0 -1px -3px -1px;
    fill: red;
    stroke: black;
  }
</style>


<svg bind:this={el} width={width} height={height} stroke-width={stroke} />




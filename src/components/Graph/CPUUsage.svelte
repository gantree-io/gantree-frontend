<script>
	import { onMount } from 'svelte';
	import Telemetry from '@util/telemetry'
	import FCChart from './FCChart.svelte'
	import moment from 'moment'
	
	export let ip;

	let data
   
	const options = {
		title: {
			display: false,
		},
		legend: {
			display: false,
		},
		tooltips: {
			//titleFontSize: 0,
			callbacks: {
				label: tooltipItem => `${tooltipItem.yLabel}%`
			}
		},
		scales: {
			yAxes: [{
				display: false,
				ticks: {
					beginAtZero: true,
					max: 100,
				}
			}],
			xAxes: [{
				display: false,
				ticks: {
					beginAtZero: true
				}
			}]
		}
	}

	const setMemoryUsage = (CPUUse, Timestamp) => {
		// convert to mb
		let vals = CPUUse.map(val => Math.floor(val * 0.001))

		data = {
			labels: Timestamp.map(t => moment(t).format('HH:mm:ss')),
			datasets: [{
				label: false,
				data: vals,
				backgroundColor: [
					'rgba(109, 107, 217, 0.2)',
					...vals.map(() => 'rgba(109, 107, 217, 1)')
				],
				borderColor: [
					'rgba(109, 107, 217, 1)',
				],
				borderWidth: 1
			}]
		}
	}

	onMount(async () => {
		let telemetry = new Telemetry(ip)
		telemetry.listen('AddedNode', ({NodeHardware}) => setMemoryUsage(NodeHardware.CPUUse, NodeHardware.Timestamp))
		telemetry.listen('NodeHardware', ({NodeHardware}) => setMemoryUsage(NodeHardware.CPUUse, NodeHardware.Timestamp))
		return () => telemetry.close()
	})
</script>

<style lang="scss">
	.cpu-usage{

	}
</style>

<FCChart class='cpu-usage' title='CPU Usage (%)' type='line' data={data} options={options}/>
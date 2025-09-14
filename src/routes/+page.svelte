<script>
	import { persistedState } from '$lib/persisted-state.svelte.js';

	let counter = persistedState('counter', 0, {
		persistedType: 'localstorage'
	});

	function inc() {
		counter.value += 1;
	}
	function reset() {
		counter.value = 0;
	}
</script>

<button on:click={inc}>+1</button>
<button on:click={reset}>Reset</button>
<p>Count: {counter.value}</p>

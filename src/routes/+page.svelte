<script lang="ts">
	import { x } from '$lib/store.svelte.js';
</script>

value in local storage: {x.value.name}
<br />
<br />
<input bind:value={x.value.name} />
<br />
<br />
<!-- <button onclick={() => x.updateStorage()}>Save</button> -->
<button onclick={() => x.cleanup()}>clear</button>

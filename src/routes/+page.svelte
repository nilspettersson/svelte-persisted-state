<script lang="ts">
	import { localStorageState } from '$lib/local-storage-state.svelte.js';

	let x = localStorageState('x', 'hello');
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

value in local storage: {x.value}
<br />
<br />
<input bind:value={x.value} />

import { persistedState } from './persisted-state.svelte.js';

export let x = persistedState(
	'x',
	{ name: 'test' },
	{ persistedType: 'localstorage', manualUpdate: true }
);

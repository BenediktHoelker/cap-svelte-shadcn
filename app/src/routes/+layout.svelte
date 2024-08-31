<script>
	import '../app.css';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	export let data;

	// https://stackoverflow.com/questions/77554335/creating-a-writable-svelte-store-from-loaded-page-data-in-sveltekit
	const tasks = writable(null);
	$: setContext('tasks', tasks);
	$: tasks.set(data.tasks);

	const taskItemCount = writable(null);
	$: setContext('taskItemCount', taskItemCount);
	$: taskItemCount.set(data.taskItemCount);
</script>

<slot></slot>

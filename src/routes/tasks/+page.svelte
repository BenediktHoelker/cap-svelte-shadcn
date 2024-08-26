<script lang="ts">
	import DataTable from './(components)/data-table.svelte';
	import UserNav from './(components)/user-nav.svelte';
	// import data from './(data)/tasks.json';
	import TasksLight from '$lib/img/examples/tasks-light.png';
	import TasksDark from '$lib/img/examples/tasks-dark.png';

	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { type Handle, redirect } from '@sveltejs/kit';

	export let data;

	// https://stackoverflow.com/questions/77554335/creating-a-writable-svelte-store-from-loaded-page-data-in-sveltekit
	const tasks = writable(null);
	$: setContext('tasks', tasks);
	$: tasks.set(data.tasks);
</script>

<div class="sm:hidden">
	<enhanced:img src={TasksLight} alt="Tasks" class="block dark:hidden" />
	<enhanced:img src={TasksDark} alt="Tasks" class="hidden dark:block" />
</div>
<div class="flex h-full flex-1 flex-col space-y-8 p-8">
	<!-- <div class="flex items-center justify-between space-y-2 bg-white"> -->
	<div class="sticky top-0 z-50 flex h-20 items-center justify-between space-y-2 bg-white">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Welcome back!</h2>
			<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
		</div>
		<div class="flex items-center space-x-2">
			<UserNav />
		</div>
	</div>
	<div class="z-10">
		<DataTable />
	</div>
</div>

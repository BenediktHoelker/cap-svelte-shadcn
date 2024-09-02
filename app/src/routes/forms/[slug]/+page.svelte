<script lang="ts">
	import type { PageData } from './$types.js';
	import TaskForm from './task-form.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	export let data: PageData;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Task</h3>
		<p class="text-muted-foreground text-sm">Create or edit an existing</p>
	</div>
	<Separator />
	<TaskForm data={data.form} />
</div>

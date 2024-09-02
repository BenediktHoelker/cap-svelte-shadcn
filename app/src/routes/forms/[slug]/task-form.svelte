<script lang="ts" context="module">
	import { z } from 'zod';
	export const taskFormSchema = z.object({
		id: z.string(),
		title: z.string().nullable(),
		// .string({ required_error: 'Please enter a valid title.' })
		// .min(3, 'Title must be at least 3 characters.')
		// .max(5000, 'Title must not exceed 5000 characters.'),
		status: z.string().nullable(),
		label: z.string().nullable(),
		priority: z.string().nullable()
	});

	export type TaskFormSchema = typeof taskFormSchema;
</script>

<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { tick } from 'svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '$lib/utils.js';
	import { browser } from '$app/environment';

	export let data: SuperValidated<Infer<TaskFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(taskFormSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="space-y-8" use:enhance id="task-form">
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input placeholder="@shadcn" {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<Form.Description>Please enter an expressive title...</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="label">
		<Form.Control let:attrs>
			<Form.Label>Label</Form.Label>
			<Input placeholder="@shadcn" {...attrs} bind:value={$formData.label} />
		</Form.Control>
		<Form.Description>Add labels...</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Update task</Form.Button>
</form>

{#if browser}
	<SuperDebug data={$formData} />
{/if}

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
	import { type Task, taskSchema } from '../../(data)/schemas.js';

	export let data: SuperValidated<Task>;

	const form = superForm(data, {
		validators: zodClient(taskSchema),
		resetForm: false
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="space-y-8" use:enhance id="task-form">
	<input type="hidden" name="id" value={$formData.id} />

	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Title</Form.Label>
			<Input
				placeholder="Please enter an expressive title..."
				{...attrs}
				bind:value={$formData.title}
			/>
		</Form.Control>
		<!-- <Form.Description></Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="status">
		<Form.Control let:attrs>
			<Form.Label>Status</Form.Label>
			<Input placeholder="Change status..." {...attrs} bind:value={$formData.status} />
		</Form.Control>
		<!-- <Form.Description></Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="label">
		<Form.Control let:attrs>
			<Form.Label>Label</Form.Label>
			<Input placeholder="Add labels..." {...attrs} bind:value={$formData.label} />
		</Form.Control>
		<!-- <Form.Description></Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="priority">
		<Form.Control let:attrs>
			<Form.Label>Priority</Form.Label>
			<Input placeholder="Set priority..." {...attrs} bind:value={$formData.priority} />
		</Form.Control>
		<!-- <Form.Description></Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Update task</Form.Button>
</form>

{#if browser}
	<SuperDebug data={$formData} />
{/if}

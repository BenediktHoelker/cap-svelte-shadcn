// @ts-nocheck
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { type Actions, fail } from '@sveltejs/kit';
import { profileFormSchema } from './profile-form.svelte';
import type { PageServerLoad } from '../$types.js';
import cds from '@sap/cds';
import { error } from '@sveltejs/kit';

const srv = await cds.connect.to('BookshopService');
const Tasks = srv.entities('eon').Tasks;

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	const id = params.slug;
	const [task] = await SELECT.from(Tasks).where({ id });
	if (!task) error(404, 'Task not found');
	const form = await superValidate(task, zod(profileFormSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event: import('./$types').RequestEvent) => {
		const form = await superValidate(event, zod(profileFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		return {
			form
		};
	}
};
;null as any as Actions;
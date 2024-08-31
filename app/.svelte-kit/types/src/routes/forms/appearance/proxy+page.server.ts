// @ts-nocheck
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { appearanceFormSchema } from "./appearance-form.svelte";

export const load = async () => {
	return {
		form: await superValidate(zod(appearanceFormSchema)),
	};
};

export const actions = {
	default: async (event: import('./$types').RequestEvent) => {
		const form = await superValidate(event, zod(appearanceFormSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		return {
			form,
		};
	},
};
;null as any as PageServerLoad;;null as any as Actions;
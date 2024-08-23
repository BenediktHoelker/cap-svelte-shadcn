import cds from '@sap/cds';

const srv = await cds.connect.to('BookshopService');
const Tasks = srv.entities('eon').Tasks;

export async function load() {
	const tasks = await SELECT.from(Tasks)
		// .where(`title like '%${search}%'`)
		.limit(5)
		.orderBy('title');
	return {
		tasks
	};
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const object = { ID: data.get('id'), title: data.get('title') };
		await UPSERT(object).into(Tasks);
	}
};

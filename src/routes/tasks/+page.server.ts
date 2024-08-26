import cds from '@sap/cds';

const srv = await cds.connect.to('BookshopService');
const Tasks = srv.entities('eon').Tasks;

export async function load({ url }) {
	const { searchParams } = url;
	const search = '%' + searchParams.get('search') + '%' || '%';
	const skip = Number(searchParams.get('skip')) || 0;
	const top = Number(searchParams.get('top')) || 50;
	const orderBy = searchParams.get('orderBy') || 'id';
	const orderDir = searchParams.get('orderDir') || 'asc';

	const tasksItemCount = "await cds.run('SELECT count(*) from eon_Tasks')";
	const tasks = await SELECT.from(Tasks).where`title like ${search}`
		.limit(top, skip)
		.orderBy(orderBy + ' ' + orderDir);

	return {
		tasks,
		tasksItemCount
	};
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const object = { ID: data.get('id'), title: data.get('title') };
		await UPSERT(object).into(Tasks);
	}
};

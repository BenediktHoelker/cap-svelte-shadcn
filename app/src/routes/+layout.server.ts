import cds from '@sap/cds';

const srv = await cds.connect.to('BookshopService');
const Tasks = srv.entities('eon').Tasks;

export async function load({ url }) {
	const { searchParams } = url;
	const search = searchParams.get('search') ? '%' + searchParams.get('search') + '%' : '%';
	// const filter = searchParams.get('filter') ? '%' + searchParams.get('filter') + '%' : '%';
	const skip = Number(searchParams.get('skip')) || 0;
	const top = Number(searchParams.get('limit')) || Number(searchParams.get('top')) || 10;
	const orderBy = searchParams.get('order_by') || 'id';
	const orderDir = searchParams.get('order_dir') || 'asc';

	const tasksItemCountRes = await cds.run(
		`SELECT count(*) from eon_Tasks where title like '${search}'`
	);
	// TODO: Make reliable
	const taskItemCount = tasksItemCountRes[0]['count(*)'];
	const tasks = await SELECT.from(Tasks).where`title like ${search}`
		.limit(top, skip)
		.orderBy(orderBy + ' ' + orderDir);

	return {
		tasks,
		taskItemCount: taskItemCount
	};
}

// export const actions = {
// 	default: async ({ request }) => {
// 		const data = await request.formData();
// 		const object = { ID: data.get('id'), title: data.get('title') };
// 		await UPSERT(object).into(Tasks);
// 	}
// };

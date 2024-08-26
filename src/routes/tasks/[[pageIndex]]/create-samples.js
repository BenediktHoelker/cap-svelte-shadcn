import { faker } from '@faker-js/faker';

let ID = 1;
const statusArray = ['todo', 'done', 'in-progress', 'backlog', 'canceled'];
const priorityArray = ['low', 'medium', 'high'];
const labelArray = ['bug', 'feature', 'documentation'];

export const createSamples = (...lengths) => {
	const createSamplesLevel = (depth = 0) => {
		const length = lengths[depth];
		return [...Array(length)].map(() => {
			return {
				...getSample(),
				...(lengths[depth + 1] !== undefined ? { children: createSamplesLevel(depth + 1) } : {})
			};
		});
	};
	return createSamplesLevel();
};

const getSample = () => {
	return {
		id: `TASK-${(ID += 1)}`,
		title: faker.lorem.sentence(),
		status: statusArray[Math.floor(Math.random() * statusArray.length)],
		label: labelArray[Math.floor(Math.random() * labelArray.length)],
		priority: priorityArray[Math.floor(Math.random() * priorityArray.length)]
	};
};

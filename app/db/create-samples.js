import { faker } from '@faker-js/faker';
import fs from 'fs';

const statusArray = ['todo', 'done', 'in-progress', 'backlog', 'canceled'];
const priorityArray = ['low', 'medium', 'high'];
const labelArray = ['bug', 'feature', 'documentation'];

export const createSamples = (count) => {
	const samples = [...Array(count).keys()].map((n) => getSample(n));
	return samples;
};

const getSample = (counter) => {
	return {
		id: `TASK-${counter}`,
		title: faker.lorem.sentence(),
		status: statusArray[Math.floor(Math.random() * statusArray.length)],
		label: labelArray[Math.floor(Math.random() * labelArray.length)],
		priority: priorityArray[Math.floor(Math.random() * priorityArray.length)]
	};
};

const numberOfSamples = 10000;
const filePath = './db/data/eon-Tasks.json';
const samples = createSamples(10000);
const json = JSON.stringify(samples);

fs.writeFileSync(filePath, json, 'utf8');
console.log('Created ' + numberOfSamples + ' rows successfully.');

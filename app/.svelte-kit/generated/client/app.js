export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8')
];

export const server_loads = [];

export const dictionary = {
		"/": [~3],
		"/forms/[slug]": [~4,[2]],
		"/forms/[slug]/account": [~5,[2]],
		"/forms/[slug]/appearance": [~6,[2]],
		"/forms/[slug]/display": [~7,[2]],
		"/forms/[slug]/notifications": [~8,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';
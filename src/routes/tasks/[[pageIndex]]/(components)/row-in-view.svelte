<script>
	import { onMount, onDestroy } from 'svelte';

	export let rowAttrs;
	export let root = undefined;

	let observer;

	let inView = false;
	let this_element;

	const handler = (e) => {
		inView = e[0].isIntersecting;
	};

	onMount(() => {
		observer = new IntersectionObserver(handler, { root });
		observer.observe(this_element);
	});
	onDestroy(() => {
		observer?.unobserve(this_element);
		observer?.disconnect();
	});
</script>

<tr bind:this={this_element} {...rowAttrs}>
	<slot {inView} />
</tr>

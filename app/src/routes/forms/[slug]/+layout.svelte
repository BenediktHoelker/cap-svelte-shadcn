<script lang="ts">
	import SidebarNav from './(components)/sidebar-nav.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	import { type Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { Task } from '../../(data)/schemas.js';
	import InfiniteScroll from './infinite-scroll.svelte';
	import { goto } from '$app/navigation';

	const sidebarNavItems = [
		{
			title: 'Profile',
			href: '/forms'
		},
		{
			title: 'Account',
			href: '/forms/account'
		},
		{
			title: 'Appearance',
			href: '/forms/appearance'
		},
		{
			title: 'Notifications',
			href: '/forms/notifications'
		},
		{
			title: 'Display',
			href: '/forms/display'
		}
	];

	const tasks: Writable<Task[]> = getContext('tasks');
	$: items = $tasks.map((task) => ({ title: task.title, href: '/forms/display' }));

	let scrollSize = 20;
	let pageIndex = 1;

	$: top = scrollSize * pageIndex;
</script>

<!-- <div class="md:hidden">
	<enhanced:img src={FormsLight} alt="Forms" class="block dark:hidden" />
	<enhanced:img src={FormsDark} alt="Forms" class="hidden dark:block" />
</div> -->
<div class="hidden space-y-6 p-10 pb-16 md:block">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
		<p class="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<aside class="-mx-4 lg:w-1/5">
			<SidebarNav items={sidebarNavItems} />
		</aside>

		<!-- <aside class="-mx-4 lg:w-1/5">
			<ScrollArea class="h-[600px] rounded-md border-b">
				<SidebarNav {items} />
				<InfiniteScroll
					threshold={100}
					on:loadMore={() => {
						const q = new URLSearchParams();

						pageIndex++;

						// q.set('skip', String(skip));
						q.set('limit', String(top));
						goto(`/forms?${q}`);
					}}
				/>
			</ScrollArea>
		</aside> -->

		<div class="flex-1 lg:max-w-2xl">
			<slot />
		</div>
	</div>
</div>

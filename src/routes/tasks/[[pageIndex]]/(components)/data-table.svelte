<script lang="ts">
	import { get, readable, writable, type Writable } from 'svelte/store';

	import { getContext, onMount } from 'svelte';

	import { browser } from '$app/environment';

	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let stick = false;
	// if (browser) {
	// 	window.addEventListener('scroll', (event) => {
	// 		// console.log(window.scrollY);
	// 		stick = window.scrollY > 0;
	// 		console.log(stick);
	// 	});
	// }

	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import {
		addColumnFilters,
		addHiddenColumns,
		addPagination,
		addSelectedRows,
		addSortBy,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import type { Task } from '../(data)/schemas.js';
	import {
		DataTableCheckbox,
		DataTableColumnHeader,
		DataTablePagination,
		DataTablePriorityCell,
		DataTableRowActions,
		DataTableStatusCell,
		DataTableTitleCell,
		DataTableToolbar
	} from '.';

	import * as Table from '$lib/components/ui/table';

	const tasks: Writable<Task[]> = getContext('tasks');

	const table = createTable(tasks, {
		select: addSelectedRows(),
		sort: addSortBy({
			// serverSide: true,
			toggleOrder: ['asc', 'desc']
		}),
		// ToDo: serverItemCount = Total of server-items => load initially
		page: addPagination({
			// serverSide: true, serverItemCount: writable(200)
		}),
		filter: addTableFilter({
			// serverSide: true,
			fn: ({ filterValue, value }) => {
				return value.toLowerCase().includes(filterValue.toLowerCase());
			}
		}),
		colFilter: addColumnFilters(),
		hide: addHiddenColumns()
	});

	const columns = table.createColumns([
		table.display({
			id: 'select',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected,
					'aria-label': 'Select all'
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);
				return createRender(DataTableCheckbox, {
					checked: isSelected,
					'aria-label': 'Select row',
					class: 'translate-y-[2px]'
				});
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'id',
			header: () => {
				return 'Task';
			},
			id: 'task',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'title',
			header: 'Title',
			id: 'title',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(DataTableTitleCell, {
						value,
						labelValue: row.original.label
					});
				}
				return value;
			}
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			id: 'status',
			cell: ({ value }) => {
				return createRender(DataTableStatusCell, {
					value
				});
			},
			plugins: {
				colFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== 'string') return true;
						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: [],
					render: ({ filterValue }) => {
						return get(filterValue);
					}
				}
			}
		}),
		table.column({
			accessor: 'priority',
			id: 'priority',
			header: 'Priority',
			cell: ({ value }) => {
				return createRender(DataTablePriorityCell, {
					value
				});
			},
			plugins: {
				colFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== 'string') return true;

						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: [],
					render: ({ filterValue }) => {
						return get(filterValue);
					}
				}
			}
		}),
		table.display({
			id: 'actions',
			header: () => {
				return '';
			},
			cell: ({ row }) => {
				if (row.isData() && row.original) {
					return createRender(DataTableRowActions, {
						row: row.original
					});
				}
				return '';
			}
		})
	]);

	const tableModel = table.createViewModel(columns);

	tableModel.pluginStates.page.pageSize.set(50);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = tableModel;

	// let stick = false;
	// let scrollY = 0;
	// let y = 0; //down
	// $: stick = y > 31;
	// $: console.log(`the scrollY is ${scrollY}`);
</script>

<!-- <svelte:window bind:scrollY /> -->

<div class="space-y-4">
	<DataTableToolbar {tableModel} bind:tasks={$tasks} />
	<!-- Solution for sticky header: https://github.com/shadcn-ui/ui/issues/1151#issuecomment-1806990817 -->
	<ScrollArea class="h-[500px] rounded-md border-b">
		<Table.Root {...$tableAttrs}>
			<Table.Body {...$tableBodyAttrs} class="z-10">
				{#if $pageRows.length}
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<!-- <Table.Row {...rowAttrs} class="border-b-2 border-r-2"> -->
							<Table.Row {...rowAttrs}>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs}>
											{#if cell.id === 'task'}
												<div class="w-[80px]">
													<Render of={cell.render()} />
												</div>
											{:else}
												<Render of={cell.render()} />
											{/if}
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
			<!-- thead needs to be below tbody, otherwise the checkbox in sticky header will shine throug. WEIRD BUG! https://stackoverflow.com/questions/47923240/opacity-issue-in-sticky-table-header-structure -->
			<Table.Header class="z-60 bg-secondary sticky top-0 [&_tr]:border-b">
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row class={stick ? 'invisibleBorder' : ''}>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs}>
										{#if cell.id !== 'select' && cell.id !== 'actions'}
											<DataTableColumnHeader {props} {tableModel} cellId={cell.id}>
												<Render of={cell.render()} /></DataTableColumnHeader
											>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
		</Table.Root>
	</ScrollArea>
	<DataTablePagination {tableModel} />
</div>

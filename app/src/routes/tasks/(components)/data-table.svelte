<script lang="ts">
	import { get, type Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

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
	const taskItemCount: Writable<number> = getContext('taskItemCount');

	const table = createTable(tasks, {
		select: addSelectedRows(),
		sort: addSortBy({
			serverSide: true,
			toggleOrder: ['asc', 'desc']
		}),
		// ToDo: serverItemCount = Total of server-items => load initially
		page: addPagination({
			serverSide: true,
			serverItemCount: taskItemCount
		}),
		filter: addTableFilter({
			serverSide: true
			// fn: ({ filterValue, value }) => {
			// 	return value.toLowerCase().includes(filterValue.toLowerCase());
			// }
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

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = tableModel;

	const { sortKeys } = pluginStates.sort;
	const { filterValue } = pluginStates.filter;
	const { filterValues } = pluginStates.colFilter;
	const { pageSize, pageIndex } = pluginStates.page;

	$: {
		const q = new URLSearchParams();
		$sortKeys[0] && q.set('order_by', $sortKeys[0].id);
		$sortKeys[0] && q.set('order_dir', $sortKeys[0].order);
		$filterValue && q.set('search', $filterValue);
		// $filterValues && q.set('filter', $filterValues);
		$pageSize && q.set('limit', String($pageSize));
		$pageSize && $pageIndex && q.set('skip', String($pageSize * $pageIndex));

		if (browser) {
			goto(`/tasks?${q}`);
		}
	}
</script>

<div class="space-y-4">
	<DataTableToolbar {tableModel} bind:tasks={$tasks} />
	<!-- Solution for sticky header: https://github.com/shadcn-ui/ui/issues/1151#issuecomment-1806990817 -->
	<ScrollArea class="h-[340px] rounded-md border-b">
		<Table.Root {...$tableAttrs}>
			<Table.Body {...$tableBodyAttrs}>
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
			<Table.Header class="bg-secondary sticky top-0 [&_tr]:border-b">
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
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

<style>
	.row-placeholder {
		height: 36.667px;
		width: 0px;
	}
</style>

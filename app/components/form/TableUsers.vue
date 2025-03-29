<script setup lang="ts">
const props = defineProps<{
  users: User[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'deleted', id: string): void
}>()

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useAppToast()
const table = useTemplateRef('table')
const rowSelection = ref({})
const globalFilter = ref('')

const columns: TableColumn<User>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all rows'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'username',
    header: 'Username'
  },
  {
    accessorKey: 'firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'birthday',
    header: 'Birthday',
    cell: ({ row }) =>
      new Date(row.getValue('birthday')).toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: { align: 'end' },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions'
            })
        )
      )
  }
]

function getRowItems(row: Row<User>) {
  return [
    { type: 'label', label: 'Actions' },
    {
      label: 'Copy email',
      icon: 'i-lucide-copy',
      onSelect: () => {
        navigator.clipboard.writeText(row.getValue('email'))
        toast.success('Email copied to clipboard.')
      }
    },
    {
      label: 'Edit user',
      icon: 'i-lucide-edit',
      onSelect: () => {
        // Emit or navigate to edit page
        console.log('Edit user:', row.original)
      }
    },
    {
      label: 'Delete user',
      icon: 'i-lucide-trash-2',
      onSelect: async () => {
        try {
          await $fetch(`/api/users/${row.original.id}`, { method: 'DELETE' })
          toast.success('User deleted.')
          emit('deleted', row.original.id)
        } catch {
          toast.error('Failed to delete user.')
        }
      }
    },
    { type: 'separator' },
    {
      label: 'View details',
      icon: 'i-lucide-eye',
      onSelect: () => {
        console.log('Viewing:', row.original)
      }
    }
  ]
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex px-4 py-3.5 border-b border-(--ui-border-accented)">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Search users..." />
    </div>

    <UTable
      ref="table"
      v-model:row-selection="rowSelection"
      v-model:global-filter="globalFilter"
      :loading="loading"
      loading-color="primary"
      loading-animation="carousel"
      :data="users"
      :columns="columns"
    />

    <div class="px-4 py-3.5 border-t border-(--ui-border-accented) text-sm text-(--ui-text-muted)">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
    </div>
  </div>
</template>

<script setup lang="ts">
const users = ref<User[]>([])
const loading = ref(true)
const rowSelection = ref({})
import type { Row } from '@tanstack/vue-table'

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const table = useTemplateRef('table')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useAppToast()

async function fetchUsers() {
  try {
    const response = await $fetch('/api/users')
    if (response && 'data' in response) {
      users.value = response.data
      loading.value = false
    } else {
      users.value = []
      loading.value = false
    }
  } catch (err) {
    logger.error('Failed to fetch users:', err)
  }
}

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
    // ToDo: Use a installed date library for formatting
    cell: ({ row }) => {
      return new Date(row.getValue('birthday')).toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

const globalFilter = ref('')

function getRowItems(row: Row<User>) {
  return [
    { type: 'label', label: 'Actions' },
    {
      label: 'Copy email',
      icon: 'i-lucide-copy',
      onSelect: () => {
        navigator.clipboard.writeText(row.getValue('email')).then(() => {
          logger.info('Email copied to clipboard:', row.getValue('email'))
        })
        toast.success('User data saved successfully.')
      }
    },
    {
      label: 'Edit user',
      icon: 'i-lucide-edit',
      onSelect: () => {
        // placeholder action
        logger.info('Editing user:', JSON.stringify(row.original, null, 2))
      }
    },
    {
      label: 'Delete user',
      icon: 'i-lucide-trash-2',
      onSelect: () => {
        logger.info('Deleting user:', row.original)
        $fetch(`/api/users/${row.original.id}`, {
          method: 'DELETE'
        })
          .then(() => {
            toast.success('User deleted successfully.')
            fetchUsers()
          })
          .catch((error) => {
            toast.error('Failed to delete user.')
          })
      }
    },
    { type: 'separator' },
    {
      label: 'View details',
      icon: 'i-lucide-eye',
      onSelect: () => {
        // placeholder action
        logger.info('Viewing user:', JSON.stringify(row.original, null, 2))
      }
    }
  ]
}

onMounted(fetchUsers)
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

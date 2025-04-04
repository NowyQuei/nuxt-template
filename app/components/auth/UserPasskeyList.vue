<script setup lang="ts">
import type { TableColumn } from '@tanstack/vue-table'
import type { z } from 'zod'

defineExpose({ refresh: fetchPasskeys })

const UButton = resolveComponent('UButton')
const passkeys = ref<z.infer<typeof zCredentials>[]>([])
const isLoading = ref(true)

const { session } = useUserSession()
const rowSelection = ref({})

async function fetchPasskeys() {
  isLoading.value = true
  const userId = session.value?.user?.id
  if (!userId) return

  const result = await useSafeFetch(`/api/passkeys/${userId}`)
  if (Array.isArray(result)) {
    passkeys.value = result
  }

  isLoading.value = false
}

onMounted(fetchPasskeys)

async function onDelete(id: string) {
  const success = await useSafeDelete(`/api/passkeys/${id}`)
  if (success !== null) {
    passkeys.value = passkeys.value.filter((p) => p.id !== id)
    $toast.success('Passkey deleted.')
  }
}

const columns: TableColumn<z.infer<typeof zCredentials>>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'createdAt',
    header: 'Registered At',
    cell: ({ row }) =>
      new Date(row.getValue('createdAt')).toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
  },
  {
    id: 'delete',
    header: '',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-right' },
        h(UButton, {
          icon: 'i-lucide-trash',
          color: 'red',
          variant: 'ghost',
          class: 'ml-auto',
          'aria-label': 'Delete passkey',
          onClick: () => onDelete(row.original.id)
        })
      )
  }
]
</script>

<template>
  <UiCard class="max-w-md">
    <template #header>
      <slot name="header">
        <h2 class="text-lg font-semibold text-center">Passkeys</h2>
      </slot>
    </template>

    <div v-if="passkeys.length > 0">
      <UTable
        ref="table"
        v-model:row-selection="rowSelection"
        :loading="isLoading"
        loading-color="primary"
        loading-animation="carousel"
        :data="passkeys"
        :columns="columns"
      />
    </div>

    <p v-else-if="!isLoading" class="text-sm text-gray-500 text-center">
      No passkeys registered yet.
    </p>

    <template #footer>
      <slot name="footer">
        <p class="text-center">Add a Passkey</p>
        <FormAddPasskey
          class="mt-4"
          :existing-names="passkeys.map((p) => p.name)"
          @registered="fetchPasskeys"
        />
      </slot>
    </template>
  </UiCard>
</template>

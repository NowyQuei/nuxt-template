<script setup lang="ts">
import type { TableColumn } from '@tanstack/vue-table'
import type { z } from 'zod'
defineExpose({ refresh: fetchPasskeys })

const UButton = resolveComponent('UButton')
const passkeys = ref<z.infer<typeof zCredentials>[]>([])
const isLoading = ref(true)

const { session } = useUserSession()

const table = useTemplateRef('table')
const rowSelection = ref({})
const globalFilter = ref('')

async function fetchPasskeys() {
  isLoading.value = true
  try {
    const result = await $fetch(`/api/passkeys/${session.value?.user?.id}`)
    passkeys.value = result
  } catch (err) {
    logger.error('Failed to load passkeys:', err)
    $toast.error('Could not load passkeys.')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPasskeys)

async function onDelete(id: string) {
  try {
    await $fetch(`/api/passkeys/${id}`, { method: 'DELETE' })
    passkeys.value = passkeys.value.filter((p) => p.id !== id)
    $toast.success('Passkey deleted.')
  } catch (err) {
    logger.error('Failed to delete passkey:', err)
    $toast.error('Could not delete passkey.')
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

    <UTable
      ref="table"
      v-model:row-selection="rowSelection"
      :loading="isLoading"
      loading-color="primary"
      loading-animation="carousel"
      :data="passkeys"
      :columns="columns"
    />

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

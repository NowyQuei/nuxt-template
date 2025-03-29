<script setup lang="ts">
const users = ref<User[]>([])
const loading = ref(true)

async function fetchUsers() {
  try {
    const response = await $fetch('/api/users')
    users.value = response?.data || []
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

function handleUserDeleted(id: string) {
  users.value = users.value.filter((u) => u.id !== id)
}
</script>

<template>
  <FormTableUsers :users="users" :loading="loading" @deleted="handleUserDeleted" />
</template>

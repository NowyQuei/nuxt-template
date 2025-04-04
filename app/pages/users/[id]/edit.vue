<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const userId = route.params.id as string

const user = ref<Partial<zUser> | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  const fetched = await useSafeFetch<zUser>(`/api/users/${userId}`)
  user.value = fetched
  isLoading.value = false
})

async function updateUser(data: Partial<zUser>) {
  if (!userId) return

  const sanitized = { ...data }
  if (!sanitized.password) delete sanitized.password

  const hasChanged =
    user.value &&
    (sanitized.username !== user.value.username ||
      sanitized.firstName !== user.value.firstName ||
      sanitized.lastName !== user.value.lastName ||
      sanitized.email !== user.value.email ||
      new Date(sanitized.birthday!).toISOString() !== new Date(user.value.birthday!).toISOString())

  if (!hasChanged) {
    $toast.info('Nothing changed.')
    throw new Error('No changes')
  }

  const updated = await useSafePatch(`/api/users/${userId}`, sanitized)

  if (updated) {
    router.push('/users')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <UiCard v-if="isLoading" class="max-w-md">
      <div class="text-center py-12">Loading user...</div>
    </UiCard>

    <FormUser v-else-if="user" :user="user" :submit="updateUser" form-title="Edit User">
      <template #header>
        <h2 class="text-lg font-bold text-center text-primary">Edit User: {{ user.username }}</h2>
      </template>

      <template #footer>
        <p class="text-sm text-gray-500 text-center">Changes are saved securely.</p>
      </template>
    </FormUser>
  </div>
</template>

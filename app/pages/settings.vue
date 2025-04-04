<script setup lang="ts">
const isLoaded = ref(false)
const session = ref()
const fetchSession = ref<() => Promise<void>>()

onMounted(async () => {
  const { session: s, fetch } = useUserSession()
  session.value = s.value
  fetchSession.value = fetch
  isLoaded.value = true
})

// Submit handler for updating user info
async function updateUser(data: Partial<zUser>) {
  const userId = session.value?.user?.id
  if (!userId) {
    $toast.error('No user ID found.')
    return
  }

  const sanitizedData = { ...data }
  if (!sanitizedData.password) {
    delete sanitizedData.password
  }
  if (sanitizedData.role) {
    delete sanitizedData.role
  }

  const sessionUser = session.value.user
  const hasChanged =
    sanitizedData.username !== sessionUser.username ||
    sanitizedData.firstName !== sessionUser.firstName ||
    sanitizedData.lastName !== sessionUser.lastName ||
    sanitizedData.email !== sessionUser.email ||
    new Date(sanitizedData.birthday!).toISOString() !== new Date(sessionUser.birthday).toISOString()

  if (!hasChanged) {
    $toast.info('Nothing changed.')
    throw new Error('No changes')
  }

  logger.info('Sending this data to API:', sanitizedData)
  await useSafePatch(`/api/users/${userId}`, sanitizedData)
  await fetchSession?.value?.()
  $toast.success('Profile updated.')

  if ('password' in data) {
    data.password = ''
  }
}
</script>

<template>
  <div class="flex flex-col lg:flex-row w-full min-h-screen">
    <!-- Left column -->
    <div class="w-full lg:w-1/4 p-4">
      <p class="text-sm text-gray-600">Left sidebar content</p>
    </div>

    <!-- Middle column -->
    <div class="w-full lg:w-1/2 p-6 flex justify-center items-center">
      <FormUser
        v-if="isLoaded"
        :user="session?.user"
        :submit="updateUser"
        formTitle="User Settings"
      >
        <template #header>
          <h2 class="text-lg font-bold text-center text-primary">Update Your Profile</h2>
        </template>

        <template #footer>
          <p class="text-sm text-gray-500 text-center">Your settings are stored securely.</p>
        </template>
      </FormUser>
    </div>

    <!-- Right column -->
    <div class="w-full lg:w-1/4 p-4 flex justify-center items-center">
      <AuthUserPasskeyList />
    </div>
  </div>
</template>

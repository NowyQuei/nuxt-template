<script setup lang="ts">
import { useUserSession } from '#imports'

const isLoaded = ref(false)
const { loggedIn, session, fetch } = useUserSession()

onMounted(() => {
  isLoaded.value = true
})

// Submit handler for updating user info
async function updateUser(data: Partial<zUser>) {
  const userId = session.value?.user?.id
  if (!userId) {
    $toast.error('No user ID found.')
    return
  }

  // Don't send empty passwords
  const sanitizedData = { ...data }
  if (!sanitizedData.password) {
    delete sanitizedData.password
  }

  try {
    await $fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: sanitizedData
    })

    await fetch()
    $toast.success('Profile updated.')

    // Reset password field after update
    if ('password' in data) {
      data.password = ''
    }
  } catch (error) {
    logger.error('Update failed:', error)
    $toast.error('Failed to update your profile.')
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
      <FormUser :user="session?.user" :submit="updateUser" formTitle="User Settings">
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

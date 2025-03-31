<script setup lang="ts">
const isLoaded = ref(false)
const { loggedIn, user, session } = useUserSession()

onMounted(() => {
  isLoaded.value = true
})

const isLoggedIn = ref(false)

watch(
  () => session.value.user?.username,
  (newValue) => {
    isLoggedIn.value = !!newValue
  }
)
</script>

<template>
  <div v-show="isLoaded" class="flex flex-col lg:flex-row w-full min-h-screen">
    <!-- Left column -->
    <div class="w-full lg:w-1/4 p-4">
      <p class="text-sm text-gray-600">Left sidebar content</p>
    </div>

    <!-- Middle column -->
    <div class="w-full lg:w-1/2 p-6 flex justify-center items-center">
      <UiCard v-if="loggedIn" class="w-full max-w-xl">
        <template #header>
          <h1 class="text-lg font-semibold text-center">Home</h1>
        </template>

        <div v-if="loggedIn">
          <h1 class="text-xl font-semibold text-center mb-2">Welcome, {{ user?.username }}!</h1>
          <p class="text-sm text-center mb-2">Logged in since: {{ session.loggedInAt }}</p>
        </div>
        <div v-else>
          <p class="text-center">Welcome to the home page</p>
        </div>

        <template #footer>
          <p class="text-xs text-center text-gray-500 mb-2">Session ID: {{ session.id }}</p>
        </template>
      </UiCard>
      <AuthLogin v-else />
    </div>

    <!-- Right column -->
    <div class="w-full lg:w-1/4 p-4">
      <p class="text-sm text-gray-600">Right sidebar content</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLoaded = ref(false)
const { loggedIn, session, clear } = useUserSession()

onMounted(() => {
  isLoaded.value = true
})

function logout() {
  clear()
  $toast.success('Logged out successfully.')
}

const navigationItems = computed(() => {
  const left = [{ label: 'Home', icon: 'i-lucide-home', to: '/' }]
  const middle = []
  const right = [{ label: 'Dark Mode', slot: 'darkMode', type: 'button' }]

  if (loggedIn.value) {
    right.unshift(
      { label: 'Settings', icon: 'i-lucide-settings', to: '/settings' },
      { label: 'Login', slot: 'loginButton', type: 'button' }
    )
  } else {
    right.unshift({ label: 'Registration', icon: 'i-lucide-key-round', to: '/registration' })
  }

  if (session.value?.user?.role === 'admin') {
    left.push({ label: 'Users', icon: 'i-lucide-users', to: '/users' })
  }

  return [left, middle, right]
})
</script>

<template>
  <ClientOnly>
    <div v-show="isLoaded && isLoaded">
      <UNavigationMenu :items="navigationItems" class="w-full mb-3 px-2">
        <!-- ✅ Login Button Slot -->
        <template v-if="loggedIn" #loginButton>
          <UButton icon="i-lucide-log-in" @click="logout" color="primary" variant="link" />
        </template>

        <!-- ✅ Dark Mode Toggle -->
        <template #darkMode>
          <UiColorModeButton />
        </template>
      </UNavigationMenu>
    </div>
  </ClientOnly>
</template>

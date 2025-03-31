<script setup lang="ts">
const isLoaded = ref(false)
const { loggedIn, session, clear } = useUserSession()
const toast = useToast()

onMounted(() => {
  isLoaded.value = true
})

function logout() {
  clear()
  toast.add({
    title: 'Logged out',
    description: 'You have been logged out successfully.',
    color: 'success'
  })
}

const navigationItems = computed(() => {
  const left = [{ label: 'Home', icon: 'i-lucide-home', to: '/' }]
  const middle = []
  const right = [{ label: 'Dark Mode', slot: 'darkMode', type: 'button' }]

  if (loggedIn.value) {
    right.unshift({ label: 'Login', slot: 'loginButton', type: 'button' })
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
  <div v-show="isLoaded">
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
</template>

<script setup lang="ts">
const userName = ref('')
const isLoading = ref(false)
const { authenticate } = useWebAuthn()
const { fetch: fetchUserSession } = useUserSession()
const state = reactive({
  userName: ''
})

async function loginWithPasskey() {
  if (!state.userName) {
    $toast.warning('Please enter your email or username.')
    return
  }

  isLoading.value = true
  try {
    await authenticate(state.userName)
    await fetchUserSession()
    $toast.success('Login successful')
  } catch (e) {
    $toast.error('Login failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UForm :state="state" class="space-y-4" @submit.prevent="loginWithPasskey">
    <UFormField label="Email or Username" name="userName">
      <UInput v-model="state.userName" placeholder="Enter your email or username" />
    </UFormField>
    <UButton type="submit" icon="i-lucide-fingerprint" :loading="isLoading" block>
      Login with Passkey
    </UButton>
  </UForm>
</template>

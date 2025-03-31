<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const { authenticate } = useWebAuthn()
const { fetch: fetchUserSession } = useUserSession()

const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const passwordSchema = v.object({
  username: v.string(),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters'))
})

type PasswordSchema = v.InferOutput<typeof passwordSchema>

const state = reactive<PasswordSchema>({
  username: 'test',
  password: '*gsThXqsAA4_RcWxPEwacCTB'
})

// Password Login
async function loginWithPassword(event: FormSubmitEvent<PasswordSchema>) {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: state.username, password: state.password }
    })

    if (response.data && 'username' in response.data) {
      await fetchUserSession()
      $toast.success('Login successful')
    } else {
      errorMessage.value = 'Invalid username or password.'
    }
  } catch (err) {
    errorMessage.value = '❌ Login failed. Please check your credentials.'
    $toast.error(errorMessage.value)
    logger.error('Login Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Passkey Login
async function loginWithPasskey() {
  if (!state.username) {
    $toast.warning('Please enter your email or username.')
    return
  }

  isLoading.value = true
  try {
    await authenticate(state.username)
    await fetchUserSession()
    $toast.success('Login successful')
  } catch (e) {
    $toast.error('Passkey login failed. Please try again.')
    logger.error('Passkey Login Error:', e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UiCard class="w-full max-w-md mx-auto">
    <template #header>
      <h3 class="text-lg font-semibold text-center">Login</h3>
    </template>

    <UForm :schema="passwordSchema" :state="state" class="space-y-4" @submit="loginWithPassword">
      <UFormField label="Username" name="username" required>
        <UInput
          v-model="state.username"
          class="w-full"
          placeholder="Enter your username or email"
          icon="i-lucide-user"
        />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          :ui="{ trailing: 'pe-1' }"
          icon="i-lucide-lock"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex flex-col gap-2">
        <UButton
          type="submit"
          icon="i-lucide-log-in"
          :loading="isLoading"
          :disabled="!state.username || !state.password"
          block
        >
          Login with Password
        </UButton>

        <UButton
          type="button"
          icon="i-lucide-fingerprint"
          color="secondary"
          :loading="isLoading"
          :disabled="!state.username"
          @click="loginWithPasskey"
          block
        >
          Login with Passkey
        </UButton>
      </div>
    </UForm>

    <template #footer>
      <p class="text-xs text-center text-gray-500 mb-2">Username is needed in both cases</p>
    </template>
  </UiCard>
</template>

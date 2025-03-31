<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const { loggedIn, user, session, fetch } = useUserSession()

const isLoading = ref(false)
const errorMessage = ref('')
const show = ref(false)

const schema = v.object({
  username: v.pipe(v.string()),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters'))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  username: 'test',
  password: '*gsThXqsAA4_RcWxPEwacCTB'
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  logger.debug('Form submitted:', event.data)

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: state.username, password: state.password }
    })

    if (response.data && 'username' in response.data) {
      logger.debug('Login successful:', JSON.stringify(response.data, null, 2))
      await fetch()
      toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    } else {
      errorMessage.value = 'Invalid username or password.'
    }
  } catch (error) {
    errorMessage.value = '❌ Login failed. Please check your credentials.'
    toast.add({ title: 'Error', description: errorMessage.value, color: 'error' })
    logger.error('Login Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center">
    <UiCard variant="soft" class="w-auto">
      <div class="w-[280px] sm:w-[250px]">
        <h3 class="text-lg font-semibold text-center mb-4">Login</h3>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField class="mb-4" label="Username">
            <UInput v-model="state.username" placeholder="Enter your username" class="w-full" />
          </UFormField>

          <UFormField class="mb-4" label="Password">
            <UInput
              v-model="state.password"
              placeholder="Password"
              :type="show ? 'text' : 'password'"
              class="w-full"
              :ui="{ trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="show ? 'Hide password' : 'Show password'"
                  :aria-pressed="show"
                  aria-controls="password"
                  @click="show = !show"
                />
              </template>
            </UInput>
          </UFormField>

          <UButton
            type="submit"
            :loading="isLoading"
            :disabled="!state.username || !state.password"
            icon="i-lucide-log-in"
            block
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </UButton>
        </UForm>

        <p v-if="errorMessage" class="text-red-500 text-sm mt-3 text-center">
          {{ errorMessage }}
        </p>
      </div>
    </UiCard>
  </div>
</template>

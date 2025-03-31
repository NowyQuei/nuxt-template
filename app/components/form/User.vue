<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  user: Partial<z.infer<typeof zUser>>
  submit: (data: Partial<z.infer<typeof zUser>>) => Promise<void>
  formTitle?: string
}>()

const originalUsername = props.user.username
const originalEmail = props.user.email
const { loggedIn } = useUserSession()
const { state, calendarDate, df } = useFormUser(zUser, props.user)
const form = ref()

const {
  checkAvailability: checkUsername,
  available: usernameAvailable,
  checking: checkingUsername
} = useUserAvailability()

const {
  checkAvailability: checkEmail,
  available: emailAvailable,
  checking: checkingEmail
} = useUserAvailability()

const formSchema = computed(() => {
  return loggedIn.value ? zUser.omit({ id: true, password: true }) : zUser.omit({ id: true })
})

async function onUsernameBlur() {
  if (state.username && state.username !== originalUsername) {
    await checkUsername('username', state.username)
  }
}

async function onEmailBlur() {
  if (state.email && state.email !== originalEmail) {
    await checkEmail('email', state.email)
  }
}

async function preSubmitCheck(): Promise<boolean> {
  let ok = true

  if (state.username && state.username !== originalUsername) {
    await checkUsername('username', state.username)
    if (usernameAvailable.value === false) {
      $toast.error('Username is already taken.')
      ok = false
    }
  }

  if (state.email && state.email !== originalEmail) {
    await checkEmail('email', state.email)
    if (emailAvailable.value === false) {
      $toast.error('Email is already in use.')
      ok = false
    }
  }

  return ok
}

async function onSubmit(event: FormSubmitEvent<z.infer<typeof zUser>>) {
  const valid = await preSubmitCheck()
  if (!valid) return

  try {
    await props.submit(event.data)
    $toast.success('User data saved successfully.')
  } catch (error) {
    $toast.error('There was a problem saving the user.')
  }
}

watch(
  () => state.username,
  (newVal) => {
    if (newVal === originalUsername) {
      usernameAvailable.value = null
    }
  }
)

watch(
  () => state.email,
  (newVal) => {
    if (newVal === originalEmail) {
      emailAvailable.value = null
    }
  }
)
</script>

<template>
  <UiCard class="max-w-md">
    <template #header>
      <slot name="header">
        <h2 class="text-lg font-semibold text-center">{{ formTitle || 'User Form' }}</h2>
      </slot>
    </template>

    <UForm ref="form" :state="state" :schema="formSchema" class="space-y-2" @submit="onSubmit">
      <UFormField label="Username" name="username" required>
        <template #description>
          <span v-if="checkingUsername">Checking username...</span>
          <span v-else-if="usernameAvailable === false" class="text-red-500">Username taken</span>
          <span v-else-if="usernameAvailable === true" class="text-green-500"
            >Username available</span
          >
        </template>
        <UInput
          class="w-full"
          v-model="state.username"
          placeholder="Enter your username"
          @blur="onUsernameBlur"
        />
      </UFormField>

      <div class="flex gap-x-4">
        <UFormField label="First Name" name="firstName" required class="w-1/2">
          <UInput class="w-full" v-model="state.firstName" placeholder="Enter first name" />
        </UFormField>
        <UFormField label="Last Name" name="lastName" required class="w-1/2">
          <UInput class="w-full" v-model="state.lastName" placeholder="Enter last name" />
        </UFormField>
      </div>

      <UFormField label="Email" name="email" required>
        <template #description>
          <span v-if="checkingEmail">Checking email...</span>
          <span v-else-if="emailAvailable === false" class="text-red-500">Email in use</span>
          <span v-else-if="emailAvailable === true" class="text-green-500">Email available</span>
        </template>
        <UInput
          class="w-full"
          icon="i-lucide-at-sign"
          v-model="state.email"
          placeholder="Enter your email"
          @blur="onEmailBlur"
        />
      </UFormField>

      <UFormField label="Date of Birth" name="birthday" required>
        <UPopover>
          <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
            {{ state.birthday ? df.format(state.birthday) : 'Select a date' }}
          </UButton>

          <template #content>
            <UCalendar v-model="calendarDate" :week-starts-on="1" class="p-2" />
          </template>
        </UPopover>
      </UFormField>

      <UFormField v-if="!loggedIn" name="createPasskey" class="mt-4 mb-4">
        <UCheckbox
          v-model="state.createPasskey"
          label="Register a passkey after account creation"
        />
      </UFormField>

      <UFormField v-if="state.createPasskey && !loggedIn" label="Passkey Name" name="passkeyName">
        <UInput v-model="state.passkeyName" placeholder="e.g. MacBook Touch ID" class="w-full" />
      </UFormField>

      <FormPasswordInput v-model="state.password" />

      <UButton type="submit" block color="primary"> Save </UButton>
    </UForm>

    <template v-if="!loggedIn" #footer>
      <slot name="footer">
        <p class="text-sm text-gray-500 text-center">
          After registration, you will receive an email to verify your email address.
        </p>
      </slot>
    </template>
  </UiCard>
</template>

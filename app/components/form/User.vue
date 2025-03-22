<script setup lang="ts">
import { z } from 'zod'

const props = defineProps<{
  user: Partial<z.infer<typeof UserSchema>>
  submit: (data: Partial<z.infer<typeof UserSchema>>) => Promise<void>
  formTitle?: string
}>()

const { state, calendarDate, df, isFormValid } = useFormUser(UserSchema, props.user)
const toast = useAppToast()

async function onSubmit(event: FormSubmitEvent) {
  try {
    await props.submit(event.data)
    toast.success('User data saved successfully.')
  } catch (error) {
    toast.error('There was a problem saving the user.')
  }
}
</script>

<template>
  <UiCard class="max-w-md">
    <template #header>
      <slot name="header">
        <h2 class="text-lg font-semibold text-center">{{ formTitle || 'User Form' }}</h2>
      </slot>
    </template>

    <UForm :state="state" class="space-y-2" @submit="onSubmit">
      <UFormField label="Username" name="username" required>
        <UInput class="w-full" v-model="state.username" placeholder="Enter your username" />
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
        <UInput
          class="w-full"
          icon="i-lucide-at-sign"
          v-model="state.email"
          placeholder="Enter your email"
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

      <FormPasswordInput v-model="state.password" />

      <UButton
        class="mt-4"
        type="submit"
        block
        :color="isFormValid ? 'primary' : 'neutral'"
        :disabled="!isFormValid"
      >
        Save
      </UButton>
    </UForm>

    <template #footer>
      <slot name="footer">
        <p class="text-sm text-gray-500 text-center">
          After registration, you will receive an email to verify your email address.
        </p>
      </slot>
    </template>
  </UiCard>
</template>

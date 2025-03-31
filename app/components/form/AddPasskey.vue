<script setup lang="ts">
const props = defineProps<{
  existingNames: string[]
}>()

const emit = defineEmits<{
  (e: 'registered'): void
}>()

const { session, fetch } = useUserSession()
const { register } = useWebAuthn()

const passkeyName = ref('')

async function registerPasskey() {
  const email = session.value?.user?.email

  if (!email) {
    $toast.error('No email found in session.')
    return
  }

  if (!passkeyName.value) {
    $toast.warning('Please enter a name for your passkey.')
    return
  }

  if (props.existingNames.includes(passkeyName.value.trim())) {
    $toast.warning('This name is already in use.')
    return
  }

  try {
    await register({ userName: email, name: passkeyName.value.trim() })
    await fetch()
    $toast.success('Passkey registered successfully.')
    passkeyName.value = ''
    emit('registered')
  } catch (e) {
    $toast.error('Failed to register passkey.')
  }
}
</script>

<template>
  <UForm :state="{ name: passkeyName }" class="space-y-4" @submit.prevent="registerPasskey">
    <div class="flex items-center gap-4">
      <UInput v-model="passkeyName" placeholder="e.g. MacBook Touch ID" class="w-full" />
      <UButton icon="i-lucide-fingerprint" type="submit" color="secondary" block>
        Register Passkey
      </UButton>
    </div>
  </UForm>
</template>

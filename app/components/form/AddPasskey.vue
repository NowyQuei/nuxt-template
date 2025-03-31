<script setup lang="ts">
const { session, fetch } = useUserSession()
const { register } = useWebAuthn()
const toast = useToast()

const passkeyName = ref('')

async function registerPasskey() {
  const email = session.value?.user?.email

  if (!email) {
    toast.add({ title: 'Error', description: 'No email found in session.', color: 'error' })
    return
  }

  if (!passkeyName.value) {
    toast.add({
      title: 'Missing Name',
      description: 'Please enter a name for your passkey.',
      color: 'warning'
    })
    return
  }

  try {
    await register({ userName: email, name: passkeyName.value })
    await fetch()
    toast.add({ title: 'Passkey Registered', color: 'success' })
    passkeyName.value = ''
  } catch (e) {
    toast.add({ title: 'Registration Failed', description: (e as Error).message, color: 'error' })
  }
}
</script>

<template>
  <UForm :state="{ name: passkeyName }" class="space-y-4" @submit.prevent="registerPasskey">
    <UFormField label="Passkey Name" name="name">
      <UInput v-model="passkeyName" placeholder="e.g. MacBook Touch ID" />
    </UFormField>
    <UButton icon="i-lucide-fingerprint" type="submit" block>Register Passkey</UButton>
  </UForm>
</template>

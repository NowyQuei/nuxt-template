<script setup lang="ts">
const props = defineProps<{
  existingNames: string[]
}>()

const emit = defineEmits<{
  (e: 'registered'): void
}>()

const passkeyName = ref('')
const email = ref<string | null>(null)

let fetchSession: (() => Promise<void>) | null = null
let register: ((data: { userName: string; name: string }) => Promise<void>) | null = null

onMounted(() => {
  const { session, fetch } = useUserSession()
  const webAuthn = useWebAuthn()

  email.value = session.value?.user?.email ?? null
  fetchSession = fetch
  register = webAuthn.register
})

async function registerPasskey() {
  if (!email.value) {
    $toast.error('No email found in session.')
    return
  }

  if (!passkeyName.value.trim()) {
    $toast.warning('Please enter a name for your passkey.')
    return
  }

  if (props.existingNames.includes(passkeyName.value.trim())) {
    $toast.warning('This name is already in use.')
    return
  }

  try {
    await register?.({ userName: email.value, name: passkeyName.value.trim() })
    await fetchSession?.()
    $toast.success('Passkey registered successfully.')
    passkeyName.value = ''
    emit('registered')
  } catch (e) {
    logger.error('Passkey registration failed:', e)
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

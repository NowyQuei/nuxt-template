export function useUserAvailability() {
  const checking = ref(false)
  const available = ref<boolean | null>(null)
  const error = ref<string | null>(null)

  async function checkAvailability(field: 'email' | 'username', value: string) {
    checking.value = true
    available.value = null
    error.value = null

    try {
      const result = await $fetch('/api/users/check-availability', {
        query: { [field]: value }
      })
      available.value = result.data?.available ?? null
    } catch (err) {
      error.value = 'Availability check failed'
      logger.error('Availability check failed:', err)
    } finally {
      checking.value = false
    }
  }

  return { checkAvailability, checking, available, error }
}

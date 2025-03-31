export default defineNuxtPlugin(() => {
  const toast = useAppToast()

  // Inject into globalThis so it's available everywhere
  globalThis.$toast = toast
})

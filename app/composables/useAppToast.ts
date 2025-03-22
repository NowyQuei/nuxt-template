export function useAppToast() {
  const toast = useToast()

  const success = (description: string, title = 'Success') =>
    toast.add({ title, description, color: 'success' })

  const error = (description: string, title = 'Error') =>
    toast.add({ title, description, color: 'error' })

  const warning = (description: string, title = 'Warning') =>
    toast.add({ title, description, color: 'warning' })

  const info = (description: string, title = 'Info') =>
    toast.add({ title, description, color: 'info' })

  return { success, error, warning, info }
}

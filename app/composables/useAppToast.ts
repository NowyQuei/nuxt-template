export function useAppToast() {
  const toast = useToast()

  const success = (description: string, title = 'Success') =>
    toast.add({
      title,
      description,
      color: 'success',
      icon: 'i-lucide-check',
      ui: {
        progress: 'hidden'
      },
      duration: 2000
    })

  const error = (description: string, title = 'Error') =>
    toast.add({
      title,
      description,
      color: 'error',
      icon: 'i-lucide-ban',
      ui: {
        progress: 'hidden'
      },
      duration: 2000
    })

  const warning = (description: string, title = 'Warning') =>
    toast.add({
      title,
      description,
      color: 'warning',
      icon: 'i-lucide-triangle-alert',
      ui: {
        progress: 'hidden'
      },
      duration: 2000
    })

  const info = (description: string, title = 'Info') =>
    toast.add({
      title,
      description,
      color: 'info',
      icon: 'i-lucide-info',
      ui: {
        progress: 'hidden'
      },
      duration: 2000
    })

  return { success, error, warning, info }
}

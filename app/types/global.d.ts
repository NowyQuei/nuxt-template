declare global {
  var $toast: ReturnType<typeof import('@/composables/useAppToast')['useAppToast']>
}

export {}

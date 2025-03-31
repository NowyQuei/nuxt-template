<script setup lang="ts">
logger.debug('App component loaded')

const { loggedIn } = useUserSession()

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})
</script>

<template>
  <UApp>
    <MenuMainMenu />
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <StarsBg />
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-in-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(4px); /* 🔥 Softened blur */
}
</style>

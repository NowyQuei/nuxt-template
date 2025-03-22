<script setup lang="ts">
const isLoaded = ref(false)

onMounted(() => {
  isLoaded.value = true
})
</script>

<template>
  <div class="flex justify-center items-center">
    <!-- ✅ Wrap UiCard in a div -->
    <div v-show="isLoaded">
      <UiCard class="max-w-md w-full">
        <template #header>
          <h1 class="text-lg font-semibold text-center">Home</h1>
        </template>

        <p class="text-center">Welcome to the home page</p>

        <template #footer>
          <p class="text-sm text-gray-500 text-center">Welcome to the home page</p>
        </template>
      </UiCard>
    </div>
  </div>
</template>

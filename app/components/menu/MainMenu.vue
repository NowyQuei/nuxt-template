<script setup lang="ts">
const isLoaded = ref(false)

onMounted(() => {
  isLoaded.value = true
})

const items = ref([
  [{ label: 'Home', icon: 'i-lucide-home', to: '/' }],
  [{ label: 'Registration', icon: 'i-lucide-key-round', to: '/registration' }],
  [{ label: 'Dark Mode', slot: 'darkMode', type: 'button' }]
])
</script>

<template>
  <!-- ✅ Wrap in div so v-show works correctly -->
  <div v-show="isLoaded">
    <UNavigationMenu :items="items" class="w-full mb-3 px-2">
      <template #darkMode>
        <UiColorModeButton />
      </template>
    </UNavigationMenu>
  </div>
</template>

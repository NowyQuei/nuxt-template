<template>
  <UCard class="my-3" variant="subtle">
    <!-- ✅ Header Slot -->
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <!-- ✅ Main Content Slot (Fix: Added missing template) -->
    <template v-if="$slots.default">
      <slot />
    </template>

    <!-- ✅ Footer Slot -->
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

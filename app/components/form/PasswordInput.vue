<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const isLoggedIn = useUserSession().loggedIn

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const show = ref(false)

const checkStrength = (str: string) =>
  [
    { regex: /.{12,}/, text: 'At least 12 characters' },
    { regex: /\d/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    { regex: /[\W_]/, text: 'At least 1 special character' }
  ].map((req) => ({ met: req.regex.test(str), text: req.text }))

const strength = computed(() => checkStrength(props.modelValue))
const score = computed(() => strength.value.filter((req) => req.met).length)

const color = computed(() => {
  if (score.value === 0) return 'neutral'
  if (score.value <= 2) return 'error'
  if (score.value === 3) return 'warning'
  return 'success'
})

const text = computed(() => {
  if (score.value === 0) return 'Enter a password'
  if (score.value <= 2) return 'Weak password'
  if (score.value === 3) return 'Medium password'
  return 'Strong password'
})
</script>

<template>
  <div>
    <UFormField label="Password" :required="!isLoggedIn">
      <UInput
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        placeholder="Enter your password"
        :color="color"
        :type="show ? 'text' : 'password'"
        :ui="{ trailing: 'pe-1' }"
        :aria-invalid="score < 5"
        aria-describedby="password-strength"
        class="w-full"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="show ? 'Hide password' : 'Show password'"
            :aria-pressed="show"
            aria-controls="password"
            @click="show = !show"
          />
        </template>
      </UInput>
    </UFormField>

    <div v-if="modelValue.length > 0">
      <UProgress
        class="my-2"
        :color="color"
        :indicator="text"
        :model-value="score"
        :max="5"
        size="sm"
      />

      <p id="password-strength" class="text-sm font-medium my-1">{{ text }}. Must contain:</p>

      <ul class="space-y-1" aria-label="Password requirements">
        <li
          v-for="(req, index) in strength"
          :key="index"
          class="flex items-center gap-0.5 my-2"
          :class="req.met ? 'text-(--ui-success)' : 'text-(--ui-text-muted)'"
        >
          <UIcon
            :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
            class="size-4 shrink-0"
          />

          <span class="text-xs font-light">
            {{ req.text }}
            <span class="sr-only">
              {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { buttonProps } from './props'
import '../../../styles/button.css'

const props = defineProps(buttonProps)
const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void
}>()

const slots = useSlots()
const iconPath = computed(() => (typeof props.icon === 'string' ? props.icon : ''))
</script>

<template>
  <button
    class="st-button"
    :class="[
      `st-button--${type}`,
      `st-button--${size}`,
      { 'is-plain': plain, 'is-round': round, 'is-circle': circle, 'is-disabled': disabled || loading },
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <svg v-if="loading" class="st-button__spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="42 15" />
    </svg>
    <svg
      v-else-if="iconPath"
      class="st-button__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path :d="iconPath" />
    </svg>
    <component :is="icon" v-else-if="icon && !iconPath" class="st-button__icon" />
    <span v-if="slots.icon && !icon" class="st-button__icon"><slot name="icon" /></span>
    <span v-if="$slots.default" class="st-button__text"><slot /></span>
  </button>
</template>

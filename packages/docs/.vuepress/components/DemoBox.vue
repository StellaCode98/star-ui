<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="demo-box">
    <div class="demo-box__header">
      <span class="demo-box__title">{{ title }}</span>
      <span v-if="description" class="demo-box__desc">{{ description }}</span>
    </div>
    <div class="demo-box__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.demo-box {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
}

.demo-box__header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px dashed var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.demo-box__title {
  font-weight: 600;
  font-size: 14px;
}

.demo-box__desc {
  font-size: 13px;
  color: var(--vp-c-text-mute);
}

.demo-box__body {
  padding: 20px 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>

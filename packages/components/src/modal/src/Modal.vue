<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useModalVisible } from './useModalVisible'
import { modalProps } from './props'
import '../../../styles/modal.css'

const props = defineProps(modalProps)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'close'): void
  (e: 'closed'): void
  (e: 'mask-click', evt: MouseEvent): void
}>()

const { close } = useModalVisible(props, emit)

// SSR 与客户端水合期间 Teleport 的目标锚点尚未就绪，直接传送会导致
// 水合不匹配（如 VuePress 文档站直开页面时白屏）。先原位渲染（此时
// v-model 为 false，内容仅一个注释节点），挂载完成后再启用传送。
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

function onMaskClick(evt: MouseEvent) {
  emit('mask-click', evt)
  if (props.maskClosable) close()
}
</script>

<template>
  <Teleport to="body" :disabled="!mounted">
    <Transition name="st-modal" @after-enter="emit('opened')" @after-leave="emit('closed')">
      <div
        v-if="modelValue"
        class="st-modal"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'dialog'"
      >
        <div v-if="mask" class="st-modal__mask" @click="onMaskClick($event)" />
        <div class="st-modal__wrap" @click.self="onMaskClick($event)">
          <div class="st-modal__dialog" :class="`st-modal__dialog--${size}`" role="document">
            <header v-if="title || closable" class="st-modal__header">
              <h3 class="st-modal__title">{{ title }}</h3>
              <button v-if="closable" type="button" class="st-modal__close" aria-label="关闭" @click="close()">×</button>
            </header>
            <div class="st-modal__body"><slot /></div>
            <footer v-if="$slots.footer" class="st-modal__footer" :class="`is-${footerAlign}`">
              <slot name="footer" :close="close" />
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

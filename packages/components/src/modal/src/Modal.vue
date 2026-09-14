<script setup lang="ts">
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

function onMaskClick(evt: MouseEvent) {
  emit('mask-click', evt)
  if (props.maskClosable) close()
}
</script>

<template>
  <Teleport to="body">
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

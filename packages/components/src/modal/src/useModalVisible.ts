import { watch, onBeforeUnmount, getCurrentInstance } from 'vue'

export interface ModalVisibleProps {
  modelValue: boolean
  lockScroll: boolean
  escClosable: boolean
}

export type ModalVisibleEmits = {
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}

/**
 * v-model 同步、ESC 关闭与滚动锁定。
 * 弹框显隐的副作用统一收口在这里。
 */
export function useModalVisible(props: ModalVisibleProps, emit: ModalVisibleEmits) {
  let scrollLockCount = 0

  // SSR（如 VuePress 文档站构建）没有 document，DOM 副作用只应在浏览器执行
  const inBrowser = typeof document !== 'undefined'

  function open() {
    if (props.modelValue) return
    emit('update:modelValue', true)
  }

  function close() {
    if (!props.modelValue) return
    emit('update:modelValue', false)
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }

  watch(
    () => props.modelValue,
    (visible) => {
      if (visible) {
        emit('open')
        if (inBrowser && props.lockScroll && scrollLockCount++ === 0) {
          document.body.classList.add('st-modal--locked')
        }
        if (inBrowser && props.escClosable) document.addEventListener('keydown', onKeydown)
      } else {
        emit('close')
        if (inBrowser && props.lockScroll && --scrollLockCount <= 0) {
          scrollLockCount = 0
          document.body.classList.remove('st-modal--locked')
        }
        if (inBrowser) document.removeEventListener('keydown', onKeydown)
      }
    },
    { immediate: true },
  )

  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      if (!inBrowser) return
      if (props.lockScroll && scrollLockCount > 0) document.body.classList.remove('st-modal--locked')
      document.removeEventListener('keydown', onKeydown)
    })
  }

  return { open, close }
}

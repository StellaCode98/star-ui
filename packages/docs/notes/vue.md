# Vue

## Vue 2 响应式原理

结论：**Vue 2 用 `Object.defineProperty` 把 data 里的属性逐个转成 getter/setter，读取时收集依赖、赋值时通知更新**。

这带来三个先天缺陷，面试与实战都常踩：

- **新增/删除属性不响应**：`this.obj.newKey = 1` 界面不动，必须 `this.$set(this.obj, 'newKey', 1)`；
- **数组下标赋值与 length 修改不响应**：`this.arr[0] = 1` 无效，要用 `this.$set(this.arr, 0, 1)` 或变异方法（`push`/`splice`，Vue 2 重写了它们）；
- 需要递归遍历整个 data，初始化大对象成本高。

`Vue.set` / `this.$delete` 就是官方给的补丁方法。

## Vue 3 响应式原理

Vue 3 改用 `Proxy` 代理整个对象，懒代理嵌套属性（访问到才深层响应），`ref` 包装原始值为 `{ value }` 对象以便追踪。数据变更 → 触发依赖该数据的副作用（组件重渲染、`watch`、`computed`）→ 在微任务队列中批量刷新（同 tick 内多次修改只渲染一次）。

```js
const count = ref(0)
const double = computed(() => count.value * 2)  // 惰性求值 + 缓存
watch(count, (val, old) => { /* 副作用 */ })     // 默认浅层监听
```

解构会丢失响应性（拿到的是值的拷贝），需要 `toRefs(obj)` 或 `reactive` 整体传递：

```js
const state = reactive({ a: 1 })
const { a } = state      // a 不再是响应式 ✗
const state2 = reactive({ a: 1 })
const a2 = toRef(state2, 'a')  // 保持连接 ✓
```

## Vue 2 vs Vue 3 核心对比

| 维度 | Vue 2 | Vue 3 |
| --- | --- | --- |
| 响应式 | `Object.defineProperty`，有 $set 补丁 | `Proxy`，新增删除属性天然响应 |
| API 风格 | Options API（data/methods 分家） | Composition API（`<script setup>`，按功能组织） |
| 生命周期 | `beforeCreate` / `created` / `mounted` … | `setup` 取代前两个，其余加 `on` 前缀 |
| 根节点 | 模板必须有单根节点 | 支持多根节点（Fragment） |
| 复用逻辑 | mixin（来源不明、易命名冲突） | composables（来源清晰、可 tree-shaking） |
| TypeScript | 支持弱（this 推导困难） | 源码重写为 TS，类型推导一流 |
| 性能 | — | 编译期静态提升、Patch Flag、更快的 diff（最长递增子序列） |
| 新组件 | — | `Teleport`（传送门）、`Suspense`、`Fragment` |
| v-model | prop `value` + 事件 `input` | prop `modelValue` + 事件 `update:modelValue`，支持多个 `v-model:title` |

**Options API 与 Composition API 本质是同一套响应式系统，只是组织代码的方式不同**。小组件 Options 也清晰；逻辑多、需要复用时 Composition 优势明显。

## 生命周期对照

Vue 3 的名字就是 Vue 2 加 `on` 前缀，只有开头两个被 `setup` 本身取代：

| Vue 2 | Vue 3 (`<script setup>`) | 时机与用途 |
| --- | --- | --- |
| beforeCreate / created | `setup`（本身） | 数据初始化、最早发请求的位置 |
| beforeMount | onBeforeMount | 挂载前 |
| mounted | onMounted | **DOM 可用**：初始化图表、拿元素尺寸、发请求 |
| beforeUpdate | onBeforeUpdate | 数据变了、DOM 还没更新 |
| updated | onUpdated | DOM 已同步 |
| beforeDestroy | onBeforeUnmount | 卸载前 |
| destroyed | onUnmounted | 清理定时器、解绑事件 |

KeepAlive 独有 `onActivated` / `onDeactivated` 对应缓存的激活与休眠，`onDeactivated` 里同样要做清理。

## 组件通信

| 方式 | 场景 |
| --- | --- |
| props / emit | 父子标准通道，「props 向下、事件向上」 |
| v-model | `modelValue` prop + `update:modelValue` 事件的语法糖（Vue 2 是 `value` + `input`），双向表单控件 |
| provide / inject | 跨层级注入，适合主题、语言等全局上下文 |
| ref + defineExpose | 父调子的方法，子需显式暴露（Vue 2 子组件整个 this 可访问） |
| 事件总线 | Vue 2 用 `new Vue()` 当总线；Vue 3 移除了 `$on`，改用 mitt 等第三方库 |
| 状态库 | Vue 2 配 Vuex，Vue 3 配 Pinia；跨页面、跨组件共享业务状态 |

单向数据流是底线：子组件永远不改 props，要改就 emit 回去由父修改。

## 组合式 API 组织

`<script setup>` 是标准写法。逻辑按「功能」而非「选项类型」分组，配合 composables 实现逻辑复用（替代 Vue 2 的 mixin）：

```vue
<script setup lang="ts">
import { useMouse } from './useMouse'

const { x, y } = useMouse()
</script>
```

```ts
// useMouse.ts —— 一个 composable 一份职责
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  const update = (e: MouseEvent) => { x.value = e.clientX; y.value = e.clientY }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return { x, y }
}
```

## 常见易错点

- `v-if` 与 `v-show`：前者真增删节点（切换开销大，条件不常变用），后者 `display: none`（初始开销大，频繁切换用）；
- `v-for` 必须绑 `key` 且不要用 index（乱序时导致状态错位复用），`v-for` 与 `v-if` 不写同一节点；Vue 2 中同节点 `v-for` 优先级高于 `v-if`，Vue 3 相反，行为不一致更容易踩坑；
- `watch` 监听对象要 `deep: true`，立即执行加 `immediate: true`；
- `nextTick`：改数据后等待 DOM 更新完成（Vue 的 DOM 更新是异步微任务），操作更新后的 DOM 前必须 await；
- 组件上的静态 class 会合并到根元素，`$attrs`（含 class/style）默认落在根元素，多根组件需 `inheritAttrs: false` 手动指定；
- Vue 2 专有陷阱：数组/对象变更不响应时先想到 `$set`；filter 在 Vue 3 已移除，改用方法或计算属性。

## 性能相关

- 大列表用 `v-memo` 或虚拟滚动（`vue-virtual-scroller` 等）；
- 路由组件懒加载 `() => import('./views/Foo.vue')` 配合 Webpack/Vite 分包；
- `shallowRef` / `markRaw` 跳过深层响应（大对象、ECharts 实例等第三方类必须 `markRaw`，本库 `StChart` 内部即如此处理）；
- `computed` 有缓存，模板与方法调用优先 computed；
- 无需响应式的常量数据放 `setup` 外或用 `markRaw`，避免被代理。

# JavaScript

## 数据类型与类型转换

七种原始类型（`string` / `number` / `bigint` / `boolean` / `undefined` / `symbol` / `null`）加上对象类型。判断类型优先用 `typeof`（原始类型）和 `Array.isArray`（数组）；`instanceof` 跨 iframe 会失效，`Object.prototype.toString.call()` 最准确但可读性差。

经典的相等比较规则：

```js
null == undefined   // true，且 null 只与 undefined 宽松相等
NaN === NaN         // false，判 NaN 用 Number.isNaN
[] == ![]           // true：![] 是 false → '' == 0 → 0 == 0
```

对象转原始值依次尝试 `Symbol.toPrimitive` → `valueOf` → `toString`，所以 `{} + 1` 与 `[1,2] + ''` 的结果常反直觉，拼接场景一律先显式 `String()`。

## 作用域与闭包

`let` / `const` 是块级作用域，`var` 是函数作用域且存在变量提升（值为 `undefined`）。闭包指内层函数引用了外层作用域的变量，使其在外层执行结束后仍存活：

```js
function counter() {
  let count = 0
  return () => ++count
}
const inc = counter()
inc() // 1
inc() // 2 —— count 被闭包持有，不会回收
```

典型应用：私有变量、柯里化、防抖节流。注意大对象被闭包持有会阻止 GC，长期存活的闭包里别挂不必要的引用。

经典的 `var` 循环问题及修复：

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))  // 3 3 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i))  // 0 1 2
```

## 原型与继承

属性查找沿原型链（对象 → 原型 → 原型的原型 → … → `Object.prototype` → `null`）逐级向上。`class` 是原型继承的语法糖，`extends` 内部等价于寄生组合式继承：

```js
class Animal {
  constructor(name) { this.name = name }
  speak() { console.log(`${this.name} 发声`) }
}
class Dog extends Animal {
  speak() { super.speak(); console.log('汪汪') }
}
```

要点：实例方法放在原型上（共享、省内存），自身状态放 `this` 上；`Object.create(proto)` 以指定原型创建对象；`hasOwnProperty` 判自有属性，`in` 操作符含原型链。

## this 指向

`this` 在函数**调用时**确定，与定义位置无关：

| 调用方式 | this 指向 |
| --- | --- |
| `obj.fn()` | obj |
| `fn()`（严格模式） | undefined |
| `new Fn()` | 新实例 |
| `fn.call(ctx)` / `apply` / `bind` | 指定的 ctx |
| 箭头函数 | 定义时的外层 this，不可被 bind 改写 |

React 类组件要 `bind(this)`、Vue 事件回调里箭头函数拿得到组件实例，本质上都是这条规则。

## 异步编程

事件循环顺序：同步代码 → 微任务（Promise.then、queueMicrotask）→ 一轮宏任务（setTimeout、I/O）→ 再清微任务。核心记忆点：**每颗宏任务执行完，微任务队列必清空一次**。

```js
setTimeout(() => console.log('macro'))
Promise.resolve().then(() => console.log('micro'))
console.log('sync')
// sync → micro → macro
```

并发控制用 `async/await` 配合循环即可，串行 `for...of + await`，并行 `Promise.all`。`Promise.allSettled` 不怕单个失败，适合「全都要结果」的场景。

**Generator**：`function*` 定义，`yield` 处暂停，每调一次 `next()` 执行到下一个 `yield`：

```js
function* gen() {
  const a = yield 1
  const b = yield a + 10
  return b
}
const g = gen()
g.next()      // { value: 1, done: false }
g.next(5)     // next 的参数作为上一个 yield 的返回值 → { value: 15 }
```

三者的关系一句话：**async/await = Generator + Promise 的语法糖**——`await` 相当于在 `yield` 处暂停等 Promise 决议再继续，由自动执行器驱动，不用手写 `next()`。日常写异步只用 async/await，Generator 更多出现在面试与源码（如 redux-saga）里。

## ES6+ 核心语法

**解构赋值**：

```js
const [a, b = 2] = [1]                    // a=1, b=2（默认值）
const { name, age: years = 18 } = user    // 重命名 + 默认值
const { x, ...rest } = obj                // 剩余属性收集到 rest
function render({ title, list = [] }) {}  // 函数参数直接解构，处理配置对象最常用
```

**箭头函数**：没有自己的 `this`，捕获定义时的外层 `this` 且无法被 `call`/`bind` 改写（`setTimeout` 里能用外层 `this` 就是这个原理）；没有 `arguments`，不能 `new`。适合回调和短逻辑，不适合对象方法与原型方法（拿不到对象本身的 this）。

```js
const doubled = nums.map(n => n * 2)
setTimeout(() => this.count++)   // this 正确指向外层
```

**模板字符串**：`` `你好，${name}，共 ${list.length} 条` ``，支持换行、嵌套表达式，拼字符串一律用它替代 `+`。

**展开运算符**：

```js
[...arr1, ...arr2]        // 数组合并（替代 concat）
{ ...obj, age: 20 }       // 浅合并更新对象（不可变数据的标准写法）
fn(...args)               // 数组展开为参数（替代 apply）
```

注意展开是**浅拷贝**，嵌套对象仍是同一引用。

**其他高频**：

- `Map` 的键可以是任意类型且保持插入顺序，普通对象键会被转成字符串；`Set` 天然去重（`[...new Set(arr)]`）；
- 可选链 `a?.b` 与空值合并 `a ?? b` 搭配，是处理接口数据的标准写法（`??` 只在 `null/undefined` 时取右值，`0` 和 `''` 不会被吞）；
- 数组新方法：`flat`、`flatMap`、`at(-1)`、`findLast`、`includes`。

## DOM 操作与事件

常用 DOM 操作：

```js
const el = document.querySelector('#app')   // 查找（CSS 选择器）
el.classList.add('active')                  // 切样式，比直接改 className 安全
el.setAttribute('data-id', '1')             // el.dataset.id 读 data-* 属性
const div = document.createElement('div')
parent.appendChild(div)                     // 增
div.remove()                                // 删
```

批量插入节点用 `DocumentFragment` 拼好一次插入，避免多次回流。

**事件流三阶段**：捕获（window → 目标的父级）→ 目标阶段 → 冒泡（目标 → window）。`addEventListener` 默认在冒泡阶段监听，第三个参数传 `{ capture: true }` 改为捕获。

**事件委托**：不给每个子元素绑定，而是监听父元素、通过 `e.target` 区分来源。子元素增删无需重新绑定，省内存：

```js
list.addEventListener('click', (e) => {
  const item = e.target.closest('li')
  if (item) console.log(item.dataset.id)
})
```

`e.stopPropagation()` 阻止传播（点了弹窗内部不让外层的关闭逻辑触发），`e.preventDefault()` 阻止默认行为（阻止 a 跳转、表单提交），两者互不相干。

## BOM 与本地存储

BOM 是浏览器提供的 API：`window`（全局对象、弹窗与窗口控制）、`location`（`href` 跳转、`search`/`hash` 拿参数）、`navigator`（UA、剪贴板、网络状态）、`history`（`pushState`/`back`，SPA 前端路由的基础）、`screen`。

四种本地存储对比：

| 方式 | 容量 | 特点 |
| --- | --- | --- |
| Cookie | ~4KB | 每次请求自动携带，可设 `HttpOnly`/`SameSite`，存身份凭证 |
| localStorage | ~5MB | 永久生效，同域共享，存 token、主题偏好等 |
| sessionStorage | ~5MB | 标签页关闭即清，存一次性表单数据 |
| IndexedDB | 大容量 | 异步 API，存结构化大数据（离线缓存、草稿） |

共同点：都受同源策略限制，只能存字符串（对象要 `JSON.stringify`）。安全角度 token 建议放 `HttpOnly` Cookie（XSS 读不到）。

## 手写高频题

```js
// 防抖：一段时间内只执行最后一次
function debounce(fn, delay = 300) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流：一段时间内只执行第一次
function throttle(fn, interval = 300) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last < interval) return
    last = now
    fn.apply(this, args)
  }
}

// 深拷贝（WeakMap 解循环引用）
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (map.has(obj)) return map.get(obj)
  const clone = Array.isArray(obj) ? [] : {}
  map.set(obj, clone)
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], map)
  }
  return clone
}
```

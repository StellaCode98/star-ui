# TypeScript

## 为什么要用 TS

结论：**JS 是动态类型，报错要到运行时才炸；TS 在写代码时就报错**。重构有提示、接口数据有形状约束、编辑器智能补全更准。浏览器不认识 TS，需要编译回 JS（tsc 或 Vite/esbuild 转译）。

## 基础类型标注

```ts
// 原始类型
let name: string = 'star'
let ok: boolean = true
let count: number = 1
let ids: number[] = [1, 2]        // 数组两种写法等价
let ids2: Array<number> = [1, 2]

// 函数
function add(a: number, b: number): number { return a + b }

// 没有明确类型时走类型推断，能省则省
let x = 123        // 推断为 number，不必写 let x: number
```

## 特殊类型

| 类型 | 含义 |
| --- | --- |
| `any` | 放弃检查，等于回到 JS，尽量少用 |
| `unknown` | 安全版 any：拿到后必须先收窄才能用 |
| `void` | 函数没有返回值 |
| `never` | 永不发生（抛错、死循环的返回类型）；穷尽检查的利器 |
| 字面量类型 | `type Dir = 'up' \| 'down'`，值只能是这几个 |

`any` 与 `unknown` 的区别一句话：**any 什么都能做，unknown 什么都要先验证**。

```ts
function parse(json: string): unknown {
  return JSON.parse(json)   // 返回值不可信，交给调用方收窄
}
```

## 接口与类型别名

```ts
// interface 描述对象形状，可重复声明自动合并
interface User {
  id: number
  name: string
  age?: number                 // 可选属性
  readonly createdAt: string   // 只读
}

// type 更通用：联合、交叉、原始类型别名都行
type ID = number | string
type WithTime = User & { time: string }
```

多数场景两者可互换。差异记忆点：interface 可以**声明合并**（框架全局扩展用），type 能写**联合类型**。

## 联合与交叉、收窄

```ts
function format(id: number | string) {
  if (typeof id === 'string') {
    return id.trim()    // 这里 TS 知道是 string
  }
  return id.toFixed(2)  // 这里 TS 知道是 number
}
```

联合「或」，交叉「且」。TS 能根据 `typeof` / `in` / `instanceof` / 可辨识字段自动收窄类型，这是日常写代码最舒服的能力。

## 泛型

结论：**类型的参数化**——把类型当成参数传进去，调用时才确定具体类型，复用同一份逻辑:

```ts
function identity<T>(value: T): T {
  return value
}
identity('hi')    // T = string
identity(42)      // T = number

// 约束：T 必须有 length 属性
function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length)
  return item
}
```

## 常用工具类型

```ts
interface User { id: number; name: string; age: number }

Partial<User>          // 所有属性变可选 —— 常用于更新接口的入参
Required<User>         // 全部必选
Pick<User, 'id' | 'name'>      // 挑几个属性
Omit<User, 'age'>             // 去掉几个属性
Record<string, number>        // { [k: string]: number }
ReturnType<typeof add>        // 函数返回值类型，add 是上面的函数
Awaited<Promise<string>>      // Promise 解包后是 string
```

## 类型断言与 type guard

```ts
const el = document.querySelector('#app') as HTMLInputElement
el.value   // 不断言的话是 Element | null，取不了 value

// 自定义守卫：返回「xx is 类型」，TS 据此收窄
function isUser(v: unknown): v is User {
  return typeof v === 'object' && v !== null && 'id' in v
}
```

断言是「我比 TS 更懂，出事我负责」，编译期不检查运行时，所以 `unknown` 数据先守卫再断言更稳。

## declare 与 .d.ts

`declare` 告诉 TS「这个东西运行时存在，我只描述类型」：

```ts
declare const window: Window & typeof globalThis   // 内置声明
declare module 'some-untyped-lib'                  // 给无类型库补声明
```

`.d.ts` 文件是纯类型声明文件（无实现），npm 包的 `types` 字段指向它，`env.d.ts` 里 `/// <reference types="vite/client" />` 就是引入 Vite 的类型。

## 常见易错点

- 枚举会生成真实对象代码，优先用 `as const` 对象或字面量联合替代；
- 函数返回 `Promise<void>` 与 `void` 不同——事件回调标注 `void` 允许返回任何值；
- 类型收窄不掉 `null` 时（如数组头元素），用可选链 `?.` 或先判断长度；
- `strictNullChecks` 一定要开（strict 默认包含），否则 `null`/`undefined` 能赋给任何类型，TS 形同虚设。

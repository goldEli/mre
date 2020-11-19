# mre

toy react

- [x] CreateElement
- [x] Render
- [x] Concurrent mode
- [x] Fiber
- [x] Render and commit phases
- [ ] Reconciliation
- [ ] Function component
- [ ] UseState
- [ ] UseEffect
- [ ] Scheduler
- [ ] State manegement

# Note

### element data structure

```js
const ele = <div title="1">2<span></span></div>
const element = {
  type: "div"
  props: {
    title: "1"
    children: [
      {
        type: "textElemnt",
        props: {
          nodeValue: "2"
          children: []
        }
      },
      {
        type: "span"
        props: {
          children: []
        }
      }

    ]
  }
}
```
### Fiber data structure

createFiber()

```js
const ele = <div title="1">2<span></span></div>
const fiber {
  type: "div"
  dom?
  child?
  slibing?
  parent?
  alternate?
}
const rootFiber = {
  dom: container,
  child: fiber,
}
```

### Concurrent mode

引入 Fiber 架构 实现 

Fiber 架构 = 数据结构 + 算法

**数据结构**

将原有的 element 串成链表，在 element 的基础上增加 parent， child, sibling

```html
<div>
  <aside>
    <h1><h1>
    <h2><h2>
  </aside>
  <p><p>
</div>
```
以上面的 html 为例 

![](https://raw.githubusercontent.com/goldEli/mre/main/assets/fiber.png)


引入 Fiber 结构后，每个节点，都可以访问到下一个节点，所以可以暂停渲染。

利用 window.requestIdelCallback 循环执行每个单元的渲染，当浏览器有优先级更高的任务时，暂停执行，当浏览器空闲后，继续执行

### Render and commit phases

如果在每个单元中执行渲染，当暂停时，用户就会看到不完整的页面，用户体验很差

所以需要当所有单元完全执行后（render 阶段），再统一渲染到页面（commit 阶段）

### Reciliation

对比新旧Fiber 为其打标签，然后根据标签执行 更新 替换 删除（"REPLACE", "UPDATE", "DELETION"）


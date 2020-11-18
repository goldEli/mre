# mre

toy react

- [x] CreateElement
- [ ] Render
- [ ] Concurrent mode
- [ ] Fiber
- [ ] Render and commit phases
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
import { IReactElement, IFiber } from "./type";

let nextUnitOfWork: IFiber | undefined = void 0
// work in progress root; avoiding incompelete ui
let wipRoot: IFiber | undefined = void 0

export function render(
  element: IReactElement,
  container: HTMLElement
) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  }
  nextUnitOfWork = wipRoot
}

// commit phases; render to broswer
function commitRoot() {
  commitWork(wipRoot?.child)
  wipRoot = void 0 
}

function commitWork(fiber: IFiber | undefined) {
  if (!fiber) return

  const parentDom = fiber.parent?.dom
  parentDom?.append(fiber?.dom as HTMLElement)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function createDom(fiber: IFiber) {
  const dom = (fiber.type === "textElement")
    ? document.createTextNode(fiber.props.nodeValue)
    : document.createElement(fiber.type as string)
  const isAttribute = (key: string) => !["children", "nodeValue"].includes(key)

  Object.keys(fiber.props).filter(isAttribute).forEach((propName) => {
    (dom as HTMLElement).setAttribute(propName, fiber.props[propName])
  })
  // fiber.props.children.forEach(child => {
  //   render(child, dom as HTMLElement)
  // })
  return dom
}


function workLoop(deadLine: any) {
  let shouldYield = false
  while (nextUnitOfWork !== null && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadLine.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  window.requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)

function performUnitOfWork(fiber: IFiber | undefined): IFiber | undefined {
  if (fiber === void 0) return fiber
  if (!fiber.dom) {
    fiber.dom = createDom(fiber) as HTMLElement
  }
  // if (fiber.parent) {
  //   fiber.parent?.dom?.appendChild(fiber.dom as HTMLElement)
  // }
  const elements = fiber.props.children
  let prevSibling: null | IFiber = null

  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i]
    const newFiber: IFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: void 0
    }
    if (i === 0) {
      fiber.child = newFiber
    } else {
      if (prevSibling) {
        prevSibling.sibling = newFiber
      }
    }

    prevSibling = newFiber
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber: IFiber | undefined = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

}

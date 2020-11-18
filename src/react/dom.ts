import { IElement, IFiber } from "./type";

let nextUnitOfWork: IFiber | null = null

// work in process
let wipRoot: IFiber | null = null

export const render = (element: IElement, container: HTMLElement) => {
  wipRoot = {
    type: "",
    dom: container,
    props: {
      children: [element]
    }
  }

  nextUnitOfWork = wipRoot
}

const createDom = (fiber: IFiber): HTMLElement => {
  const dom = fiber.type === "textElement" ? document.createTextNode("") : document.createElement(fiber.type)

  const isAttribute = (propName: string) => propName !== "children"

  Object.keys(fiber.props).filter(isAttribute).forEach((propName) => {
    (dom as any)[propName] = fiber.props[propName]
  })

  return dom as HTMLElement
}

const commitRoot = () => {
  if (wipRoot === null) return
  console.log("wipRoot", wipRoot)
  commitWork(wipRoot)
  wipRoot = null
}

const commitWork = (fiber: IFiber) => {
  if (!fiber) return
  if (fiber.parent?.dom && fiber.dom) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  if (fiber.child) {
    commitWork(fiber.child)
  }
  if (fiber.sibling) {
    commitWork(fiber.sibling)
  }
}


const performNextUnitOfWork = (fiber: IFiber): IFiber | null => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // if (fiber.parent) {
  //   fiber.parent.dom?.appendChild(fiber.dom)
  // }
  let index = 0
  let elements = fiber.props.children
  let prevFiber: IFiber | null = null

  while (index < elements.length) {
    const element = elements[index]
    const newFiber: IFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: void 0
    }
    if (index === 0) {
      fiber.child = newFiber
    } else if (prevFiber) {
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
    ++index
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber: IFiber | undefined = fiber.sibling

  if (!nextFiber) {
    nextFiber = fiber.parent
    while (nextFiber) {
      if (nextFiber?.sibling) {
        return nextFiber.sibling
      }
      nextFiber = nextFiber.parent
    }
  }

  return nextFiber === void 0 ? null : nextFiber
}

const workLoop = (IdleDeadline: any) => {
  let isYeild = false
  while (!isYeild && nextUnitOfWork) {
    nextUnitOfWork = performNextUnitOfWork(nextUnitOfWork)
    isYeild = IdleDeadline.timeRemaining() < 1
  }
  if (wipRoot && !nextUnitOfWork) {
    commitRoot()
  }
  window.requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)
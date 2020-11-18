import { IElement, IFiber } from "./type";

let nextUnitOfWork: IFiber | null = null

export const render = (element: IElement, container: HTMLElement) => {
  nextUnitOfWork = {
    type: "",
    dom: container,
    props: {
      children: [element]
    }
  }
}

const createDom = (fiber: IFiber): HTMLElement => {
  const dom = fiber.type === "textElement" ? document.createTextNode("") : document.createElement(fiber.type)

  const isAttribute = (propName: string) => propName !== "children"

  Object.keys(fiber.props).filter(isAttribute).forEach((propName) => {
    (dom as any)[propName] = fiber.props[propName]
  })

  fiber.props.children.forEach(child => {
    if (dom instanceof HTMLElement) {
      render(child, dom)
    }
  })
  return dom as HTMLElement
}


const performNextUnitOfWork = (fiber: IFiber): IFiber | null => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  if (fiber.parent) {
    fiber.parent.dom?.appendChild(fiber.dom)
  }

  let index = 0
  let elements = fiber.props.children
  let prevFiber: IFiber | null = null

  while (index < elements.length) {
    const element = elements[index]
    const newFiber: IFiber = {
      type: element.type,
      props: element.props
    }
    newFiber.parent = fiber
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
  window.requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)
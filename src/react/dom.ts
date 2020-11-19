import { IElement, IFiber, IProps } from "./type";

let nextUnitOfWork: IFiber | null = null

// work in process
let wipRoot: IFiber | null = null

let currentRoot: IFiber

export const render = (element: IElement, container: HTMLElement) => {
  wipRoot = {
    type: "rootElement",
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot,
  }

  nextUnitOfWork = wipRoot
}

const createDom = (fiber: IFiber): HTMLElement => {
  const dom = fiber.type === "textElement" ? document.createTextNode("") : document.createElement(fiber.type)

  Object.keys(fiber.props).filter(isAttribute).forEach((propName) => {
    (dom as any)[propName] = fiber.props[propName]
  })

  // add Event

  Object.keys(fiber.props).filter(isEvent).forEach((propName) => {
    const eventName = propName.toLocaleLowerCase().slice(2)
    dom.addEventListener(eventName, fiber.props[propName])
  })

  return dom as HTMLElement
}

const commitRoot = () => {
  if (wipRoot === null) return
  console.log("wipRoot", wipRoot)
  commitWork(wipRoot)
  currentRoot = wipRoot
  wipRoot = null
}

const commitWork = (fiber: IFiber) => {
  if (!fiber || !fiber.dom) return

  if (fiber.effectTag === "PLACEMENT") {
    fiber.parent?.dom?.appendChild(fiber.dom)
  }
  if (fiber.effectTag === "DELETION") {
    fiber.dom.remove()
  }
  if (fiber.effectTag === "UPDATE") {
    updateDom(fiber.dom, fiber.props, fiber.alternate?.props)
  }
  if (fiber.child) {
    commitWork(fiber.child)
  }
  if (fiber.sibling) {
    commitWork(fiber.sibling)
  }
}

const isEvent = (propName: string) => propName.startsWith("on")
const isAttribute = (propName: string) => propName !== "children" && !isEvent(propName)
const isNew = (props: IProps, prevProps: IProps) => (propName: string) => props[propName] !== prevProps[propName]
const isGone = (props: IProps, prevProps: IProps) => (propName: string) => !(propName in props)
const updateDom = (dom: HTMLElement, props: IProps, prevProps: IProps | { [key: string]: any } = {}) => {
  // update event
  Object.keys(props)
    .filter(isEvent)
    .forEach(propName => {
      const eventName = propName.toLocaleLowerCase().slice(2)
      dom.addEventListener(eventName, props[propName])
    })
  // remove event
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(isGone(props, prevProps as IProps))
    .forEach(propName => {
      const eventName = propName.toLocaleLowerCase().slice(2)
      dom.removeEventListener(eventName, props[propName])
    })

  // remove props
  Object.keys(prevProps)
    .filter(isAttribute)
    .filter(isGone(props, prevProps as IProps))
    .forEach(propName => {
      dom.removeAttribute(propName)
    })

  // update props
  Object.keys(props)
    .filter(isAttribute)
    .filter(isNew(props, prevProps as IProps))
    .forEach(propName => {
      (dom as any)[propName] = props[propName]
    })

}

const reconcileChildren = (fiber: IFiber) => {
  let index = 0
  let elements = fiber.props.children
  let prevFiber: IFiber | null = null
  let oldFiber = fiber.alternate?.child


  while (index < elements.length) {
    const element = elements[index]
    const sameType = element && oldFiber && element.type === oldFiber.type
    let newFiber: IFiber | null = null
    if (sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: oldFiber?.dom,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    } else if (!sameType && element) {
      newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: void 0,
        alternate: oldFiber,
        effectTag: "PLACEMENT",
      }
    } else {
      newFiber = oldFiber as IFiber
      newFiber.effectTag = "DELETION"
    }

    if (index === 0) {
      fiber.child = newFiber
    } else if (prevFiber) {
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
    ++index
  }

}

const performNextUnitOfWork = (fiber: IFiber): IFiber | null => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber)

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
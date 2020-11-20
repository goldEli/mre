import { IElement, IFiber, IProps, IElementType } from "./type";
import reconcileChildren from "./reconcileChildren";

let nextUnitOfWork: IFiber | null = null

// work in process
let wipRoot: IFiber | null = null

let currentRoot: IFiber

const isEvent = (propName: string) => propName.startsWith("on")
const isAttribute = (propName: string) => propName !== "children" && !isEvent(propName)
const isNew = (props: IProps, prevProps: IProps) => (propName: string) => props[propName] !== prevProps[propName]
const isGone = (props: IProps, prevProps: IProps) => (propName: string) => !(propName in props)

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
  const dom = fiber.type === "textElement" ? document.createTextNode("") : document.createElement(fiber.type as any)

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
  commitWork(wipRoot.child as IFiber)
  currentRoot = wipRoot
  wipRoot = null
  hooksIdx = 0
}

const commitWork = (fiber: IFiber) => {
  if (!fiber) return
  let domParentFiber = fiber.parent
  while (!domParentFiber?.dom) {
    domParentFiber = domParentFiber?.parent
  }
  const domParent = domParentFiber.dom

  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    // fiber.parent?.dom?.appendChild(fiber.dom)
    domParent.appendChild(fiber.dom)
  }
  if (fiber.effectTag === "DELETION" && fiber.dom) {
    fiber.dom.remove()
  }
  if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateDom(fiber.dom, fiber.props, fiber.alternate?.props)
  }
  if (fiber.child) {
    commitWork(fiber.child)
  }
  if (fiber.sibling) {
    commitWork(fiber.sibling)
  }
}

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


const isFunctionComponent = (type: IElementType) => {
  return type instanceof Function
}

const updateFunctionComponent = (fiber: IFiber) => {
  const children = [(fiber.type as any)(fiber.props)]

  reconcileChildren(fiber, children)
}

const hooksState: any[] = [];
let hooksIdx = 0;
export const useState = <T,>(initState: T): any => {
  let currentIdx = hooksIdx
  let state: T = initState

  if (hooksState[hooksIdx] !== void 0) {
    state = hooksState[hooksIdx]
  }

  const setState = (newState: T) => {
    hooksState[currentIdx] = newState
    wipRoot = {
      type: currentRoot.type,
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    }
    nextUnitOfWork = wipRoot
  }

  ++hooksIdx

  return [state, setState]
};

const updateHostComponent = (fiber: IFiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}


const performNextUnitOfWork = (fiber: IFiber): IFiber | null => {

  if (isFunctionComponent(fiber.type)) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
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
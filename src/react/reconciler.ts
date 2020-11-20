import { IElement, IFiber, IProps, IElementType } from "./type";
import { resetCursor } from "./hooks"
import { createDom, updateDom } from "./dom";

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

export const reRender = () => {
  wipRoot = {
    type: currentRoot.type,
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
  }
  nextUnitOfWork = wipRoot
}



const commitRoot = () => {
  if (wipRoot === null) return
  console.log("wipRoot", wipRoot)
  commitWork(wipRoot.child as IFiber)
  currentRoot = wipRoot
  wipRoot = null
  resetCursor()
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



const isFunctionComponent = (type: IElementType) => {
  return type instanceof Function
}

const updateFunctionComponent = (fiber: IFiber) => {
  const children = [(fiber.type as any)(fiber.props)]

  reconcileChildren(fiber, children)
}


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

const reconcileChildren = (fiber: IFiber, elements: IElement[]) => {
  let index = 0
  let prevFiber: IFiber | null = null
  let oldFiber = fiber.alternate?.child
  while (index < elements.length) {
    const element = elements[index]
    const sameType = element && oldFiber && element.type === oldFiber.type
    let newFiber: IFiber | null = null
    console.log("sameType", sameType, {element, oldFiber})
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
    oldFiber = oldFiber?.sibling
    ++index
  }

}

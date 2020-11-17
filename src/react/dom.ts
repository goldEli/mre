import { IReactElement, IFiber, IProps } from "./type";

let nextUnitOfWork: IFiber | undefined = void 0
// work in progress root; avoiding incompelete ui
let wipRoot: IFiber | undefined = void 0
// Has been rendered to the browser
let currentRoot: IFiber | undefined = void 0

let deletions: IFiber[] = []


export function render(
  element: IReactElement,
  container: HTMLElement
) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

// commit phases; render to broswer
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot?.child)
  currentRoot = wipRoot
  wipRoot = void 0
}

function commitWork(fiber: IFiber | undefined) {
  if (!fiber) return

  let domParentFiber = fiber.parent as IFiber;
  while (!domParentFiber?.dom) {
    domParentFiber = domParentFiber?.parent as IFiber;
  }
  const domParent = domParentFiber.dom;
  // parentDom?.append(fiber?.dom as HTMLElement)
  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    domParent?.appendChild(fiber.dom)
  } else if (fiber.effectTag === "DELETION" && fiber.dom && domParent) {
    // parentDom?.removeChild(fiber.dom)
    commitDeletion(fiber, domParent)
  } else if (
    fiber.effectTag === "UPDATE" && fiber.dom && fiber.alternate
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function commitDeletion(fiber: IFiber, domParent: HTMLElement) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else if (fiber.child) {
    commitDeletion(fiber.child, domParent);
  }
}

const isEvent = (key: string) => key.startsWith("on")
const isProperty = (key: string) =>
  key !== "children" && !isEvent(key)
const isNew = (prev: IProps, next: IProps) => (key: string) =>
  prev[key] !== next[key]
const isGone = (prev: IProps, next: IProps) => (key: string) => !(key in next)
function updateDom(dom: HTMLElement | Text, prevProps: IProps, nextProps: IProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      (dom as any)[name] = ""
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      (dom as any)[name] = nextProps[name]
    })
}

function createDom(fiber: IFiber) {
  const dom = (fiber.type === "textElement")
    ? document.createTextNode(fiber.props.nodeValue)
    : document.createElement(fiber.type as string)

  updateDom(dom, {}, fiber.props);
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
  const elements = fiber.props.children
  if (!fiber.dom) {
    fiber.dom = createDom(fiber) as HTMLElement;
  }
  reconcileChildren(fiber, elements)
  // if (fiber.parent) {
  //   fiber.parent?.dom?.appendChild(fiber.dom as HTMLElement)
  // }

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

function reconcileChildren(wipFiber: IFiber, elements: IReactElement[]) {
  let index = 0
  let prevSibling: IFiber | undefined = void 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child

  while (
    index < elements.length || oldFiber != void 0
  ) {
    const element = elements[index]
    let newFiber: IFiber | undefined = void 0

    const sameType = oldFiber && element && element.type === oldFiber.type
    if (sameType && oldFiber) {
      newFiber = {
        type: oldFiber.type,
        props: oldFiber.props,
        dom: oldFiber.dom,
        parent: oldFiber.parent,
        alternate: oldFiber,
        effectTag: "UPDATE"
      }
    }
    if (!sameType && element) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: void 0,
        parent: wipFiber,
        alternate: void 0,
        effectTag: "PLACEMENT"
      }
    }
    if (!sameType && oldFiber) {
      // delete this node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }
    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      if (prevSibling) {
        prevSibling.sibling = newFiber
      }
    }

    prevSibling = newFiber
    ++index
  }
}

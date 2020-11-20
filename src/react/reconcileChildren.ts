import{ IFiber, IElement } from "./type";

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

export default reconcileChildren
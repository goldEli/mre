import {IProps, IFiber, } from "./type"

const isEvent = (propName: string) => propName.startsWith("on")
const isAttribute = (propName: string) => propName !== "children" && !isEvent(propName)
const isNew = (props: IProps, prevProps: IProps) => (propName: string) => props[propName] !== prevProps[propName]
const isGone = (props: IProps, prevProps: IProps) => (propName: string) => !(propName in props)

export const createDom = (fiber: IFiber): HTMLElement => {
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
export const updateDom = (dom: HTMLElement, props: IProps, prevProps: IProps | { [key: string]: any } = {}) => {
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
import { IReactElement } from "./type";

export function render(
  element: IReactElement,
  container: HTMLElement
) {
  if (element.type === "textElement") {
    const dom = document.createTextNode(element.props.nodeValue)
    container.append(dom)
    return
  }
  if (typeof element.type === "string") {
    const dom = document.createElement(element.type)
    const isAttributs = (key:string) => !["children"].includes(key) 

    Object.keys(element.props).filter(isAttributs).forEach((propName) => {
      dom.setAttribute(propName, element.props[propName])
    })
    element.props.children.forEach(child => {
      render(child, dom)
    })
    container.append(dom)
  }
}


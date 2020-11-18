import { IElement } from "./type";

export const render = (element: IElement, container: HTMLElement | Text) => {
  const dom = element.type === "textElement" ? document.createTextNode("") : document.createElement(element.type)

  const isAttribute = (propName: string) => propName !== "children"

  Object.keys(element.props).filter(isAttribute).forEach((propName) => {
    (dom as any)[propName] = element.props[propName]
  })

  element.props.children.forEach(child => {
    render(child, dom)
  })

  container.appendChild(dom)
}
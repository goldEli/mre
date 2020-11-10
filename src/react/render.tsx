import { createElement } from "react";
import { ReactElement } from "./createElement";
function render(reactElement: ReactElement | any, container: HTMLElement ) {
  const dom = reactElement.getDom()
  container.append(dom)
}

export default render
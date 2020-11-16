
import { ReactElement } from "./createReactElement";

const backUp: {
  element: ReactElement | any,
  container: HTMLElement
} = {
  element: null,
  container: document.body
}
const rootId = 0

function render(
  element: ReactElement | any,
  container: HTMLElement
) {
  // const markup = element.getMarkup(rootId);
  const dom = element.getDom(rootId)
  container.append(dom)
  backUp.element = element
  backUp.container = container
  window.stateIndex = 0
}

export const reRender = () => {
  const { element, container } = backUp
  const dom = element.getDom(rootId)
  container.innerHTML = ""
  container.append(dom)
  window.stateIndex = 0
}

export default render;

import { ReactElement } from "./createReactElement";
function render(
  element: ReactElement | any | Function,
  container: HTMLElement
) {
  if (typeof element === "function") {
    const dom = element().getDom();
    container.append(dom);
    return
  }
  const dom = element.getDom();
  container.append(dom);
}

export default render;

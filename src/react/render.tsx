
import { ReactElement } from "./createReactElement";
function render(
  element: ReactElement | any,
  container: HTMLElement
) {
  const markup = element.getMarkup("0");
  container.innerHTML = markup
}

export default render;

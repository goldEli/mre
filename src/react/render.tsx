import React from "./index"

import { ReactElement } from "./createReactElement";
function render(
  element: ReactElement | any,
  container: HTMLElement
) {
  const dom = element.getDom();
  container.append(dom);
}

export default render;

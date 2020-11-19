import React from "./react";
import {render} from "./react/dom"

const ele = (
  <div title="123">
    <h1>Hello World</h1>
    <h2 >from React</h2>
  </div>
)
/** @jsx React.createElement */
console.log(ele)
const container = document.getElementById("root") as HTMLElement;
render(ele, container);

export { };

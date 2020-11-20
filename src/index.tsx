import React from "./react";
import { render } from "./react/dom"

// const ele = (
//   <div title="123">
//     <h1 onClick={() => console.log(123)}>Hello World</h1>
//     <h2 >from React</h2>
//   </div>
// )
const App = (props: { name: string }) => {
  return (
    <div title="123">
      <h1 onClick={() => console.log(123)}>Hello World</h1>
      <h2 >{props.name}</h2>
    </div>
  )
}
/** @jsx React.createElement */
console.log(<App name="from React" />)
const container = document.getElementById("root") as HTMLElement;
render(<App name="from React" />, container);

export { };

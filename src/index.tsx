import React from "./react";

// const ele = (
//   <div title="123">
//     <h1 onClick={() => console.log(123)}>Hello World</h1>
//     <h2 >from React</h2>
//   </div>
// )
const App = (props: { name: string }) => {
  const [count, setCount] = React.useState(0)
  console.log(count)
  return (
    <div title="123">
      <h2 >{props.name}</h2>
      <h1>{`count: ${count}`}</h1>
      <div>
        <button onClick={() => setCount(count + 1)}>increase</button>
        <button onClick={() => setCount(count - 1)}>decrease</button>
      </div>
    </div>
  )
}
/** @jsx React.createElement */
console.log(<App name="from React" />)
const container = document.getElementById("root") as HTMLElement;
React.render(<App name="from React" />, container);

export { };

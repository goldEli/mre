// import React from 'react';
// import ReactDOM from 'react-dom';
// const createElement = React.createElement
import React, { render, useState } from "./react";

const Counter = () => {
  const [num, setNum] = useState(0)

  function increase() {
    setNum(num + 1)
  }
  function decrease() {
    setNum(num - 1)
  }
  return (
    <div>
      <h1>{`counter: ${num}`}</h1>
      <div>
        <button onClick={increase}>increase</button>
        <button onClick={decrease}>decrease</button>
      </div>
    </div>
  )
}
/** @jsx React.createElement */
// const App = (props: { msg: string }) => {
//   return (
//     <div className="first">
//       <h1>{props.msg}</h1>
//       <Counter />
//     </div>
//   );
// };
const ele = <div className="first">first<span title="second">{123}<Counter /></span></div>
// const container = document.getElementById("root") as HTMLElement;
console.log(ele)
// render(<App msg="this is msg" />, container);

export { };

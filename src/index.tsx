// import React from 'react';
// import ReactDOM from 'react-dom';
// const createElement = React.createElement
import React from "./react";
import {render} from "./react/dom"

// const Counter = () => {
//   const [num, setNum] = useState(0)

//   function increase() {
//     setNum(num + 1)
//   }
//   function decrease() {
//     setNum(num - 1)
//   }
//   return (
//     <div>
//       <h1>{`counter: ${num}`}</h1>
//       <div>
//         <button onClick={increase}>increase</button>
//         <button onClick={decrease}>decrease</button>
//       </div>
//     </div>
//   )
// }
// const App = (props: { msg: string }) => {
//   return (
//     <div className="first">
//       <h1>{props.msg}</h1>
//       <Counter />
//     </div>
//   );
// };
/** @jsx React.createElement */
const ele = <div className="first">first<span title="second">{123}</span></div>
const container = document.getElementById("root") as HTMLElement;
render(ele, container);

export { };

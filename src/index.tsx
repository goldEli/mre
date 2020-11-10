// import React from 'react';
// import ReactDOM from 'react-dom';
// const createElement = React.createElement
import React, { render } from "./react";

const Son = () => {
  return <h1>son</h1>;
};
const App= () => {
  return (
    <div className="first">
      first
      <span title="second">second</span>
      <Son/>
    </div>
  );
};
console.log(<App/>)
const container = document.getElementById("root") as HTMLElement;
render(<App></App>, container);
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
//   , container);

export {};

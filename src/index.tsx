// import React from 'react';
// import ReactDOM from 'react-dom';
// const createElement = React.createElement
import React, { render } from "./react";

const Son = (props: {msg: string}) => {
return <h1>{props.msg}</h1>;
};
const App= (props: {msg: string}) => {
  return (
    <div className="first">
      <h3>{props.msg}</h3>
      first
      <span title="second">second</span>
      <Son msg="this is son"/>
    </div>
  );
};
const container = document.getElementById("root") as HTMLElement;
render(<App msg="this is msg" />, container);
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
//   , container);

export {};

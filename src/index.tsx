// import React from 'react';
// import ReactDOM from 'react-dom';
import React, {render} from "./react"

const ele1 = "123"
const ele2 = (
  <div className="first">
    first
    <span title="second">second</span>
  </div>
)
console.log((ele2 as any).getDom())
console.log(ele2)
const container = document.getElementById("root") as HTMLElement 
render(ele2, container)
export {}
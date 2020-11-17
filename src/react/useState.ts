// import { reRender } from "./render";
const stack: any[] = []

function useState(initState: any) {
  const curIndex = window.stateIndex
  if (stack[curIndex] === void 0) {
    stack[curIndex] = initState
    ++window.stateIndex
  }

  function setState(state: any) {
    stack[curIndex] = state
    // reRender()
  }
  return [stack[curIndex], setState]
}

export default useState
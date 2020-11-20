import { reRender } from "./reconciler";

const hooksState: any[] = [];
let cursor = 0;

export const resetCursor = () => {
  cursor = 0
}

export const useState = <T,>(initState: T): any => {
  let currentIdx = cursor
  let state: T = initState

  if (hooksState[cursor] !== void 0) {
    state = hooksState[cursor]
  }

  const setState = (newState: T) => {
    hooksState[currentIdx] = newState
    reRender()
  }

  ++cursor

  return [state, setState]
};
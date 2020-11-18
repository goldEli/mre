import { IProps } from "./type";
const createElement = (type: string, props: IProps, ...children: any[]) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return ["string", "number"].includes(typeof child) ? createTextElement(child) : child
      })
    }
  }
}

const createTextElement = (text: string | number) => {
  return {
    type: "textElement",
    props: {
      nodeValue: text,
      children: []
    }
  }
}



const React = {
  createElement
}
export default React;

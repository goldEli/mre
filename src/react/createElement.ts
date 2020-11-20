import { IProps, IElement, IElementType } from "./type";
const createElement = (type: IElementType, props: IProps, ...children: any[]): IElement => {
  console.log({type, props, children})
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

export default createElement
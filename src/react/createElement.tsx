import { IReactElement } from "./type";

function createElement(type: string, props: {[key:string]: any}, ...children: any[]): IReactElement {
  const propsFilted: { [key: string]: string } = {}
  for (let key in props) {
    if (!key.startsWith("__")) {
      propsFilted[key] = props[key]
    }
  }

  return {
    type,
    props: {
      ...propsFilted,
      children: children.map(child => {
        return ["string", "number"].includes(typeof child) ? createTextElement(child) : child
      })
    }
  }
}

function createTextElement(text: string | number) {
  return {
    type: "textElement",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

export default createElement;

export class ReactElement {
  type: string;
  key: string | null = null;
  props: { children: ReactElement[] } & { [key: string]: any };
  constructor(type: string, props: any, key?: string | null) {
    this.type = type;
    this.props = props;
  }
  getDom = (): HTMLElement => {
    const dom = document.createElement(this.type);
    for (let key in this.props) {
      if (key === "children") continue;
      dom.setAttribute(key, this.props[key]);
    }
    const children = this.props.children.map((item) => {
      return item.getDom();
    });

    dom.append(...children);

    return dom;
  };
}

class ReactTextElement {
  type = "#text";
  text: string;
  constructor(text: string) {
    this.text = text;
  }
  getDom = () => {
    return document.createTextNode(this.text);
  };
}

function createElement(type: string, props: any, ...children: any[]) {
  const newProps: any = {};
  for (let key in props) {
    if (!/^(__)+/.test(key)) {
      newProps[key] = props[key];
    }
  }

  return new ReactElement(type, {
    ...newProps,
    children: children.map((child: any) => {
      if (typeof child === "string") {
        return new ReactTextElement(child);
      }
      return child;
    }),
  });
}
export default createElement;

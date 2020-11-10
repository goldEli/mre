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

class ReactFunctionElement {
  type = "#function";
  func: (props: any) => ReactElement;
  props: { children: ReactElement[] } & { [key: string]: any };
  constructor(func: any, props: any) {
    this.props = props;
    this.func = func;
  }
  getDom = () => {
    return this.func(this.props).getDom();
  };
}

function createReactElement(type: string | Function, props: any) {
  if (typeof type === "function") {
    return new ReactFunctionElement(type, props);
  }
  return new ReactElement(type, {
    ...props,
    children: props.children.map((child: any) => {
      if (typeof child === "string") {
        return new ReactTextElement(child);
      }
      return child;
    }),
  });
}

export default createReactElement;

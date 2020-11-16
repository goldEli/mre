export class ReactElement {
  type: string | Function;
  key: string | null = null;
  props: { children: ReactElement[] } & { [key: string]: any };
  rootId: string = "0000"
  constructor(type: string | Function, props: any, key?: string | null) {
    this.type = type;
    this.props = props;
  }
  // getMarkup = (rootId: string): string => {
  //   return "";
  // };
  getDom = (rootId: string): HTMLElement | Text => {
    return document.createElement("div");
  };
}

class ReactNativeElement extends ReactElement {
  // getMarkup = (rootId: string): string => {
  //   if (typeof this.type !== "string") return "";
  //   this.rootId = rootId
  //   let startTag = `<${this.type} data-reactid="${rootId}"`;
  //   let endTag = `</${this.type}>`;
  //   let childrenMarkup = "";
  //   for (let propName in this.props) {
  //     if (propName === "children") {
  //       childrenMarkup = this.props[propName]
  //         .map((child: string | ReactElement, idx: number) => {
  //           if (child instanceof ReactElement) {
  //             return child.getMarkup(rootId + "-" + idx);
  //           }
  //           return child;
  //         })
  //         .join("");
  //     } else if (propName.startsWith("on")) {
  //       const eventName = propName.toLocaleLowerCase()
  //       startTag += ` ${eventName}="${this.props[propName].name}()"`;

  //     } else {
  //       let newPropName = propName;
  //       if (propName === "className") {
  //         newPropName = "class";
  //       }
  //       startTag += ` ${newPropName}="${this.props[propName]}"`;
  //     }
  //   }

  //   return startTag + ">" + childrenMarkup + endTag;
  // };
  getDom = (rootId: string): HTMLElement | Text => {
    if (typeof this.type !== "string") return document.createElement("div");
    this.rootId = rootId
    const dom = document.createElement(this.type)
    dom.setAttribute("data-reactid", rootId)
    let children: (HTMLElement | Text)[] = []

    // handle attributes
    for (let propName in this.props) {
      if (propName.startsWith("on")) {
        const eventName = propName.toLocaleLowerCase().replace("on", "")
        dom.addEventListener(eventName, this.props[propName])
        continue
      }
      if (propName === "className") {
        dom.setAttribute("class", this.props[propName])
        continue
      }
      if (propName === "children") {
        children = this.props[propName].map((child, idx) => {
          if (typeof child === "string") {
            return document.createTextNode(child)
          }
          if (child instanceof ReactElement) {
            return child.getDom(rootId + "-" + idx)
          }
          return document.createElement('div')
        })

        continue
      }
      dom.setAttribute(propName, this.props[propName])
    }

    dom.append(...children)
    return dom
  }
}

class ReactFunctionElement extends ReactElement {
  // getMarkup = (rootId: string): string => {
  //   if (typeof this.type !== "function") return "";
  //   this.rootId = rootId
  //   return this.type(this.props).getMarkup(rootId);
  // };
  getDom = (rootId: string): HTMLElement | Text => {
    if (typeof this.type !== "function") return document.createElement("div");
    this.rootId = rootId
    return this.type(this.props).getDom(rootId);
  }
}

function createReactElement(type: string | Function, props: any) {
  if (typeof type === "function") {
    return new ReactFunctionElement(type, props);
  }
  return new ReactNativeElement(type, props);
}

export default createReactElement;

export class ReactElement {
  type: string | Function;
  key: string | null = null;
  props: { children: ReactElement[] } & { [key: string]: any };
  constructor(type: string | Function, props: any, key?: string | null) {
    this.type = type;
    this.props = props;
  }
  getMarkup = (rootId: string): string => {
    return "";
  };
}

class ReactNativeElement extends ReactElement {
  getMarkup = (rootId: string): string => {
    if (typeof this.type !== "string") return "";
    let startTag = `<${this.type} data-reactid="${rootId}"`;
    let endTag = `</${this.type}>`;
    let childrenMarkup = "";
    for (let propName in this.props) {
      if (propName === "children") {
        childrenMarkup = this.props[propName]
          .map((child: string | ReactElement, idx: number) => {
            if (child instanceof ReactElement) {
              return child.getMarkup(rootId + "-" + idx);
            }
            return child;
          })
          .join("");
      } else {
        let newPropName = propName;
        if (propName === "className") {
          newPropName = "class";
        }
        startTag += ` ${newPropName}="${this.props[propName]}"`;
      }
      // if (/^on/.test(key)) {
      //   const eventName = key.toLocaleLowerCase().slice(2);
      //   dom.addEventListener(eventName, this.props[key]);
      //   continue;
      // }
    }

    return startTag + ">" + childrenMarkup + endTag;
  };
}

class ReactFunctionElement extends ReactElement {
  getMarkup = (rootId: string): string => {
    if (typeof this.type !== "function") return "";
    return this.type(this.props).getMarkup(rootId);
  };
}

function createReactElement(type: string | Function, props: any) {
  if (typeof type === "function") {
    return new ReactFunctionElement(type, props);
  }
  return new ReactNativeElement(type, props);
}

export default createReactElement;

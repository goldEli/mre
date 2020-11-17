export interface IReactElement {
  type: string | "textElement";
  props: { [key: string]: any } & {
    children: any[]
  }
}

export interface IFiber {
  dom?: HTMLElement;
  type?: string | "textElement";
  props: { [key: string]: any } & {
    children: IReactElement[]
  }
  parent?: IFiber;
  sibling?: IFiber;
  child?: IFiber;
}
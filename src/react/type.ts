export type IElementType = string | "textElement" | "rootElement"
export interface IElement {
  type: IElementType;
  props: IProps
}

export interface IFiber {
  dom?: HTMLElement;
  type: IElementType;
  props: IProps
  parent?: IFiber;
  sibling?: IFiber;
  child?: IFiber;
  alternate?: IFiber;
  effectTag?: "UPDATE" | "PLACEMENT" | "DELETION"
}

export interface IProps {
  [key: string]: any
  children: IElement[]
}
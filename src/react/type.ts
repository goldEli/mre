export interface IReactElement {
  type: string | Function | "textElement";
  props: { [key: string]: any } & {
    children: any[]
  }
}
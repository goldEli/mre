export interface IReactElement {
  type: string | Function;
  props: { [key: string]: any } & {
    children: any[]
  }
}
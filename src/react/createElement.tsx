import createReactElement from "./createReactElement";

function createElement(type: string, props: any, ...children: any[]) {
  const newProps: any = {};
  for (let key in props) {
    if (!/^(__)+/.test(key)) {
      newProps[key] = props[key];
    }
  }
  newProps['children'] = children
  return createReactElement(type, newProps)

}
export default createElement;

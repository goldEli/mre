import React from "../index";

describe("test createElement", () => {

  it("render normal html", () => {
    const ele = (<div title="123">test</div>) as any
    expect(ele).toHaveProperty('getDom')
    const dom = ele.getDom("0")
    expect(dom.outerHTML).toBe(`<div data-reactid="0" title="123">test</div>`)
  })

  it("render element that has className", () => {
    const ele = (<div className="test">test</div>) as any
    expect(ele).toHaveProperty('getDom')
    const dom = ele.getDom("0")
    expect(dom.className).toBe("test")

  })

  it("render function component with props", () => {
    const App = (props: { msg: string }) => {
      return (
        <div>{props.msg}</div>
      );
    };
    const ele = (<App msg="this is msg" />) as any;
    const dom = ele.getDom("0");
    expect(dom.outerHTML).toBe(
      `<div data-reactid="0">this is msg</div>`
    );
  });
});

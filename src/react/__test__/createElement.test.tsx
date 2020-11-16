import React from "../index";
import { ReactElement } from "../createReactElement";

describe("test createElement", () => {

    it("render normal html", () => {
      const ele = (<div title="123">test</div>) as any
      expect(ele).toHaveProperty('getDom')
      const dom =  ele.getDom("0")
      expect(dom.outerHTML).toBe(`<div data-reactid="0" title="123">test</div>`)
    })

  it("render function component", () => {
    const Son = (props: { msg: string }) => {
      return <h1>{props.msg}</h1>;
    };
    const App = (props: { msg: string }) => {
      return (
        <div className="first">
          <h3>{props.msg}</h3>
          first
          <span title="second">second</span>
          <Son msg="this is son" />
        </div>
      );
    };
    const ele = (<App msg="this is msg" />) as any;
    const dom = ele.getDom("0");
    expect(dom.outerHTML).toBe(
      `<div data-reactid="0" class="first"><h3 data-reactid="0-0">this is msg</h3>first<span data-reactid="0-2" title="second">second</span><h1 data-reactid="0-3">this is son</h1></div>`
    );
  });
});

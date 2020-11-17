import React from "../index";
import { IReactElement } from "../type";

describe("test createElement", () => {
  it("render normal html", () => {
    const element = <div title="1"><span>2</span></div> as IReactElement
    expect(element).toEqual({
      type: "div",
      props: {
        title: "1",
        children: [
          {
            type: "span",
            props: {
              children: [
                {
                  type: "textElement",
                  props: {
                    nodeValue: "2",
                    children: []
                  }
                }
              ]
            }
          }
        ]
      }
    })
  })
});

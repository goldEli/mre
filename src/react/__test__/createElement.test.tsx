import React from "../index";

const ele1 = "123";
const ele2 = (
  <div className="first">
    first
    <span title="second">second</span>
  </div>
);

describe("test createElement", () => {
  it("accept string", () => {
    expect(ele1).toBe("123");
  });
  it("accept jsx", () => {});
});

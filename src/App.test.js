import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

describe("<App />", () => {
  it("shows the content properly", () => {
    const utils = render(<App />);
    utils.getByText("날씨");
  });
});

import { render, screen } from "../../../test-utils";
import ProductConditionBadge from "./ProductConditionBadge";

describe("ProductConditionBadge", () => {
  it("labels used products", () => {
    render(<ProductConditionBadge condition="used" />);

    expect(screen.getByText("کارکرده")).toBeInTheDocument();
  });

  it("does not label products without a used condition", () => {
    render(<ProductConditionBadge />);

    expect(screen.queryByText("کارکرده")).not.toBeInTheDocument();
  });
});

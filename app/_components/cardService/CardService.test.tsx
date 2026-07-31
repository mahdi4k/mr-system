import { render, screen } from "../../../test-utils";
import CardService from "./CardService";

describe("Welcome component", () => {
  it("has correct Next.js theming section link", () => {
    render(<CardService />);
    expect(screen.getByText("انتخاب سیستم براساس بودجه"));
  });
});

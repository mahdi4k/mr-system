import { render, screen } from "../../../test-utils";
import { Footer } from "./Footer";

const mockUsePathname = jest.fn(() => "/");

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("Footer", () => {
  afterEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  it("links to the main user actions", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: "شروع اسمبل آنلاین" }),
    ).toHaveAttribute("href", "/choose-part");
    expect(screen.getByRole("link", { name: "ثبت آگهی" })).toHaveAttribute(
      "href",
      "/ads/create",
    );
    expect(
      screen.getByRole("link", { name: "مقالات و راهنماها" }),
    ).toHaveAttribute("href", "/blog");
  });

  it("exposes every supported part category", () => {
    render(<Footer />);

    for (const category of [
      "پردازنده",
      "کارت گرافیک",
      "مادربرد",
      "حافظه رم",
      "حافظه SSD",
      "منبع تغذیه",
      "کیس",
      "خنک‌کننده",
    ]) {
      expect(screen.getByRole("link", { name: category })).toBeInTheDocument();
    }
  });

  it("uses Rigora branding and secures the external support link", () => {
    render(<Footer />);

    expect(screen.queryByText(/kiwi part/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/support@kiwipart\.ir/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "پشتیبانی ریگورا در تلگرام" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", { name: "پشتیبانی ریگورا در تلگرام" }),
    ).toHaveAttribute("target", "_blank");
  });

  it("shows the call to action only on the home page", () => {
    mockUsePathname.mockReturnValue("/ads");

    render(<Footer />);

    expect(
      screen.queryByRole("heading", {
        name: "سیستم بعدی‌ات را هوشمندانه بساز",
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("درباره ریگورا")).toBeInTheDocument();
  });
});

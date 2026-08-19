import { torobProductIdFromUrl, toTorobProductId } from "./torobUrl";

describe("Torob reference parsing", () => {
  it("extracts a UUID from a bare uuid string", () => {
    expect(torobProductIdFromUrl("E574CFEA-f9AE-4ACC-8F42-0008270884FE")).toBe(
      "e574cfea-f9ae-4acc-8f42-0008270884fe",
    );
  });

  it("extracts a UUID from a full Torob URL", () => {
    const url =
      "https://torob.com/p/e574cfea-f9ae-4acc-8f42-0008270884fe/پردازنده/";
    expect(torobProductIdFromUrl(url)).toBe(
      "e574cfea-f9ae-4acc-8f42-0008270884fe",
    );
  });

  it("returns null for empty or invalid input", () => {
    expect(torobProductIdFromUrl(null)).toBeNull();
    expect(torobProductIdFromUrl(undefined)).toBeNull();
    expect(torobProductIdFromUrl("")).toBeNull();
    expect(torobProductIdFromUrl("not-a-uuid")).toBeNull();
  });

  it("toTorobProductId delegates to the base extractor", () => {
    expect(
      toTorobProductId(
        "https://torob.com/p/12345678-1234-1234-1234-123456789abc/x/",
      ),
    ).toBe("12345678-1234-1234-1234-123456789abc");
  });
});

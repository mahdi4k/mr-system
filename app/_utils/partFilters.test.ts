import { filterAndSortParts } from "./partFilters";

const parts = [
  { id: 1, name: "Intel Core i3", price: "300" },
  { id: 2, name: "AMD Ryzen 5", price: "100" },
  { id: 3, name: "Intel Core i5" },
  { id: 4, name: "Intel Core i7", price: "200" },
];

describe("filterAndSortParts", () => {
  it("filters product names without case sensitivity", () => {
    const result = filterAndSortParts(
      parts,
      "  INTEL core  ",
      "recommended",
      () => false,
    );

    expect(result.map((part) => part.id)).toEqual([1, 3, 4]);
  });

  it("places recommended products first by default", () => {
    const result = filterAndSortParts(
      parts,
      "",
      "recommended",
      (part) => part.id === 4,
    );

    expect(result[0].id).toBe(4);
  });

  it("sorts prices in both directions and keeps missing prices last", () => {
    const ascending = filterAndSortParts(parts, "", "price-asc", () => false);
    const descending = filterAndSortParts(parts, "", "price-desc", () => false);

    expect(ascending.map((part) => part.id)).toEqual([2, 4, 1, 3]);
    expect(descending.map((part) => part.id)).toEqual([1, 4, 2, 3]);
  });
});

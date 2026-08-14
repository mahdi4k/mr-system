import { getAdStatusDisplay } from "./status";

describe("advertisement status display", () => {
  it.each([
    ["pending", "در حال بررسی", "yellow"],
    ["published", "منتشر شده", "green"],
    ["sold", "فروخته شده", "blue"],
    ["archived", "بایگانی شده", "gray"],
    ["rejected", "رد شده", "red"],
  ] as const)("maps %s to its label and color", (status, label, color) => {
    expect(getAdStatusDisplay(status)).toEqual({ color, label });
  });
});

import {
  BuildCatalog,
  calculatePsuRequirement,
  findMinimumPriceBuild,
  isBuildCompatible,
  isPartialBuildCompatible,
  parseBuildIntent,
} from "./pcAssistant";
import { cpus, fans } from "@/_data/productCatalog";

const catalog: BuildCatalog = {
  cpu: [
    {
      id: 1,
      name: "CPU 1",
      price: "100",
      cpu_socket: "LGA1700",
      motherboards: [1],
      rams: [1],
      graphics: [1],
      fans: [1],
      maxTurboPowerW: 100,
      minimumRamGb: 16,
    },
  ],
  motherboard: [
    {
      id: 1,
      name: "Motherboard 1",
      price: "100",
      cpu_socket: "LGA1700",
      cpus: [1],
      rams: [1],
      size: "Micro-ATX",
      total_slot_ram: 2,
      storageForms: ["M.2"],
    },
  ],
  ram: [
    {
      id: 1,
      name: "RAM 1",
      price: "100",
      cpus: [1],
      motherboards: [1],
      capacityGb: 16,
    },
  ],
  graphic: [
    {
      id: 1,
      name: "Compatible GPU",
      price: "100",
      cpus: [1],
      powers: [1],
      psu: "550",
      boardPowerW: 150,
      minimumCaseForm: "Micro Tower",
    },
    {
      id: 2,
      name: "Cheaper incompatible GPU",
      price: "1",
      cpus: [2],
      powers: [1],
      psu: "550",
      boardPowerW: 150,
      minimumCaseForm: "Micro Tower",
    },
  ],
  power: [
    {
      id: 1,
      name: "Power 1",
      price: "100",
      graphics: [1, 2],
      psu: "650",
    },
  ],
  fan: [
    {
      id: 1,
      name: "Fan 1",
      price: "100",
      cpus: [1],
      cpu_sockets: "LGA1700, AM5",
      coolingCapacityW: 150,
    },
  ],
  ssd: [{ id: 1, name: "SSD 1", price: "100", form: "M.2" }],
  case: [
    {
      id: 1,
      name: "Case 1",
      price: "100",
      form: "Mid Tower",
      motherboardSizes: ["ATX", "Micro-ATX"],
    },
  ],
};

describe("parseBuildIntent", () => {
  it("parses a Persian minimum-price request and budget", () => {
    expect(parseBuildIntent("یک سیستم ارزان زیر ۵۰ میلیون می‌خواهم")).toEqual({
      objective: "minimum_price",
      maxBudget: 50_000_000,
    });
  });

  it("rejects requests outside the local MVP", () => {
    expect(parseBuildIntent("بهترین کارت گرافیک را نشان بده")).toBeUndefined();
  });
});

describe("findMinimumPriceBuild", () => {
  it("selects the cheapest complete compatible combination", () => {
    const recommendation = findMinimumPriceBuild(catalog);

    expect(recommendation?.selection.graphic).toBe(1);
    expect(recommendation?.totalPrice).toBe(800);
  });

  it("returns no build when the compatible result exceeds the budget", () => {
    expect(findMinimumPriceBuild(catalog, 799)).toBeUndefined();
  });

  it("handles expanded catalogs without materializing every combination", () => {
    const expandedCatalog = Object.fromEntries(
      Object.entries(catalog).map(([partType, products]) => [
        partType,
        Array.from({ length: 50 }, () => ({ ...products[0] })),
      ]),
    ) as BuildCatalog;

    expect(findMinimumPriceBuild(expandedCatalog)?.totalPrice).toBe(800);
  });
});

describe("calculatePsuRequirement", () => {
  it("includes platform load, cooling, headroom, and the GPU minimum", () => {
    expect(
      calculatePsuRequirement({
        cpu: catalog.cpu[0],
        graphic: catalog.graphic[0],
        fan: { ...catalog.fan[0], powerDrawW: 5 },
      }),
    ).toEqual({
      cpuPowerW: 100,
      graphicPowerW: 150,
      coolingPowerW: 5,
      platformPowerW: 95,
      estimatedLoadW: 350,
      safetyHeadroomW: 88,
      manufacturerMinimumW: 550,
      recommendedPsuW: 550,
    });
  });

  it("raises the recommendation for a high-power CPU and GPU combination", () => {
    expect(
      calculatePsuRequirement({
        cpu: { ...catalog.cpu[0], maxTurboPowerW: 250 },
        graphic: {
          ...catalog.graphic[0],
          boardPowerW: 360,
          psu: "850",
        },
        fan: { ...catalog.fan[0], powerDrawW: 5 },
      })?.recommendedPsuW,
    ).toBe(900);
  });
});

describe("isBuildCompatible", () => {
  const build = findMinimumPriceBuild(catalog)!.products;

  it("accepts a complete build after checking every part", () => {
    expect(isBuildCompatible(build)).toBe(true);
  });

  it.each([
    ["insufficient RAM", { ram: { ...build.ram, capacityGb: 8 } }],
    ["undersized cooler", { fan: { ...build.fan, coolingCapacityW: 99 } }],
    ["undersized power supply", { power: { ...build.power, psu: "500" } }],
    ["unsupported SSD", { ssd: { ...build.ssd, form: "2.5-inch" } }],
    [
      "undersized case",
      {
        case: {
          ...build.case,
          form: "Micro Tower",
          motherboardSizes: [],
        },
      },
    ],
  ])("rejects an %s", (_label, replacement) => {
    expect(isBuildCompatible({ ...build, ...replacement })).toBe(false);
  });

  it("recognizes LGA115x as an LGA1150/1151 socket family", () => {
    expect(
      isBuildCompatible({
        ...build,
        cpu: { ...build.cpu, cpu_socket: "LGA1151" },
        motherboard: { ...build.motherboard, cpu_socket: "LGA1151" },
        fan: { ...build.fan, cpu_sockets: "LGA115x" },
      }),
    ).toBe(true);
  });

  it("intersects every available constraint for manual selections", () => {
    expect(
      isPartialBuildCompatible({
        cpu: build.cpu,
        graphic: catalog.graphic[1],
        power: build.power,
      }),
    ).toBe(false);
  });

  it("uses RAM module quantity for capacity and slot validation", () => {
    const eightGbRam = { ...build.ram, capacityGb: 8, quantity: 2 };

    expect(
      isPartialBuildCompatible({
        cpu: build.cpu,
        motherboard: { ...build.motherboard, total_slot_ram: 2 },
        ram: eightGbRam,
      }),
    ).toBe(true);
    expect(
      isPartialBuildCompatible({
        cpu: build.cpu,
        motherboard: { ...build.motherboard, total_slot_ram: 1 },
        ram: eightGbRam,
      }),
    ).toBe(false);
  });

  it("filters refreshed URL selections using the canonical CPU", () => {
    const coreUltra9 = cpus.find((cpu) => cpu.id === 8);
    const compatibleFans = fans.filter((fan) =>
      isPartialBuildCompatible({ cpu: coreUltra9, fan }),
    );

    expect(compatibleFans.map((fan) => fan.id)).toEqual([5]);
  });
});

import { cpus } from "./cpus";
import { cases } from "./cases";
import { fans } from "./fans";
import { graphics } from "./graphics";
import { motherboards } from "./motherboards";
import { powers } from "./powers";
import { rams } from "./rams";
import { ssds } from "./ssds";

describe("CPU product catalog", () => {
  it("contains unique IDs and valid Torob product URLs", () => {
    expect(cpus).toHaveLength(12);
    expect(new Set(cpus.map((cpu) => cpu.id)).size).toBe(cpus.length);

    cpus.forEach((cpu) => {
      expect(cpu.torobUrl).toMatch(/^https:\/\/torob\.com\/p\//);
    });
  });

  it("marks the Core i5-4590 as used", () => {
    expect(cpus.find((cpu) => cpu.id === 12)).toMatchObject({
      name: "Intel Core i5-4590",
      condition: "used",
      cpu_socket: "LGA1150",
      motherboards: [5],
    });
  });

  it("keeps every CPU compatibility relation reciprocal", () => {
    cpus.forEach((cpu) => {
      expect(cpu.motherboards.length).toBeGreaterThan(0);
      cpu.motherboards.forEach((id) => {
        expect(motherboards.find((item) => item.id === id)?.cpus).toContain(
          cpu.id,
        );
      });
      cpu.rams.forEach((id) => {
        expect(rams.find((item) => item.id === id)?.cpus).toContain(cpu.id);
      });
      cpu.graphics.forEach((id) => {
        expect(graphics.find((item) => item.id === id)?.cpus).toContain(cpu.id);
      });
      cpu.fans.forEach((id) => {
        expect(fans.find((item) => item.id === id)?.cpus).toContain(cpu.id);
      });
    });
  });

  it("excludes severely bottlenecked CPU and GPU pairings", () => {
    const coreI5_4590 = cpus.find((cpu) => cpu.id === 12);
    const rtx5070 = graphics.find((graphic) => graphic.id === 4);

    expect(coreI5_4590?.graphics).not.toContain(rtx5070?.id);
    expect(rtx5070?.cpus).not.toContain(coreI5_4590?.id);
  });
});

describe("case product catalog", () => {
  it("contains unique products and valid Torob product URLs", () => {
    expect(cases).toHaveLength(24);
    expect(new Set(cases.map((item) => item.id)).size).toBe(cases.length);
    expect(new Set(cases.map((item) => item.name)).size).toBe(cases.length);
    expect(new Set(cases.map((item) => item.torobUrl)).size).toBe(cases.length);
    cases.forEach((item) => {
      expect(item.torobUrl).toMatch(/^https:\/\/torob\.com\/p\//);
      expect(item.motherboardSizes).toBeDefined();
    });
  });
});

describe("motherboard product catalog", () => {
  it("contains unique products with valid Torob product URLs", () => {
    expect(motherboards).toHaveLength(10);
    expect(
      new Set(motherboards.map((motherboard) => motherboard.id)).size,
    ).toBe(motherboards.length);
    expect(
      new Set(motherboards.map((motherboard) => motherboard.name)).size,
    ).toBe(motherboards.length);
    expect(
      new Set(motherboards.map((motherboard) => motherboard.torobUrl)).size,
    ).toBe(motherboards.length);
    motherboards.forEach((motherboard) => {
      expect(motherboard.torobUrl).toMatch(/^https:\/\/torob\.com\/p\//);
      expect(motherboard.storageForms.length).toBeGreaterThan(0);
    });
  });

  it("keeps CPU and RAM relations reciprocal", () => {
    motherboards.forEach((motherboard) => {
      motherboard.cpus.forEach((id) => {
        const cpu = cpus.find((item) => item.id === id);
        expect(cpu?.motherboards).toContain(motherboard.id);
        expect(cpu?.cpu_socket).toBe(motherboard.cpu_socket);
      });
      motherboard.rams.forEach((id) => {
        expect(rams.find((item) => item.id === id)?.motherboards).toContain(
          motherboard.id,
        );
      });
    });
  });
});

describe("RAM product catalog", () => {
  it("contains unique products with valid Torob product URLs", () => {
    expect(rams).toHaveLength(4);
    expect(new Set(rams.map((ram) => ram.id)).size).toBe(rams.length);
    expect(new Set(rams.map((ram) => ram.name)).size).toBe(rams.length);
    expect(new Set(rams.map((ram) => ram.torobUrl)).size).toBe(rams.length);
    rams.forEach((ram) => {
      expect(ram.torobUrl).toMatch(/^https:\/\/torob\.com\/p\//);
    });
  });

  it("keeps CPU and motherboard compatibility relations reciprocal", () => {
    rams.forEach((ram) => {
      ram.cpus.forEach((id) => {
        expect(cpus.find((cpu) => cpu.id === id)?.rams).toContain(ram.id);
      });
      ram.motherboards.forEach((id) => {
        expect(
          motherboards.find((motherboard) => motherboard.id === id)?.rams,
        ).toContain(ram.id);
      });
    });
  });

  it("links the used Kingston DDR3 module to the H81 platform", () => {
    expect(rams.find((ram) => ram.id === 4)).toMatchObject({
      condition: "used",
      capacityGb: 8,
      cpus: [12],
      motherboards: [5],
    });
    expect(cpus.find((cpu) => cpu.id === 12)?.rams).toContain(4);
    expect(
      motherboards.find((motherboard) => motherboard.id === 5)?.rams,
    ).toContain(4);
  });
});

describe("fan product catalog", () => {
  it("contains unique products and valid Torob product URLs", () => {
    expect(fans).toHaveLength(20);
    expect(new Set(fans.map((fan) => fan.id)).size).toBe(fans.length);
    expect(new Set(fans.map((fan) => fan.name)).size).toBe(fans.length);
    expect(new Set(fans.map((fan) => fan.torobUrl)).size).toBe(fans.length);
    fans.forEach((fan) => {
      expect(fan.torobUrl).toMatch(/^https:\/\/torob\.com\/p\//);
    });
  });

  it("keeps CPU compatibility relations reciprocal", () => {
    fans.forEach((fan) => {
      expect(fan.powerDrawW).toBeGreaterThan(0);
      fan.cpus.forEach((id) => {
        expect(cpus.find((cpu) => cpu.id === id)?.fans).toContain(fan.id);
      });
    });
  });

  it("pairs the Core Ultra 9 285K with sufficient cooling", () => {
    const coreUltra9 = cpus.find((cpu) => cpu.id === 8);
    const assassinIv = fans.find((fan) => fan.id === 5);

    expect(assassinIv).toMatchObject({
      name: "DeepCool Assassin IV",
      coolingCapacityW: 280,
      cpus: [8],
    });
    expect(assassinIv?.cpu_sockets).toContain("LGA1851");
    expect(coreUltra9?.fans).toContain(assassinIv?.id);
    expect(assassinIv?.coolingCapacityW).toBeGreaterThanOrEqual(
      coreUltra9?.maxTurboPowerW ?? Number.POSITIVE_INFINITY,
    );
  });
});

describe("SSD product catalog", () => {
  it("contains unique internal drives and valid Torob product URLs", () => {
    expect(ssds).toHaveLength(24);
    expect(new Set(ssds.map((ssd) => ssd.id)).size).toBe(ssds.length);
    expect(new Set(ssds.map((ssd) => ssd.name)).size).toBe(ssds.length);
    expect(new Set(ssds.map((ssd) => ssd.torobUrl)).size).toBe(ssds.length);
    ssds.forEach((ssd) => {
      expect(ssd.torobUrl).toMatch(/^https:\/\/torob\.com\/p\//);
      expect(["M.2", "2.5-inch"]).toContain(ssd.form);
    });
  });
});

describe("graphics product catalog", () => {
  it("contains unique IDs and valid Torob product URLs", () => {
    expect(graphics).toHaveLength(10);
    expect(new Set(graphics.map((graphic) => graphic.id)).size).toBe(
      graphics.length,
    );
    graphics.forEach((graphic) => {
      expect(graphic.torobUrl).toMatch(/^https:\/\/torob\.com\/p\//);
    });
  });

  it("only links GPUs to sufficient power supplies", () => {
    graphics.forEach((graphic) => {
      graphic.powers.forEach((id) => {
        const power = powers.find((item) => item.id === id);
        expect(power?.graphics).toContain(graphic.id);
        expect(Number(power?.psu)).toBeGreaterThanOrEqual(Number(graphic.psu));
      });
    });

    powers.forEach((power) => {
      power.graphics.forEach((id) => {
        expect(graphics.find((item) => item.id === id)?.powers).toContain(
          power.id,
        );
      });
    });
  });

  it("keeps CPU compatibility relations reciprocal", () => {
    graphics.forEach((graphic) => {
      graphic.cpus.forEach((id) => {
        expect(cpus.find((cpu) => cpu.id === id)?.graphics).toContain(
          graphic.id,
        );
      });
    });
  });

  it("keeps power supplies unique", () => {
    expect(new Set(powers.map((power) => power.id)).size).toBe(powers.length);
    expect(new Set(powers.map((power) => power.name)).size).toBe(powers.length);
    expect(new Set(powers.map((power) => power.torobUrl)).size).toBe(
      powers.length,
    );
  });
});

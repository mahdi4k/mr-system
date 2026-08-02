import type { CASE } from "@/_redux/services/caseApi";
import type { CPU } from "@/_redux/services/cpuApi";
import type { FAN } from "@/_redux/services/fanApi";
import type { Graphic } from "@/_redux/services/graphicApi";
import type { Motherboard } from "@/_redux/services/motherboardApi";
import type { POWER } from "@/_redux/services/powerApi";
import type { RAM } from "@/_redux/services/ramApi";
import type { SSD } from "@/_redux/services/ssdApi";

export const cpus: CPU[] = [
  {
    id: 1,
    name: "Intel Core i3-12100F",
    torobUrl:
      "https://torob.com/p/a1a69157-6d00-41b6-ac31-4e0e04651861/%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%DB%8C%D9%86%D8%AA%D9%84-%D9%85%D8%AF%D9%84-core-i3-12100f-alder-lake-tray/",
    cpu_socket: "LGA1700",
    integrated_graphic: "ندارد",
    manufacturer: "Intel",
    attributes: ["4 cores", "8 threads", "4.3 GHz max turbo"],
    image: "/svg/cpu.svg",
    motherboards: [1],
    fans: [1],
    graphics: [1],
    links:
      "https://torob.com/p/a1a69157-6d00-41b6-ac31-4e0e04651861/%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%DB%8C%D9%86%D8%AA%D9%84-%D9%85%D8%AF%D9%84-core-i3-12100f-alder-lake-tray/",
    brand: "Intel",
    rams: [1],
  },
];

export const graphics: Graphic[] = [
  {
    id: 1,
    name: "ASUS Dual GeForce RTX 5050 OC 8GB",
    torobUrl:
      "https://torob.com/p/b6d1f477-7c97-408f-93e1-4338dad1f7ae/%DA%A9%D8%A7%D8%B1%D8%AA-%DA%AF%D8%B1%D8%A7%D9%81%DB%8C%DA%A9-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-dual-rtx-5050-oc-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-8-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/",
    manufacturer: "NVIDIA",
    attributes: ["8GB GDDR6", "2560 CUDA cores", "OC Edition"],
    links:
      "https://torob.com/p/b6d1f477-7c97-408f-93e1-4338dad1f7ae/%DA%A9%D8%A7%D8%B1%D8%AA-%DA%AF%D8%B1%D8%A7%D9%81%DB%8C%DA%A9-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-dual-rtx-5050-oc-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-8-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/",
    type: "GDDR6",
    ram: 8,
    image: "/svg/graphic.svg",
    cpus: [1],
    brand: "ASUS",
    psu: "550",
    powers: [1],
  },
];

export const motherboards: Motherboard[] = [
  {
    id: 1,
    name: "ASUS Prime H610M-K D4",
    torobUrl:
      "https://torob.com/p/30c6c44e-e74f-4fd0-84e7-acf79d7378c6/%D9%85%D8%A7%D8%AF%D8%B1%D8%A8%D8%B1%D8%AF-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-prime-h610m-k-d4-ddr4/",
    size: "Micro-ATX",
    total_slot_ram: 2,
    brand: "ASUS",
    cpu_socket: "LGA1700",
    ddr4: true,
    wifi_support: false,
    links:
      "https://torob.com/p/30c6c44e-e74f-4fd0-84e7-acf79d7378c6/%D9%85%D8%A7%D8%AF%D8%B1%D8%A8%D8%B1%D8%AF-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-prime-h610m-k-d4-ddr4/",
    image: "/svg/motherboard.svg",
    cpus: [1],
    rams: [1],
    attributes: ["Intel H610 chipset", "DDR4", "PCIe 4.0"],
  },
];

export const rams: RAM[] = [
  {
    id: 1,
    name: "Crucial CT16 16GB DDR4-3200 CL22",
    torobUrl:
      "https://torob.com/p/836e24d4-beb8-4541-b281-cd82eafa0943/%D8%B1%D9%85-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%A9%D8%B1%D9%88%D8%B4%DB%8C%D8%A7%D9%84-%D8%AA%DA%A9-%DA%A9%D8%A7%D9%86%D8%A7%D9%84%D9%87-%D9%85%D8%AF%D9%84-ct16-%D9%81%D8%B1%DA%A9%D8%A7%D9%86%D8%B3-3200-%D9%85%DA%AF%D8%A7%D9%87%D8%B1%D8%AA%D8%B2-ddr4-%D8%AA%D8%A7%DB%8C%D9%85%DB%8C%D9%86%DA%AF-cl22-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-16-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/",
    frequency: "3200MHz",
    brand: "Crucial",
    rgb: false,
    image: "/svg/ram.svg",
    links:
      "https://torob.com/p/836e24d4-beb8-4541-b281-cd82eafa0943/%D8%B1%D9%85-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%A9%D8%B1%D9%88%D8%B4%DB%8C%D8%A7%D9%84-%D8%AA%DA%A9-%DA%A9%D8%A7%D9%86%D8%A7%D9%84%D9%87-%D9%85%D8%AF%D9%84-ct16-%D9%81%D8%B1%DA%A9%D8%A7%D9%86%D8%B3-3200-%D9%85%DA%AF%D8%A7%D9%87%D8%B1%D8%AA%D8%B2-ddr4-%D8%AA%D8%A7%DB%8C%D9%85%DB%8C%D9%86%DA%AF-cl22-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-16-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/",
    cpus: [1],
    motherboards: [1],
  },
];

export const powers: POWER[] = [
  {
    id: 1,
    name: "DeepCool PL650D 650W",
    torobUrl:
      "https://torob.com/p/88c61612-a603-4d68-8f8b-6459287ab00f/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-pl650d-80-plus-bronze-%D8%AA%D9%88%D8%A7%D9%86-650-%D9%88%D8%A7%D8%AA/",
    attributes: ["80 Plus Bronze", "ATX 3.0", "120mm Fan"],
    image: "/svg/power.svg",
    links:
      "https://torob.com/p/88c61612-a603-4d68-8f8b-6459287ab00f/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-pl650d-80-plus-bronze-%D8%AA%D9%88%D8%A7%D9%86-650-%D9%88%D8%A7%D8%AA/",
    graphics: [1],
    brand: "DeepCool",
    psu: "650",
    modular: 1,
  },
];

export const cases: CASE[] = [
  {
    id: 1,
    name: "Green Homa Mid Tower Gray",
    torobUrl:
      "https://torob.com/p/c2a1a2af-1a76-4620-80bd-2a8cc960d2a5/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-homa-mid-tower-%D8%AE%D8%A7%DA%A9%D8%B3%D8%AA%D8%B1%DB%8C/",
    max_total_fan: "5",
    brand: "Green",
    form: "Mid Tower",
    rgb: false,
    image: "/svg/case.svg",
    links:
      "https://torob.com/p/c2a1a2af-1a76-4620-80bd-2a8cc960d2a5/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-homa-mid-tower-%D8%AE%D8%A7%DA%A9%D8%B3%D8%AA%D8%B1%DB%8C/",
  },
];

export const fans: FAN[] = [
  {
    id: 1,
    name: "DeepCool AG200",
    torobUrl:
      "https://torob.com/p/b2d5159a-cfa2-44ee-a3b1-9ff7b3490562/%D9%81%D9%86-%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-ag200/",
    fan_noise: "31.6 dBA",
    heat_sink_material: "Aluminum with copper heat pipes",
    cpu_sockets: "LGA1700, LGA1200, LGA115x, AM5, AM4",
    rgb: false,
    image: "/svg/fan.svg",
    links:
      "https://torob.com/p/b2d5159a-cfa2-44ee-a3b1-9ff7b3490562/%D9%81%D9%86-%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-ag200/",
    cpus: [1],
    brand: "DeepCool",
  },
];

export const ssds: SSD[] = [
  {
    id: 1,
    name: "Lexar NS100 256GB",
    torobUrl:
      "https://torob.com/p/7effdb3d-4e90-4432-adf5-54960dc91ea1/%D8%AD%D8%A7%D9%81%D8%B8%D9%87-%D8%A7%D8%B3-%D8%A7%D8%B3-%D8%AF%DB%8C-%D8%A7%DB%8C%D9%86%D8%AA%D8%B1%D9%86%D8%A7%D9%84-%D9%84%DA%A9%D8%B3%D8%A7%D8%B1-%D9%85%D8%AF%D9%84-ns100-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-256-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/",
    size: "256GB",
    brand: "Lexar",
    read: "520 MB/s",
    write: "440 MB/s",
    age: "3 سال",
    image: "/svg/ssd.svg",
    form: "2.5-inch",
    links:
      "https://torob.com/p/7effdb3d-4e90-4432-adf5-54960dc91ea1/%D8%AD%D8%A7%D9%81%D8%B8%D9%87-%D8%A7%D8%B3-%D8%A7%D8%B3-%D8%AF%DB%8C-%D8%A7%DB%8C%D9%86%D8%AA%D8%B1%D9%86%D8%A7%D9%84-%D9%84%DA%A9%D8%B3%D8%A7%D8%B1-%D9%85%D8%AF%D9%84-ns100-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-256-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/",
  },
];

export const getCpu = (id: string): CPU | undefined =>
  cpus.find((cpu) => cpu.id === Number(id));

export const getCpusByIds = (ids: number[]): CPU[] =>
  cpus.filter((cpu) => ids.includes(cpu.id));

export const getGraphic = (id: string): Graphic | undefined =>
  graphics.find((graphic) => graphic.id === Number(id));

export const getGraphicsByIds = (ids: number[]): Graphic[] =>
  graphics.filter((graphic) => ids.includes(graphic.id));

export const getMotherboard = (id: string): Motherboard | undefined =>
  motherboards.find((motherboard) => motherboard.id === Number(id));

export const getMotherboardsByIds = (ids: number[]): Motherboard[] =>
  motherboards.filter((motherboard) => ids.includes(motherboard.id));

export const getRam = (id: string): RAM | undefined =>
  rams.find((ram) => ram.id === Number(id));

export const getRamsByIds = (ids: number[]): RAM[] =>
  rams.filter((ram) => ids.includes(ram.id));

export const getPower = (id: string): POWER | undefined =>
  powers.find((power) => power.id === Number(id));

export const getPowersByIds = (ids: number[]): POWER[] =>
  powers.filter((power) => ids.includes(power.id));

export const getCase = (id: string): CASE | undefined =>
  cases.find((caseItem) => caseItem.id === Number(id));

export const getFan = (id: string): FAN | undefined =>
  fans.find((fan) => fan.id === Number(id));

export const getFansByIds = (ids: number[]): FAN[] =>
  fans.filter((fan) => ids.includes(fan.id));

export const getSsd = (id: string): SSD | undefined =>
  ssds.find((ssd) => ssd.id === Number(id));

export const filterCpus = (filters: {
  manufacturer?: string[];
  search?: string;
}): CPU[] => {
  let result = cpus;

  if (filters.manufacturer?.length) {
    result = result.filter((cpu) =>
      filters.manufacturer?.includes(cpu.manufacturer),
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((cpu) => cpu.name.toLowerCase().includes(search));
  }

  return result;
};

export const filterGraphics = (filters: {
  manufacturer?: string[];
  search?: string;
}): Graphic[] => {
  let result = graphics;

  if (filters.manufacturer?.length) {
    result = result.filter((graphic) =>
      filters.manufacturer?.includes(graphic.manufacturer),
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((graphic) =>
      graphic.name.toLowerCase().includes(search),
    );
  }

  return result;
};

export const filterMotherboards = (filters: {
  manufacturer?: string[];
  search?: string;
}): Motherboard[] => {
  let result = motherboards;

  if (filters.manufacturer?.length) {
    result = result.filter((motherboard) =>
      filters.manufacturer?.includes(motherboard.brand),
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((motherboard) =>
      motherboard.name.toLowerCase().includes(search),
    );
  }

  return result;
};

export const filterPowers = (filters: {
  modular?: string[];
  search?: string;
}): POWER[] => {
  let result = powers;

  if (filters.modular?.length) {
    result = result.filter((power) =>
      filters.modular?.includes(String(power.modular)),
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((power) =>
      power.name.toLowerCase().includes(search),
    );
  }

  return result;
};

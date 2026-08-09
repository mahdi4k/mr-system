import type { RAM } from "@/_redux/services/ramApi";

const ddr4TorobUrl =
  "https://torob.com/p/836e24d4-beb8-4541-b281-cd82eafa0943/%D8%B1%D9%85-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%A9%D8%B1%D9%88%D8%B4%DB%8C%D8%A7%D9%84-%D8%AA%DA%A9-%DA%A9%D8%A7%D9%86%D8%A7%D9%84%D9%87-%D9%85%D8%AF%D9%84-ct16-%D9%81%D8%B1%DA%A9%D8%A7%D9%86%D8%B3-3200-%D9%85%DA%AF%D8%A7%D9%87%D8%B1%D8%AA%D8%B2-ddr4-%D8%AA%D8%A7%DB%8C%D9%85%DB%8C%D9%86%DA%AF-cl22-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-16-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/";
const ddr5_8gbTorobUrl =
  "https://torob.com/p/98c148ee-5abc-4036-af0d-52717f0c4d8e/%D8%B1%D9%85-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%A9%D8%B1%D9%88%D8%B4%DB%8C%D8%A7%D9%84-%D8%AA%DA%A9-%DA%A9%D8%A7%D9%86%D8%A7%D9%84%D9%87-%D9%85%D8%AF%D9%84-ct8-%D9%81%D8%B1%DA%A9%D8%A7%D9%86%D8%B3-4800-%D9%85%DA%AF%D8%A7%D9%87%D8%B1%D8%AA%D8%B2-ddr5-%D8%AA%D8%A7%DB%8C%D9%85%DB%8C%D9%86%DA%AF-cl40-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-8-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/";
const ddr5_32gbTorobUrl =
  "https://torob.com/p/07322669-41bc-44a4-8b6c-256b8fc7ed41/%D8%B1%D9%85-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%A9%D8%B1%D9%88%D8%B4%DB%8C%D8%A7%D9%84-%D8%AA%DA%A9-%DA%A9%D8%A7%D9%86%D8%A7%D9%84%D9%87-ct32-%D9%81%D8%B1%DA%A9%D8%A7%D9%86%D8%B3-5600-%D9%85%DA%AF%D8%A7%D9%87%D8%B1%D8%AA%D8%B2-ddr5-%D8%AA%D8%A7%DB%8C%D9%85%DB%8C%D9%86%DA%AF-cl46-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-32-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/";
const ddr3_8gbTorobUrl =
  "https://torob.com/p/47acec09-6231-4145-a256-f26daa733239/%D8%B1%D9%85-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%A9%DB%8C%D9%86%DA%AF%D8%B3%D8%AA%D9%88%D9%86-%D8%AA%DA%A9-%DA%A9%D8%A7%D9%86%D8%A7%D9%84%D9%87-%D9%85%D8%AF%D9%84-kvr-%D9%81%D8%B1%DA%A9%D8%A7%D9%86%D8%B3-1600-%D9%85%DA%AF%D8%A7%D9%87%D8%B1%D8%AA%D8%B2-ddr3-%D8%AA%D8%A7%DB%8C%D9%85%DB%8C%D9%86%DA%AF-cl11-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-8-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA-%D8%A7%D8%B3%D8%AA%D9%88%DA%A9/";

export const rams: RAM[] = [
  {
    id: 1,
    name: "Crucial CT16 16GB DDR4-3200 CL22",
    torobUrl: ddr4TorobUrl,
    frequency: "3200MHz",
    brand: "Crucial",
    rgb: false,
    image: "/svg/ram.svg",
    links: ddr4TorobUrl,
    cpus: [1, 2, 3, 4, 6, 9, 10, 11],
    motherboards: [1, 2, 3, 6, 7, 8],
    capacityGb: 16,
  },
  {
    id: 2,
    name: "Crucial CT8 8GB DDR5-4800 CL40",
    torobUrl: ddr5_8gbTorobUrl,
    frequency: "4800MHz",
    brand: "Crucial",
    rgb: false,
    image: "/svg/ram.svg",
    links: ddr5_8gbTorobUrl,
    cpus: [1, 2, 3, 5, 7, 8, 9, 10],
    motherboards: [4, 9, 10],
    capacityGb: 8,
  },
  {
    id: 3,
    name: "Crucial CT32 32GB DDR5-5600 CL46",
    torobUrl: ddr5_32gbTorobUrl,
    frequency: "5600MHz",
    brand: "Crucial",
    rgb: false,
    image: "/svg/ram.svg",
    links: ddr5_32gbTorobUrl,
    cpus: [1, 2, 3, 5, 7, 8, 9, 10],
    motherboards: [4, 9, 10],
    capacityGb: 32,
  },
  {
    id: 4,
    name: "Kingston KVR 8GB DDR3-1600 CL11",
    torobUrl: ddr3_8gbTorobUrl,
    condition: "used",
    frequency: "1600MHz",
    brand: "Kingston",
    rgb: false,
    image: "/svg/ram.svg",
    links: ddr3_8gbTorobUrl,
    cpus: [12],
    motherboards: [5],
    capacityGb: 8,
  },
];

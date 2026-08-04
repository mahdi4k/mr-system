import type { RAM } from "@/_redux/services/ramApi";

const torobUrl =
  "https://torob.com/p/836e24d4-beb8-4541-b281-cd82eafa0943/%D8%B1%D9%85-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%A9%D8%B1%D9%88%D8%B4%DB%8C%D8%A7%D9%84-%D8%AA%DA%A9-%DA%A9%D8%A7%D9%86%D8%A7%D9%84%D9%87-%D9%85%D8%AF%D9%84-ct16-%D9%81%D8%B1%DA%A9%D8%A7%D9%86%D8%B3-3200-%D9%85%DA%AF%D8%A7%D9%87%D8%B1%D8%AA%D8%B2-ddr4-%D8%AA%D8%A7%DB%8C%D9%85%DB%8C%D9%86%DA%AF-cl22-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-16-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/";

export const rams: RAM[] = [
  {
    id: 1,
    name: "Crucial CT16 16GB DDR4-3200 CL22",
    torobUrl,
    frequency: "3200MHz",
    brand: "Crucial",
    rgb: false,
    image: "/svg/ram.svg",
    links: torobUrl,
    cpus: [1, 2],
    motherboards: [1, 2],
  },
];

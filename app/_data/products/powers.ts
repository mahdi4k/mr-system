import type { POWER } from "@/_redux/services/powerApi";

const pl650dTorobUrl =
  "https://torob.com/p/88c61612-a603-4d68-8f8b-6459287ab00f/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-pl650d-80-plus-bronze-%D8%AA%D9%88%D8%A7%D9%86-650-%D9%88%D8%A7%D8%AA/";
const pq750gTorobUrl =
  "https://torob.com/p/09359498-16de-42ae-a3e5-3baf88c2a0df/%D9%BE%D8%A7%D9%88%D8%B1-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-pq750g-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-750-%D9%88%D8%A7%D8%AA-%D8%AA%D9%85%D8%A7%D9%85-%D9%85%D8%A7%DA%98%D9%88%D9%84%D8%A7%D8%B1-80-%D9%BE%D9%84%D8%A7%D8%B3-%DA%AF%D9%84%D8%AF/";

export const powers: POWER[] = [
  {
    id: 1,
    name: "DeepCool PL650D 650W",
    torobUrl: pl650dTorobUrl,
    attributes: ["80 Plus Bronze", "ATX 3.0", "120mm Fan"],
    image: "/svg/power.svg",
    links: pl650dTorobUrl,
    graphics: [1, 2],
    brand: "DeepCool",
    psu: "650",
    modular: 1,
  },
  {
    id: 2,
    name: "DeepCool PQ750G 750W",
    torobUrl: pq750gTorobUrl,
    attributes: ["80 Plus Gold", "ATX 3.1", "Fully Modular"],
    image: "/svg/power.svg",
    links: pq750gTorobUrl,
    graphics: [1, 2],
    brand: "DeepCool",
    psu: "750",
    modular: 3,
  },
];

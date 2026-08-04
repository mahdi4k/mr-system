import type { CPU } from "@/_redux/services/cpuApi";

const coreI3TorobUrl =
  "https://torob.com/p/a1a69157-6d00-41b6-ac31-4e0e04651861/%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%DB%8C%D9%86%D8%AA%D9%84-%D9%85%D8%AF%D9%84-core-i3-12100f-alder-lake-tray/";
const coreI5TorobUrl =
  "https://torob.com/p/7af4bb43-81b0-4160-92ff-7db0d5da3dfa/%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%DB%8C%D9%86%D8%AA%D9%84-core-i5-14400f-raptor-lake-refresh-tray/";

export const cpus: CPU[] = [
  {
    id: 1,
    name: "Intel Core i3-12100F",
    torobUrl: coreI3TorobUrl,
    cpu_socket: "LGA1700",
    integrated_graphic: "ندارد",
    manufacturer: "Intel",
    attributes: ["4 cores", "8 threads", "4.3 GHz max turbo"],
    image: "/svg/cpu.svg",
    motherboards: [1, 2],
    fans: [1, 2],
    graphics: [1, 2],
    links: coreI3TorobUrl,
    brand: "Intel",
    rams: [1],
    recommendations: { motherboard: [1] },
  },
  {
    id: 2,
    name: "Intel Core i5-14400F",
    torobUrl: coreI5TorobUrl,
    cpu_socket: "LGA1700",
    integrated_graphic: "ندارد",
    manufacturer: "Intel",
    attributes: ["10 cores", "16 threads", "4.7 GHz max turbo"],
    image: "/svg/cpu.svg",
    motherboards: [1, 2],
    fans: [1, 2],
    graphics: [1, 2],
    links: coreI5TorobUrl,
    brand: "Intel",
    rams: [1],
    recommendations: { motherboard: [2] },
  },
];

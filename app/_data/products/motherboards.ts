import type { Motherboard } from "@/_redux/services/motherboardApi";

const h610TorobUrl =
  "https://torob.com/p/30c6c44e-e74f-4fd0-84e7-acf79d7378c6/%D9%85%D8%A7%D8%AF%D8%B1%D8%A8%D8%B1%D8%AF-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-prime-h610m-k-d4-ddr4/";
const b760TorobUrl =
  "https://torob.com/p/1211f4ac-e124-4fe5-b416-858612cd5209/%D9%85%D8%A7%D8%AF%D8%B1%D8%A8%D8%B1%D8%AF-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-%D9%85%D8%AF%D9%84-prime-b760-plus-ddr4/";

export const motherboards: Motherboard[] = [
  {
    id: 1,
    name: "ASUS Prime H610M-K D4",
    torobUrl: h610TorobUrl,
    size: "Micro-ATX",
    total_slot_ram: 2,
    brand: "ASUS",
    cpu_socket: "LGA1700",
    ddr4: true,
    wifi_support: false,
    links: h610TorobUrl,
    image: "/svg/motherboard.svg",
    cpus: [1, 2],
    rams: [1],
    attributes: ["Intel H610 chipset", "DDR4", "PCIe 4.0"],
    recommendations: { cpu: [1] },
  },
  {
    id: 2,
    name: "ASUS Prime B760-Plus D4",
    torobUrl: b760TorobUrl,
    size: "ATX",
    total_slot_ram: 4,
    brand: "ASUS",
    cpu_socket: "LGA1700",
    ddr4: true,
    wifi_support: false,
    links: b760TorobUrl,
    image: "/svg/motherboard.svg",
    cpus: [1, 2],
    rams: [1],
    attributes: ["Intel B760 chipset", "DDR4", "PCIe 5.0"],
    recommendations: { cpu: [2] },
  },
];

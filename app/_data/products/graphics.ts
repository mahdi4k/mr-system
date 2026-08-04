import type { Graphic } from "@/_redux/services/graphicApi";

const rtx5050TorobUrl =
  "https://torob.com/p/b6d1f477-7c97-408f-93e1-4338dad1f7ae/%DA%A9%D8%A7%D8%B1%D8%AA-%DA%AF%D8%B1%D8%A7%D9%81%DB%8C%DA%A9-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-dual-rtx-5050-oc-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-8-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/";
const rtx5060TorobUrl =
  "https://torob.com/p/d3da0fb7-e3c4-4de9-bb03-3c4b0aa037c7/%DA%A9%D8%A7%D8%B1%D8%AA-%DA%AF%D8%B1%D8%A7%D9%81%DB%8C%DA%A9-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-%D9%85%D8%AF%D9%84-prime-rtx-5060-oc-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-8-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/";

export const graphics: Graphic[] = [
  {
    id: 1,
    name: "ASUS Dual GeForce RTX 5050 OC 8GB",
    torobUrl: rtx5050TorobUrl,
    manufacturer: "NVIDIA",
    attributes: ["8GB GDDR6", "2560 CUDA cores", "OC Edition"],
    links: rtx5050TorobUrl,
    type: "GDDR6",
    ram: 8,
    image: "/svg/graphic.svg",
    cpus: [1, 2],
    brand: "ASUS",
    psu: "550",
    powers: [1, 2],
  },
  {
    id: 2,
    name: "ASUS Prime GeForce RTX 5060 OC 8GB",
    torobUrl: rtx5060TorobUrl,
    manufacturer: "NVIDIA",
    attributes: ["8GB GDDR7", "3840 CUDA cores", "OC Edition"],
    links: rtx5060TorobUrl,
    type: "GDDR7",
    ram: 8,
    image: "/svg/graphic.svg",
    cpus: [1, 2],
    brand: "ASUS",
    psu: "550",
    powers: [1, 2],
  },
];

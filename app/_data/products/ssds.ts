import type { SSD } from "@/_redux/services/ssdApi";

const ns100TorobUrl =
  "https://torob.com/p/7effdb3d-4e90-4432-adf5-54960dc91ea1/%D8%AD%D8%A7%D9%81%D8%B8%D9%87-%D8%A7%D8%B3-%D8%A7%D8%B3-%D8%AF%DB%8C-%D8%A7%DB%8C%D9%86%D8%AA%D8%B1%D9%86%D8%A7%D9%84-%D9%84%DA%A9%D8%B3%D8%A7%D8%B1-%D9%85%D8%AF%D9%84-ns100-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-256-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/";
const nq780TorobUrl =
  "https://torob.com/p/f7362c53-f4b5-4efc-940a-4b431b3cb3eb/%D8%AD%D8%A7%D9%81%D8%B8%D9%87-%D8%A7%D8%B3-%D8%A7%D8%B3-%D8%AF%DB%8C-%D8%A7%DB%8C%D9%86%D8%AA%D8%B1%D9%86%D8%A7%D9%84-%D9%84%DA%A9%D8%B3%D8%A7%D8%B1-nq780-m2-2280-nvme-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-1-%D8%AA%D8%B1%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA/";

export const ssds: SSD[] = [
  {
    id: 1,
    name: "Lexar NS100 256GB",
    torobUrl: ns100TorobUrl,
    size: "256GB",
    brand: "Lexar",
    read: "520 MB/s",
    write: "440 MB/s",
    age: "3 سال",
    image: "/svg/ssd.svg",
    form: "2.5-inch",
    links: ns100TorobUrl,
  },
  {
    id: 2,
    name: "Lexar NQ780 1TB NVMe",
    torobUrl: nq780TorobUrl,
    size: "1TB",
    brand: "Lexar",
    read: "7000 MB/s",
    write: "6000 MB/s",
    age: "5 سال",
    image: "/svg/ssd.svg",
    form: "M.2",
    links: nq780TorobUrl,
  },
];

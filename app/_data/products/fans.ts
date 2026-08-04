import type { FAN } from "@/_redux/services/fanApi";

const ag200TorobUrl =
  "https://torob.com/p/b2d5159a-cfa2-44ee-a3b1-9ff7b3490562/%D9%81%D9%86-%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-ag200/";
const ag400TorobUrl =
  "https://torob.com/p/a5bb368e-083b-44e5-a87b-05d32ea7c093/%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-ag400/";

export const fans: FAN[] = [
  {
    id: 1,
    name: "DeepCool AG200",
    torobUrl: ag200TorobUrl,
    fan_noise: "31.6 dBA",
    heat_sink_material: "Aluminum with copper heat pipes",
    cpu_sockets: "LGA1700, LGA1200, LGA115x, AM5, AM4",
    rgb: false,
    image: "/svg/fan.svg",
    links: ag200TorobUrl,
    cpus: [1, 2],
    brand: "DeepCool",
  },
  {
    id: 2,
    name: "DeepCool AG400",
    torobUrl: ag400TorobUrl,
    fan_noise: "31.6 dBA",
    heat_sink_material: "Aluminum with four copper heat pipes",
    cpu_sockets: "LGA1851, LGA1700, LGA1200, LGA115x, AM5, AM4",
    rgb: false,
    image: "/svg/fan.svg",
    links: ag400TorobUrl,
    cpus: [1, 2],
    brand: "DeepCool",
  },
];

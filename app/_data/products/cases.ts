import type { CASE } from "@/_redux/services/caseApi";

const homaTorobUrl =
  "https://torob.com/p/c2a1a2af-1a76-4620-80bd-2a8cc960d2a5/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-homa-mid-tower-%D8%AE%D8%A7%DA%A9%D8%B3%D8%AA%D8%B1%DB%8C/";
const aq15TorobUrl =
  "https://torob.com/p/c1d8ba89-5ec2-4064-933d-71354b718f71/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%88%D8%B3%D8%AA-%D9%85%D8%AF%D9%84-aq15-tg-rgb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/";

export const cases: CASE[] = [
  {
    id: 1,
    name: "Green Homa Mid Tower Gray",
    torobUrl: homaTorobUrl,
    max_total_fan: "5",
    brand: "Green",
    form: "Mid Tower",
    rgb: false,
    image: "/svg/case.svg",
    links: homaTorobUrl,
  },
  {
    id: 2,
    name: "AWEST AQ15-TG RGB Mid Tower Black",
    torobUrl: aq15TorobUrl,
    max_total_fan: "8",
    brand: "AWEST",
    form: "Mid Tower",
    rgb: true,
    image: "/svg/case.svg",
    links: aq15TorobUrl,
  },
];

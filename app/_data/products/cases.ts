import type { CASE } from "@/_redux/services/caseApi";

const torobUrls = {
  homa: "https://torob.com/p/c2a1a2af-1a76-4620-80bd-2a8cc960d2a5/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-homa-mid-tower-%D8%AE%D8%A7%DA%A9%D8%B3%D8%AA%D8%B1%DB%8C/",
  aq15: "https://torob.com/p/c1d8ba89-5ec2-4064-933d-71354b718f71/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%88%D8%B3%D8%AA-%D9%85%D8%AF%D9%84-aq15-tg-rgb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  view71:
    "https://torob.com/p/c89d9f49-d606-4237-8aa3-fd36a54c5ec5/%DA%A9%DB%8C%D8%B3-%DA%AF%DB%8C%D9%85%DB%8C%D9%86%DA%AF-%D8%AA%D8%B1%D9%85%D8%A7%D9%84%D8%AA%DB%8C%DA%A9-%D9%85%D8%AF%D9%84-view-71-tempered-glass-%D9%81%D8%B1%D9%85-%D9%81%D8%A7%DA%A9%D8%AA%D9%88%D8%B1-%D9%81%D9%88%D9%84-%D8%AA%D8%A7%D9%88%D8%B1/",
  cg35White:
    "https://torob.com/p/7dcd0887-ab35-4fe7-be53-340680334d24/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%B3%D8%A7%D8%A8%DB%8C%D8%AA-%D9%85%D8%AF%D9%84-cg-35-rgb-mid-tower-%D8%B3%D9%81%DB%8C%D8%AF/",
  tc4484:
    "https://torob.com/p/896cdf0f-97df-4c4e-a866-e89abe48af86/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AA%D8%B3%DA%A9%D9%88-tc-4484-rgb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  spider03:
    "https://torob.com/p/5052cacc-dab6-401a-a164-d88470ac1bca/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AA%D9%88%DB%8C%D8%B3%D8%AA%D8%AF-%D9%85%D8%A7%DB%8C%D9%86%D8%AF%D8%B2-%D9%85%D8%AF%D9%84-spider-03-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  aq18: "https://torob.com/p/07d7b726-8e30-43bd-b825-bf9ab8a5dd57/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%88%D8%B3%D8%AA-gt-aq18-mb-rgb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  cg35Black:
    "https://torob.com/p/b968fd4b-4755-494b-b3ed-517c21666a4a/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%B3%D8%A7%D8%A8%DB%8C%D8%AA-%D9%85%D8%AF%D9%84-cg-35-rgb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  b275: "https://torob.com/p/33d32cce-9054-415e-aba0-daa7e6cb2f51/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%D8%A7%D8%B1%DA%A9-%D9%81%D9%84%D8%B4-%D9%85%D8%AF%D9%84-b275-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  m100l:
    "https://torob.com/p/26a6743c-e6d5-461f-acfc-b3c1dd908b73/%DA%A9%DB%8C%D8%B3-%DA%AF%DB%8C%D9%85%DB%8C%D9%86%DA%AF-%D8%A7%D9%85-%D8%A7%D8%B3-%D8%A7%DB%8C-%D9%85%D8%AF%D9%84-mag-forge-m100l-%D8%A8%D8%A7-%D9%BE%D8%A7%D9%88%D8%B1-500-%D9%88%D8%A7%D8%AA/",
  lw204:
    "https://torob.com/p/8986df82-8151-4ba5-9766-9880bc65d652/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%88%D8%B1%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-lw204-%D8%A8%D8%BA%D9%84-%D8%B4%DB%8C%D8%B4%D9%87-%D8%A7%DB%8C-%D9%85%D8%A7%D8%AA/",
  ca604:
    "https://torob.com/p/82a2b167-a5ed-4a63-a126-fc9c3f7c698b/%DA%A9%DB%8C%D8%B3-%DA%AF%DB%8C%D9%85%DB%8C%D9%86%DA%AF-%D8%B1%D8%AF%D8%B1%D8%A7%DA%AF%D9%88%D9%86-%D9%85%D8%AF%D9%84-wideload-pro-ca-604/",
  tc4483:
    "https://torob.com/p/43486fbf-a775-461d-bde4-3fa067eaad04/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AA%D8%B3%DA%A9%D9%88-tc-4483-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  ca609:
    "https://torob.com/p/37494c87-62a8-401e-92c6-fc0e1996be6c/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%B1%D8%AF%D8%B1%D8%A7%DA%AF%D9%88%D9%86-%D9%85%D8%AF%D9%84-deflect-ca-609-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  infinityPro:
    "https://torob.com/p/fcac654e-e89b-48de-ace9-2fef2bd437a3/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%DB%8C%D9%85-%D9%85%DA%A9%D8%B3-infinity-pro-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  gc107:
    "https://torob.com/p/d8345503-5e2f-4ded-8365-c7bc6e7dd481/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%DB%8C%D9%85-%D8%AF%DB%8C%D8%A7%D8%B3-%D9%85%D8%AF%D9%84-aura-gc107-elite-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  v100r:
    "https://torob.com/p/2d1cbeb6-2c14-4a95-9605-23c18a85b9c5/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D9%84%DB%8C%D8%A7%D9%86-%D9%84%DB%8C-%D9%85%D8%AF%D9%84-vector-v100r-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  gc4492:
    "https://torob.com/p/7b1dc372-bef0-47d4-b552-153d408250b6/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AA%D8%B3%DA%A9%D9%88-gc-4492-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  gc102m:
    "https://torob.com/p/74d3cee4-5a6d-4e65-9440-b04a5fedb91a/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%DB%8C%D9%85-%D8%AF%DB%8C%D8%A7%D8%B3-%D9%85%D8%AF%D9%84-aura-gc102m-argb-micro-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  aq12: "https://torob.com/p/ea0dd86e-b077-4a44-b24f-feb612efaf4b/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%88%D8%B3%D8%AA-%D9%85%D8%AF%D9%84-gt-aq12-mb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  forge120a:
    "https://torob.com/p/c4053af3-057d-4b34-ae59-1d023ae7dfc3/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%85-%D8%A7%D8%B3-%D8%A7%DB%8C-mag-forge-120a-airflow-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  gc101m:
    "https://torob.com/p/355a33dc-1564-4bec-88d6-b97deeada6b6/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%DB%8C%D9%85-%D8%AF%DB%8C%D8%A7%D8%B3-%D9%85%D8%AF%D9%84-aura-gc101m-argb-micro-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  gc4488:
    "https://torob.com/p/9e7137ee-a8b2-4ece-bfd1-84e81763db17/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AA%D8%B3%DA%A9%D9%88-gc-4488-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
  av02: "https://torob.com/p/43aca6d4-aab7-4ea4-8c22-9e4167c85480/%DA%A9%DB%8C%D8%B3-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%88%D8%B3%D8%AA-gt-av02-bg-argb-mid-tower-%D9%85%D8%B4%DA%A9%DB%8C/",
} as const;

const createCase = (
  item: Omit<CASE, "image" | "links" | "motherboardSizes" | "torobUrl"> & {
    torobUrl: string;
  },
): CASE => ({
  ...item,
  motherboardSizes:
    item.form === "Micro Tower"
      ? ["Micro-ATX"]
      : item.form === "Mid Tower" || item.form === "Full Tower"
        ? ["ATX", "Micro-ATX"]
        : [],
  image: "/svg/case.svg",
  links: item.torobUrl,
});

export const cases: CASE[] = [
  createCase({
    id: 1,
    name: "Green Homa Mid Tower Gray",
    torobUrl: torobUrls.homa,
    max_total_fan: "5",
    brand: "Green",
    form: "Mid Tower",
    rgb: false,
  }),
  createCase({
    id: 2,
    name: "AWEST AQ15-TG RGB Mid Tower Black",
    torobUrl: torobUrls.aq15,
    max_total_fan: "8",
    brand: "AWEST",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 3,
    name: "Thermaltake View 71 Tempered Glass",
    torobUrl: torobUrls.view71,
    max_total_fan: "Unknown",
    brand: "Thermaltake",
    form: "Full Tower",
    rgb: false,
  }),
  createCase({
    id: 4,
    name: "Sabet CG-35 RGB Mid Tower White",
    torobUrl: torobUrls.cg35White,
    max_total_fan: "Unknown",
    brand: "Sabet",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 5,
    name: "TSCO TC 4484 RGB Mid Tower Black",
    torobUrl: torobUrls.tc4484,
    max_total_fan: "Unknown",
    brand: "TSCO",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 6,
    name: "Twisted Minds Spider 03 ARGB Mid Tower Black",
    torobUrl: torobUrls.spider03,
    max_total_fan: "Unknown",
    brand: "Twisted Minds",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 7,
    name: "AWEST GT-AQ18-MB RGB Mid Tower Black",
    torobUrl: torobUrls.aq18,
    max_total_fan: "Unknown",
    brand: "AWEST",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 8,
    name: "Sabet CG-35 RGB Mid Tower Black",
    torobUrl: torobUrls.cg35Black,
    max_total_fan: "Unknown",
    brand: "Sabet",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 9,
    name: "DarkFlash B275 ARGB Mid Tower Black",
    torobUrl: torobUrls.b275,
    max_total_fan: "Unknown",
    brand: "DarkFlash",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 10,
    name: "MSI MAG FORGE M100L with 500W PSU",
    torobUrl: torobUrls.m100l,
    max_total_fan: "Unknown",
    brand: "MSI",
    form: "Micro Tower",
    rgb: false,
  }),
  createCase({
    id: 11,
    name: "Overclock LW204 Tempered Glass",
    torobUrl: torobUrls.lw204,
    max_total_fan: "Unknown",
    brand: "Overclock",
    form: "Unknown",
    rgb: false,
  }),
  createCase({
    id: 12,
    name: "Redragon Wideload Pro CA-604",
    torobUrl: torobUrls.ca604,
    max_total_fan: "Unknown",
    brand: "Redragon",
    form: "Mid Tower",
    rgb: false,
  }),
  createCase({
    id: 13,
    name: "TSCO TC 4483 Mid Tower Black",
    torobUrl: torobUrls.tc4483,
    max_total_fan: "Unknown",
    brand: "TSCO",
    form: "Mid Tower",
    rgb: false,
  }),
  createCase({
    id: 14,
    name: "Redragon Deflect CA-609 ARGB Mid Tower Black",
    torobUrl: torobUrls.ca609,
    max_total_fan: "Unknown",
    brand: "Redragon",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 15,
    name: "GameMax Infinity Pro ARGB Mid Tower Black",
    torobUrl: torobUrls.infinityPro,
    max_total_fan: "Unknown",
    brand: "GameMax",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 16,
    name: "Gamdias Aura GC107 Elite ARGB Mid Tower Black",
    torobUrl: torobUrls.gc107,
    max_total_fan: "Unknown",
    brand: "Gamdias",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 17,
    name: "Lian Li Vector V100R ARGB Mid Tower Black",
    torobUrl: torobUrls.v100r,
    max_total_fan: "Unknown",
    brand: "Lian Li",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 18,
    name: "TSCO GC 4492 ARGB Mid Tower Black",
    torobUrl: torobUrls.gc4492,
    max_total_fan: "Unknown",
    brand: "TSCO",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 19,
    name: "Gamdias Aura GC102M ARGB Micro Tower Black",
    torobUrl: torobUrls.gc102m,
    max_total_fan: "Unknown",
    brand: "Gamdias",
    form: "Micro Tower",
    rgb: true,
  }),
  createCase({
    id: 20,
    name: "AWEST GT-AQ12-MB Mid Tower Black",
    torobUrl: torobUrls.aq12,
    max_total_fan: "Unknown",
    brand: "AWEST",
    form: "Mid Tower",
    rgb: false,
  }),
  createCase({
    id: 21,
    name: "MSI MAG FORGE 120A Airflow ARGB Mid Tower Black",
    torobUrl: torobUrls.forge120a,
    max_total_fan: "Unknown",
    brand: "MSI",
    form: "Mid Tower",
    rgb: true,
  }),
  createCase({
    id: 22,
    name: "Gamdias Aura GC101M ARGB Micro Tower Black",
    torobUrl: torobUrls.gc101m,
    max_total_fan: "Unknown",
    brand: "Gamdias",
    form: "Micro Tower",
    rgb: true,
  }),
  createCase({
    id: 23,
    name: "TSCO GC 4488 Mid Tower Black",
    torobUrl: torobUrls.gc4488,
    max_total_fan: "Unknown",
    brand: "TSCO",
    form: "Mid Tower",
    rgb: false,
  }),
  createCase({
    id: 24,
    name: "AWEST GT-AV02-BG ARGB Mid Tower Black",
    torobUrl: torobUrls.av02,
    max_total_fan: "Unknown",
    brand: "AWEST",
    form: "Mid Tower",
    rgb: true,
  }),
];

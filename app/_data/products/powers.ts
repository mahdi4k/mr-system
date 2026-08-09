import type { POWER } from "@/_redux/services/powerApi";

const torobUrls = {
  pl650d:
    "https://torob.com/p/88c61612-a603-4d68-8f8b-6459287ab00f/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-pl650d-80-plus-bronze-%D8%AA%D9%88%D8%A7%D9%86-650-%D9%88%D8%A7%D8%AA/",
  pq750g:
    "https://torob.com/p/09359498-16de-42ae-a3e5-3baf88c2a0df/%D9%BE%D8%A7%D9%88%D8%B1-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-pq750g-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-750-%D9%88%D8%A7%D8%AA-%D8%AA%D9%85%D8%A7%D9%85-%D9%85%D8%A7%DA%98%D9%88%D9%84%D8%A7%D8%B1-80-%D9%BE%D9%84%D8%A7%D8%B3-%DA%AF%D9%84%D8%AF/",
  magA650bn:
    "https://torob.com/p/eb3534e3-fb0c-4735-9338-0025df07b32a/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%85-%D8%A7%D8%B3-%D8%A7%DB%8C-%D9%85%D8%AF%D9%84-mag-a650bn/",
  gp500aEco:
    "https://torob.com/p/f5751444-92d3-4a2c-b89d-23e2d3c564de/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-gp500a-eco-rev-31-80-plus-white-%D8%AA%D9%88%D8%A7%D9%86-500-%D9%88%D8%A7%D8%AA/",
  gp330a:
    "https://torob.com/p/f1ce8fcd-f0c4-4f63-8c3c-ef2679c57797/%D9%BE%D8%A7%D9%88%D8%B1-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-gp330a-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-330-%D9%88%D8%A7%D8%AA-%D8%A7%D8%B3%D8%AA%D9%88%DA%A9/",
  np300:
    "https://torob.com/p/3bd54de3-804a-4575-8fd2-b1d87d6c67fe/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D9%86%D9%88%D8%A7-np-300-%D8%AA%D9%88%D8%A7%D9%86-300-%D9%88%D8%A7%D8%AA/",
  gwEps1650da:
    "https://torob.com/p/5376f031-dbae-4f5a-8ba5-b2113e296017/%D9%BE%D8%A7%D9%88%D8%B1-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D8%AA-%D9%88%D8%A7%D9%84-%D9%85%D8%AF%D9%84-gw-eps1650da-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-1650-%D9%88%D8%A7%D8%AA-%D9%81%D9%88%D9%84-%D9%85%D8%A7%DA%98%D9%88%D9%84%D8%A7%D8%B1/",
  pq850g:
    "https://torob.com/p/c6919a6c-bf24-463a-b582-4fa49c4b8af2/%D9%BE%D8%A7%D9%88%D8%B1-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-pq850g-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-850-%D9%88%D8%A7%D8%AA/",
  magA850gl:
    "https://torob.com/p/000ca816-d056-4039-a811-62d7f6359efa/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%85-%D8%A7%D8%B3-%D8%A7%DB%8C-%D9%85%D8%AF%D9%84-mag-a850gl-pcie5-80-plus-gold-%D8%AA%D9%88%D8%A7%D9%86-850-%D9%88%D8%A7%D8%AA/",
  gwEps2000bl:
    "https://torob.com/p/2347a47b-785e-4a2c-b3f7-05e83231c532/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D8%AA-%D9%88%D8%A7%D9%84-gw-eps2000bl-80-plus-gold-%D8%AA%D9%88%D8%A7%D9%86-2000-%D9%88%D8%A7%D8%AA-%D8%A7%D8%B3%D8%AA%D9%88%DA%A9/",
  rogStrix1000:
    "https://torob.com/p/13b68802-6327-4b19-945b-9261e00bca02/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-%D9%85%D8%AF%D9%84-rog-strix-white-80-plus-platinum-%D8%AA%D9%88%D8%A7%D9%86-1000-%D9%88%D8%A7%D8%AA/",
  gp530ab:
    "https://torob.com/p/e7d7d01f-cf26-4f5d-9524-d15ff5afc364/%D9%BE%D8%A7%D9%88%D8%B1-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-gp530ab-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-530-%D9%88%D8%A7%D8%AA/",
  gp580b:
    "https://torob.com/p/b25c1574-3631-4af4-ba5e-c2be967bdbe6/%D9%BE%D8%A7%D9%88%D8%B1-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-gp580b-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-580-%D9%88%D8%A7%D8%AA/",
  pf700x:
    "https://torob.com/p/caf3261a-ff1c-438b-b1bb-8c343bd49746/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-pf700x-80-plus-bronze-%D8%AA%D9%88%D8%A7%D9%86-700-%D9%88%D8%A7%D8%AA/",
  pn1000d:
    "https://torob.com/p/78a8c9c4-e7a9-4337-8177-45fbb940e95b/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-pn1000d-80-plus-gold-%D8%AA%D9%88%D8%A7%D9%86-1000-%D9%88%D8%A7%D8%AA/",
  gp550aEco:
    "https://torob.com/p/8676e0ff-44f5-466f-942a-d1487b6bc127/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-gp550a-eco-rev31-80-plus-white-%D8%AA%D9%88%D8%A7%D9%86-550-%D9%88%D8%A7%D8%AA/",
  gp700aGed:
    "https://torob.com/p/ab3d13b3-401c-455d-9152-c31bd6e25515/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%DA%AF%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-gp700a-ged-80-plus-bronze-%D8%AA%D9%88%D8%A7%D9%86-700-%D9%88%D8%A7%D8%AA/",
  magA500dn:
    "https://torob.com/p/279c2297-7488-48d5-a790-a62d7fec826b/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%A7%D9%85-%D8%A7%D8%B3-%D8%A7%DB%8C-%D9%85%D8%AF%D9%84-mag-a500dn-80-plus-white-%D8%AA%D9%88%D8%A7%D9%86-500-%D9%88%D8%A7%D8%AA/",
  pl750d:
    "https://torob.com/p/82638f11-dfeb-4fc0-ab68-07fdcc293853/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-pl750d-80-plus-bronze-%D8%AA%D9%88%D8%A7%D9%86-750-%D9%88%D8%A7%D8%AA/",
  toughpowerGf1Argb:
    "https://torob.com/p/20881353-3d5d-4db0-b569-e3f9de77c12d/%D9%85%D9%86%D8%A8%D8%B9-%D8%AA%D8%BA%D8%B0%DB%8C%D9%87-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D8%AA%D8%B1%D9%85%D8%A7%D9%84%D8%AA%DB%8C%DA%A9-%D9%85%D8%AF%D9%84-toughpower-gf1-argb-80-plus-gold-%D8%AA%D9%88%D8%A7%D9%86-750-%D9%88%D8%A7%D8%AA/",
} as const;

const createPower = (
  power: Omit<POWER, "image" | "links" | "torobUrl"> & {
    torobUrl: string;
  },
): POWER => ({
  ...power,
  image: "/svg/power.svg",
  links: power.torobUrl,
});

export const powers: POWER[] = [
  createPower({
    id: 1,
    name: "DeepCool PL650D 650W",
    torobUrl: torobUrls.pl650d,
    attributes: ["80 Plus Bronze", "ATX 3.0", "Non-Modular"],
    graphics: [1, 2, 3, 4, 6, 7, 9, 10],
    brand: "DeepCool",
    psu: "650",
    modular: 1,
  }),
  createPower({
    id: 2,
    name: "DeepCool PQ750G 750W",
    torobUrl: torobUrls.pq750g,
    attributes: ["80 Plus Gold", "ATX 3.1", "Fully Modular"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    brand: "DeepCool",
    psu: "750",
    modular: 3,
  }),
  createPower({
    id: 3,
    name: "MSI MAG A650BN 650W",
    torobUrl: torobUrls.magA650bn,
    attributes: ["80 Plus Bronze", "Non-Modular", "120mm Fan"],
    graphics: [1, 2, 3, 4, 6, 7, 9, 10],
    brand: "MSI",
    psu: "650",
    modular: 1,
  }),
  createPower({
    id: 4,
    name: "Green GP500A-ECO Rev 3.1 500W",
    torobUrl: torobUrls.gp500aEco,
    attributes: ["80 Plus White", "Non-Modular"],
    graphics: [3, 9],
    brand: "Green",
    psu: "500",
    modular: 1,
  }),
  createPower({
    id: 5,
    name: "Green GP330A 330W Stock",
    torobUrl: torobUrls.gp330a,
    attributes: ["Stock", "Non-Modular"],
    graphics: [],
    brand: "Green",
    psu: "330",
    modular: 1,
  }),
  createPower({
    id: 6,
    name: "Nova NP-300 300W",
    torobUrl: torobUrls.np300,
    attributes: ["Non-Modular"],
    graphics: [],
    brand: "Nova",
    psu: "300",
    modular: 1,
  }),
  createPower({
    id: 7,
    name: "Great Wall GW-EPS1650DA 1650W",
    torobUrl: torobUrls.gwEps1650da,
    attributes: ["80 Plus Gold", "Fully Modular", "Stock"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    brand: "Great Wall",
    psu: "1650",
    modular: 3,
  }),
  createPower({
    id: 8,
    name: "DeepCool PQ850G 850W",
    torobUrl: torobUrls.pq850g,
    attributes: ["80 Plus Gold", "ATX 3.1", "Fully Modular"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    brand: "DeepCool",
    psu: "850",
    modular: 3,
  }),
  createPower({
    id: 9,
    name: "MSI MAG A850GL PCIE5 850W",
    torobUrl: torobUrls.magA850gl,
    attributes: ["80 Plus Gold", "PCIe 5", "Fully Modular"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    brand: "MSI",
    psu: "850",
    modular: 3,
  }),
  createPower({
    id: 10,
    name: "Great Wall GW-EPS2000BL 2000W Stock",
    torobUrl: torobUrls.gwEps2000bl,
    attributes: ["80 Plus Gold", "Stock", "Non-Modular"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    brand: "Great Wall",
    psu: "2000",
    modular: 1,
  }),
  createPower({
    id: 11,
    name: "ASUS ROG Strix 1000W Platinum White",
    torobUrl: torobUrls.rogStrix1000,
    attributes: ["80 Plus Platinum", "ATX 3.1", "Fully Modular"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    brand: "ASUS",
    psu: "1000",
    modular: 3,
  }),
  createPower({
    id: 12,
    name: "Green GP530AB 530W",
    torobUrl: torobUrls.gp530ab,
    attributes: ["Non-Modular"],
    graphics: [3, 9],
    brand: "Green",
    psu: "530",
    modular: 1,
  }),
  createPower({
    id: 13,
    name: "Green GP580B 580W",
    torobUrl: torobUrls.gp580b,
    attributes: ["Non-Modular"],
    graphics: [1, 2, 3, 6, 7, 9],
    brand: "Green",
    psu: "580",
    modular: 1,
  }),
  createPower({
    id: 14,
    name: "DeepCool PF700X 700W",
    torobUrl: torobUrls.pf700x,
    attributes: ["80 Plus Bronze", "Non-Modular"],
    graphics: [1, 2, 3, 4, 6, 7, 9, 10],
    brand: "DeepCool",
    psu: "700",
    modular: 1,
  }),
  createPower({
    id: 15,
    name: "DeepCool PN1000D 1000W",
    torobUrl: torobUrls.pn1000d,
    attributes: ["80 Plus Gold", "ATX 3.1", "Non-Modular"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    brand: "DeepCool",
    psu: "1000",
    modular: 1,
  }),
  createPower({
    id: 16,
    name: "Green GP550A-ECO Rev 3.1 550W",
    torobUrl: torobUrls.gp550aEco,
    attributes: ["80 Plus White", "Non-Modular"],
    graphics: [1, 2, 3, 6, 7, 9],
    brand: "Green",
    psu: "550",
    modular: 1,
  }),
  createPower({
    id: 17,
    name: "Green GP700A-GED 700W",
    torobUrl: torobUrls.gp700aGed,
    attributes: ["80 Plus Bronze", "Non-Modular"],
    graphics: [1, 2, 3, 4, 6, 7, 9, 10],
    brand: "Green",
    psu: "700",
    modular: 1,
  }),
  createPower({
    id: 18,
    name: "MSI MAG A500DN 500W",
    torobUrl: torobUrls.magA500dn,
    attributes: ["80 Plus White", "Non-Modular"],
    graphics: [3, 9],
    brand: "MSI",
    psu: "500",
    modular: 1,
  }),
  createPower({
    id: 19,
    name: "DeepCool PL750D 750W",
    torobUrl: torobUrls.pl750d,
    attributes: ["80 Plus Bronze", "ATX 3.0", "Non-Modular"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    brand: "DeepCool",
    psu: "750",
    modular: 1,
  }),
  createPower({
    id: 20,
    name: "Thermaltake Toughpower GF1 ARGB 750W",
    torobUrl: torobUrls.toughpowerGf1Argb,
    attributes: ["80 Plus Gold", "ARGB", "Fully Modular"],
    graphics: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    brand: "Thermaltake",
    psu: "750",
    modular: 3,
  }),
];

import type { FAN } from "@/_redux/services/fanApi";

const torobUrls = {
  ag200:
    "https://torob.com/p/b2d5159a-cfa2-44ee-a3b1-9ff7b3490562/%D9%81%D9%86-%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-ag200/",
  ag400:
    "https://torob.com/p/a5bb368e-083b-44e5-a87b-05d32ea7c093/%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-ag400/",
  ag400BkArgb:
    "https://torob.com/p/9a5c4cab-1631-47bd-b39b-6f908b0c6f0a/%D9%81%D9%86-%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-ag400-bk-argb/",
  a700Rgb:
    "https://torob.com/p/bdaae200-41e3-493c-a258-60a4b8c0d9ac/%D9%81%D9%86-%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-uctech-%D9%85%D8%AF%D9%84-a700-rgb/",
  assassinIv:
    "https://torob.com/p/dafb861c-1ced-4f1a-980a-768c94273592/%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-assassin-iv/",
  ag400Led:
    "https://torob.com/p/7612b383-6a08-4be3-bf89-667b95ae30ef/%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-%DA%AF%D8%A7%D9%85%D8%A7%DA%A9%D8%B3-ag400-led/",
  notus95Argb:
    "https://torob.com/p/2d9c067d-64fd-468c-ae08-7180a4abe726/%D9%81%D9%86-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%DA%AF%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-notus-95-argb/",
  gafan230:
    "https://torob.com/p/6471796e-5969-457d-afba-eacee7c6ff0d/gafan230-gaming-cpufan%D9%81%D9%86-%DA%AF%DB%8C%D9%85%DB%8C%D9%86%DA%AF/",
  gtAv1226:
    "https://torob.com/p/16b47efb-3400-4265-8e9c-2a873b8ae25a/%D9%81%D9%86-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%A7%D9%88%D8%B3%D8%AA-%D9%85%D8%AF%D9%84-gt-av1226-argb/",
  ag400Argb:
    "https://torob.com/p/a0c4f905-8ac6-4434-a9d2-ca121332aac9/%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%AF%DB%8C%D9%BE-%DA%A9%D9%88%D9%84-%D9%85%D8%AF%D9%84-ag400-argb/",
  tinyCool90:
    "https://torob.com/p/3b3001fd-d543-4ee3-9e06-1f653af6e6b1/%D9%81%D9%86-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%DA%AF%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-tiny-cool-90-rev11/",
  nova200:
    "https://torob.com/p/96497d9f-d051-4ea7-9ce6-807b64075b04/%D9%81%D9%86-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D9%85%D8%B3%D8%AA%D8%B1-%D8%AA%DA%A9-%D9%85%D8%AF%D9%84-nova200/",
  gtAv903:
    "https://torob.com/p/7018300c-f54a-4569-934f-6d076184e463/%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%A7%D9%88%D8%B3%D8%AA-%D9%85%D8%AF%D9%84-gt-av903-argb/",
  intel775:
    "https://torob.com/p/7f5a9194-170c-4b99-85c3-55f4eefd49bf/%D9%81%D9%86-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%A7%DB%8C%D9%86%D8%AA%D9%84-%D9%85%D8%AF%D9%84-775-%D8%A7%D8%B3%D8%AA%D9%88%DA%A9/",
  cc2312:
    "https://torob.com/p/023b411e-859a-4f0c-8557-8c93243d38d9/%D9%81%D9%86-%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%B1%D8%AF%D8%B1%D8%A7%DA%AF%D9%88%D9%86-%D9%85%D8%AF%D9%84-cc-2312-rgb/",
  intel1151:
    "https://torob.com/p/a406d330-b0b6-4d7e-8190-806a53c4c30f/%D9%81%D9%86-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%A7%DB%8C%D9%86%D8%AA%D9%84-%D9%85%D8%AF%D9%84-1151-%D8%A7%D8%B3%D8%AA%D9%88%DA%A9/",
  gtAv1201:
    "https://torob.com/p/1088f67f-dc82-4560-adb5-ed11a21eb65e/%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%A7%D9%88%D8%B3%D8%AA-%D9%85%D8%AF%D9%84-gt-av1201-argb/",
  gtAv1236:
    "https://torob.com/p/940143e5-2d3f-432a-a68c-9faabb327a37/%D9%81%D9%86-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%A7%D9%88%D8%B3%D8%AA-%D9%85%D8%AF%D9%84-gt-av1236-argb/",
  intel1700:
    "https://torob.com/p/97068ba1-9a53-4e65-8b6d-e68ce1c94f3a/%D9%81%D9%86-%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%D8%A7%DB%8C%D9%86%D8%AA%D9%84-%D9%85%D8%AF%D9%84-lga1700/",
  notus95Pwm:
    "https://torob.com/p/704faf1f-db63-4209-8e72-53dfb8add544/%D8%AE%D9%86%DA%A9-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-%DA%AF%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-notus-95-pwm/",
} as const;

const createFan = (
  fan: Omit<FAN, "image" | "links" | "powerDrawW" | "torobUrl"> & {
    torobUrl: string;
  },
): FAN => ({
  ...fan,
  powerDrawW: fan.rgb ? 5 : 3,
  image: "/svg/fan.svg",
  links: fan.torobUrl,
});

const modernIntelCpus = [1, 2, 3, 4, 6, 9, 10, 11, 12];
const allCpus = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];

export const fans: FAN[] = [
  createFan({
    id: 1,
    name: "DeepCool AG200",
    torobUrl: torobUrls.ag200,
    fan_noise: "30.5 dBA",
    heat_sink_material: "Aluminum with two copper heat pipes",
    cpu_sockets: "LGA1700, LGA1200, LGA115x, AM5, AM4",
    rgb: false,
    coolingCapacityW: 130,
    cpus: modernIntelCpus,
    brand: "DeepCool",
  }),
  createFan({
    id: 2,
    name: "DeepCool AG400",
    torobUrl: torobUrls.ag400,
    fan_noise: "31.6 dBA",
    heat_sink_material: "Aluminum with four copper heat pipes",
    cpu_sockets: "LGA1851, LGA1700, LGA1200, LGA115x, AM5, AM4",
    rgb: false,
    coolingCapacityW: 210,
    cpus: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12],
    brand: "DeepCool",
  }),
  createFan({
    id: 3,
    name: "DeepCool AG400 BK ARGB",
    torobUrl: torobUrls.ag400BkArgb,
    fan_noise: "31.6 dBA",
    heat_sink_material: "Aluminum with four copper heat pipes",
    cpu_sockets: "LGA1700, LGA1200, LGA115x, AM5, AM4",
    rgb: true,
    coolingCapacityW: 180,
    cpus: modernIntelCpus,
    brand: "DeepCool",
  }),
  createFan({
    id: 4,
    name: "UCTECH A700 RGB",
    torobUrl: torobUrls.a700Rgb,
    fan_noise: "<25 dBA",
    heat_sink_material: "Copper heat pipes",
    cpu_sockets:
      "LGA1700, LGA1200, LGA115x, LGA2011, LGA2066, AM5, AM4, AM3, AM2, FM2, FM1",
    rgb: true,
    coolingCapacityW: 170,
    cpus: modernIntelCpus,
    brand: "UCTECH",
  }),
  createFan({
    id: 5,
    name: "DeepCool Assassin IV",
    torobUrl: torobUrls.assassinIv,
    fan_noise: "29.3 dBA",
    heat_sink_material: "Aluminum with seven copper heat pipes",
    cpu_sockets:
      "LGA1851, LGA1700, LGA1200, LGA115x, LGA2066, LGA2011, AM5, AM4",
    rgb: false,
    cpus: [8],
    coolingCapacityW: 280,
    brand: "DeepCool",
  }),
  createFan({
    id: 6,
    name: "DeepCool AG400 LED",
    torobUrl: torobUrls.ag400Led,
    fan_noise: "36.6 dBA",
    cpu_sockets: "LGA1851, LGA1700, LGA1200, LGA115x, AM5, AM4",
    rgb: true,
    coolingCapacityW: 210,
    cpus: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12],
    brand: "DeepCool",
  }),
  createFan({
    id: 7,
    name: "Green NOTUS 95-ARGB",
    torobUrl: torobUrls.notus95Argb,
    fan_noise: "26 dBA",
    heat_sink_material: "Aluminum",
    cpu_sockets: "LGA1700, LGA1200, LGA115x, LGA775, AM5, AM4, AM3, AM2, FM2",
    rgb: true,
    coolingCapacityW: 160,
    cpus: modernIntelCpus,
    brand: "Green",
  }),
  createFan({
    id: 8,
    name: "TSCO GAFan 230 VAYU",
    torobUrl: torobUrls.gafan230,
    fan_noise: "20-32 dBA",
    heat_sink_material: "Aluminum",
    cpu_sockets:
      "LGA1851, LGA1700, LGA1200, LGA115x, LGA775, LGA1366, LGA2011, AM5, AM4, AM3, AM2",
    rgb: true,
    coolingCapacityW: 150,
    cpus: allCpus,
    brand: "TSCO",
  }),
  createFan({
    id: 9,
    name: "AWEST GT-AV1226 ARGB",
    torobUrl: torobUrls.gtAv1226,
    fan_noise: "31 dBA",
    heat_sink_material: "Aluminum with copper heat pipes",
    cpu_sockets:
      "LGA1700, LGA1200, LGA115x, LGA1366, LGA2011, LGA2066, AM4, AM3, AM2, FM2, FM1",
    rgb: true,
    coolingCapacityW: 180,
    cpus: modernIntelCpus,
    brand: "AWEST",
  }),
  createFan({
    id: 10,
    name: "DeepCool AG400 ARGB",
    torobUrl: torobUrls.ag400Argb,
    fan_noise: "31.6 dBA",
    heat_sink_material: "Aluminum",
    cpu_sockets: "LGA1851, LGA1700, LGA1200, LGA115x, AM5, AM4",
    rgb: true,
    coolingCapacityW: 210,
    cpus: allCpus,
    brand: "DeepCool",
  }),
  createFan({
    id: 11,
    name: "Green TinyCool 90 Rev. 1.1",
    torobUrl: torobUrls.tinyCool90,
    fan_noise: "22 dBA",
    cpu_sockets: "LGA115x, LGA775, AM3, AM2, FM2, FM1",
    rgb: false,
    coolingCapacityW: 70,
    cpus: [4, 6, 12],
    brand: "Green",
  }),
  createFan({
    id: 12,
    name: "Master Tech NOVA 200 ARGB",
    torobUrl: torobUrls.nova200,
    heat_sink_material: "Aluminum with copper heat pipes",
    cpu_sockets: "LGA1851, LGA1700, LGA1200, LGA115x",
    rgb: true,
    coolingCapacityW: 150,
    cpus: allCpus,
    brand: "Master Tech",
  }),
  createFan({
    id: 13,
    name: "AWEST GT-AV903 ARGB",
    torobUrl: torobUrls.gtAv903,
    fan_noise: "22.7 dBA",
    cpu_sockets:
      "LGA1851, LGA1700, LGA1200, LGA115x, LGA775, AM4, AM3, AM2, FM2, FM1",
    rgb: true,
    coolingCapacityW: 180,
    cpus: allCpus,
    brand: "AWEST",
  }),
  createFan({
    id: 14,
    name: "Intel LGA775 Stock Cooler",
    torobUrl: torobUrls.intel775,
    cpu_sockets: "LGA775",
    rgb: false,
    coolingCapacityW: 65,
    cpus: [],
    brand: "Intel",
  }),
  createFan({
    id: 15,
    name: "Redragon CC-2312 RGB",
    torobUrl: torobUrls.cc2312,
    fan_noise: "32.5 dBA",
    heat_sink_material: "Aluminum",
    cpu_sockets: "LGA1700, LGA1200, LGA115x, LGA1366, AM5, AM4",
    rgb: true,
    coolingCapacityW: 130,
    cpus: modernIntelCpus,
    brand: "Redragon",
  }),
  createFan({
    id: 16,
    name: "Intel LGA1151 Stock Cooler",
    torobUrl: torobUrls.intel1151,
    cpu_sockets: "LGA115x",
    rgb: false,
    coolingCapacityW: 65,
    cpus: [4, 6, 12],
    brand: "Intel",
  }),
  createFan({
    id: 17,
    name: "AWEST GT-AV1201 ARGB",
    torobUrl: torobUrls.gtAv1201,
    fan_noise: "31 dBA",
    heat_sink_material: "Aluminum with four copper heat pipes",
    cpu_sockets:
      "LGA1700, LGA1200, LGA115x, LGA1366, LGA2011, LGA2066, AM4, AM3, AM2, FM2, FM1",
    rgb: true,
    coolingCapacityW: 180,
    cpus: modernIntelCpus,
    brand: "AWEST",
  }),
  createFan({
    id: 18,
    name: "AWEST GT-AV1236 ARGB",
    torobUrl: torobUrls.gtAv1236,
    fan_noise: "31 dBA",
    heat_sink_material: "Aluminum with six copper heat pipes",
    cpu_sockets:
      "LGA1700, LGA1200, LGA115x, LGA1366, LGA2011, LGA2066, AM4, AM3",
    rgb: true,
    coolingCapacityW: 200,
    cpus: modernIntelCpus,
    brand: "AWEST",
  }),
  createFan({
    id: 19,
    name: "Intel LGA1700 Stock Cooler",
    torobUrl: torobUrls.intel1700,
    cpu_sockets: "LGA1700",
    rgb: false,
    coolingCapacityW: 152,
    cpus: [1, 2, 3, 9, 10],
    brand: "Intel",
  }),
  createFan({
    id: 20,
    name: "Green NOTUS 95-PWM",
    torobUrl: torobUrls.notus95Pwm,
    fan_noise: "20-32 dBA",
    heat_sink_material: "Aluminum with two copper heat pipes",
    cpu_sockets: "LGA1200, LGA115x, LGA775, AM4, AM3, AM2, FM2, FM1",
    rgb: false,
    coolingCapacityW: 95,
    cpus: [4, 6, 11, 12],
    brand: "Green",
  }),
];

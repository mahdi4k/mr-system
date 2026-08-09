import type { BuildSelection } from "@/_utils/pcAssistant";

export interface SuggestedBuild {
  title: string;
  image: string;
  selection: BuildSelection;
  ramQuantity: number;
}

export const suggestedBuilds: SuggestedBuild[] = [
  {
    title: "کامپیوتر گیمینگ میان رده",
    image: "/pc-suggest-mid.png",
    selection: {
      cpu: 3,
      motherboard: 8,
      ram: 1,
      graphic: 2,
      power: 1,
      ssd: 2,
      case: 21,
      fan: 2,
    },
    ramQuantity: 2,
  },
  {
    title: "کامپیوتر گیمینگ بالا رده",
    image: "/high-end.png",
    selection: {
      cpu: 8,
      motherboard: 9,
      ram: 3,
      graphic: 8,
      power: 11,
      ssd: 10,
      case: 3,
      fan: 5,
    },
    ramQuantity: 1,
  },
  {
    title: "کامپیوتر گیمینگ اقتصادی",
    image: "/low-end.png",
    selection: {
      cpu: 1,
      motherboard: 1,
      ram: 1,
      graphic: 3,
      power: 4,
      ssd: 19,
      case: 19,
      fan: 1,
    },
    ramQuantity: 1,
  },
  {
    title: "کامپیوتر گیمینگ فوق اقتصادی",
    image: "/extra-low-end.png",
    selection: {
      cpu: 12,
      motherboard: 5,
      ram: 4,
      graphic: 3,
      power: 4,
      ssd: 18,
      case: 19,
      fan: 20,
    },
    ramQuantity: 1,
  },
];

export const getSuggestedBuildHref = (build: SuggestedBuild): string => {
  const params = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(build.selection).map(([partType, id]) => [
        partType,
        String(id),
      ]),
    ),
    ramQuantity: String(build.ramQuantity),
  });

  return `/choose-part?${params.toString()}`;
};

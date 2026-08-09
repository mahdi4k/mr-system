import {
  cases,
  cpus,
  fans,
  graphics,
  motherboards,
  powers,
  rams,
  ssds,
} from "./productCatalog";
import { suggestedBuilds } from "./suggestedBuilds";
import {
  BUILD_PART_TYPES,
  BuildCatalog,
  CompleteBuild,
  isBuildCompatible,
} from "@/_utils/pcAssistant";

const catalog: BuildCatalog = {
  cpu: cpus,
  motherboard: motherboards,
  ram: rams,
  graphic: graphics,
  power: powers,
  ssd: ssds,
  case: cases,
  fan: fans,
};

describe("suggestedBuilds", () => {
  it.each(suggestedBuilds)("keeps $title compatible", (preset) => {
    const build = Object.fromEntries(
      BUILD_PART_TYPES.map((partType) => {
        const product = catalog[partType].find(
          (item) => item.id === preset.selection[partType],
        );

        if (!product) throw new Error(`Missing ${partType} in ${preset.title}`);

        return [
          partType,
          partType === "ram"
            ? { ...product, quantity: preset.ramQuantity }
            : product,
        ];
      }),
    ) as CompleteBuild;

    expect(isBuildCompatible(build)).toBe(true);
  });
});

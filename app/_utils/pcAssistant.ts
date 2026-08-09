export const BUILD_PART_TYPES = [
  "cpu",
  "motherboard",
  "ram",
  "graphic",
  "power",
  "ssd",
  "case",
  "fan",
] as const;

export type BuildPartType = (typeof BUILD_PART_TYPES)[number];

export const RAM_QUANTITIES = [1, 2, 4] as const;

export function parseRamQuantity(param: string | null): number {
  const quantity = Number(param);
  return RAM_QUANTITIES.includes(quantity as (typeof RAM_QUANTITIES)[number])
    ? quantity
    : 1;
}

export interface BuildProduct {
  id: number;
  name: string;
  price?: string;
  cpu_socket?: string;
  motherboards?: number[];
  cpus?: number[];
  rams?: number[];
  graphics?: number[];
  powers?: number[];
  fans?: number[];
  psu?: string;
  cpu_sockets?: string;
  size?: string;
  form?: string;
  motherboardSizes?: string[];
  storageForms?: string[];
  capacityGb?: number;
  minimumRamGb?: number;
  maxTurboPowerW?: number;
  boardPowerW?: number;
  coolingCapacityW?: number;
  minimumCaseForm?: string;
  powerDrawW?: number;
  quantity?: number;
  total_slot_ram?: number;
}

export type BuildCatalog = Record<BuildPartType, BuildProduct[]>;
export type CompleteBuild = Record<BuildPartType, BuildProduct>;
export type BuildSelection = Record<BuildPartType, number>;

export interface BuildIntent {
  objective: "minimum_price";
  maxBudget?: number;
}

export interface BuildRecommendation {
  products: CompleteBuild;
  selection: BuildSelection;
  totalPrice: number;
}

export interface PsuCalculation {
  cpuPowerW: number;
  graphicPowerW: number;
  coolingPowerW: number;
  platformPowerW: number;
  estimatedLoadW: number;
  safetyHeadroomW: number;
  manufacturerMinimumW: number;
  recommendedPsuW: number;
}

const normalizeDigits = (value: string): string =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

const parseBudget = (message: string): number | undefined => {
  const normalized = normalizeDigits(message.toLowerCase()).replace(/,/g, "");
  const millionMatch = normalized.match(
    /(?:under|below|تا|زیر|بودجه)?\s*(\d+(?:\.\d+)?)\s*(?:million|میلیون|m\b)/,
  );

  if (millionMatch) return Math.round(Number(millionMatch[1]) * 1_000_000);

  const tomanMatch = normalized.match(
    /(?:under|below|تا|زیر|بودجه)\s*(\d{6,})|(?:\d{6,})\s*(?:تومان|toman)/,
  );
  const rawBudget = tomanMatch?.[1] ?? tomanMatch?.[0].match(/\d{6,}/)?.[0];

  return rawBudget ? Number(rawBudget) : undefined;
};

export const parseBuildIntent = (message: string): BuildIntent | undefined => {
  const normalized = normalizeDigits(message).toLowerCase();
  const asksForLowPrice = [
    "minimum",
    "cheapest",
    "cheap",
    "lowest",
    "min price",
    "ارزان",
    "کمترین",
    "حداقل قیمت",
    "اقتصادی",
  ].some((keyword) => normalized.includes(keyword));
  const asksForBuild = [
    "system",
    "build",
    "pc",
    "computer",
    "سیستم",
    "کامپیوتر",
  ].some((keyword) => normalized.includes(keyword));

  if (!asksForLowPrice || !asksForBuild) return undefined;

  return {
    objective: "minimum_price",
    maxBudget: parseBudget(normalized),
  };
};

const hasPrice = (
  product: BuildProduct,
): product is BuildProduct & { price: string } => {
  const price = Number(product.price);
  return Number.isFinite(price) && price > 0;
};

const includesProduct = (
  productIds: number[] | undefined,
  product: BuildProduct,
): boolean => productIds?.includes(product.id) ?? false;

const coolerSupportsCpuSocket = (
  coolerSockets: string | undefined,
  cpuSocket: string | undefined,
): boolean => {
  if (!coolerSockets || !cpuSocket) return false;

  return coolerSockets.split(",").some((value) => {
    const coolerSocket = value.trim();
    if (coolerSocket === cpuSocket) return true;
    return coolerSocket === "LGA115x" && /^LGA115[0-6]$/.test(cpuSocket);
  });
};

const PLATFORM_POWER_W = 95;
const DEFAULT_COOLING_POWER_W = 5;
const PSU_HEADROOM = 0.25;

export const calculatePsuRequirement = ({
  cpu,
  graphic,
  fan,
}: Pick<Partial<CompleteBuild>, "cpu" | "graphic" | "fan">):
  | PsuCalculation
  | undefined => {
  if (!cpu && !graphic) return undefined;
  if (cpu && cpu.maxTurboPowerW == null) return undefined;
  if (graphic && graphic.boardPowerW == null) return undefined;

  const cpuPowerW = cpu?.maxTurboPowerW ?? 0;
  const graphicPowerW = graphic?.boardPowerW ?? 0;
  const coolingPowerW = fan?.powerDrawW ?? DEFAULT_COOLING_POWER_W;
  const estimatedLoadW =
    cpuPowerW + graphicPowerW + coolingPowerW + PLATFORM_POWER_W;
  const safetyHeadroomW = Math.ceil(estimatedLoadW * PSU_HEADROOM);
  const manufacturerMinimum = Number(graphic?.psu);
  const manufacturerMinimumW = Number.isFinite(manufacturerMinimum)
    ? manufacturerMinimum
    : 0;
  const requiredW = Math.max(
    estimatedLoadW + safetyHeadroomW,
    manufacturerMinimumW,
  );

  return {
    cpuPowerW,
    graphicPowerW,
    coolingPowerW,
    platformPowerW: PLATFORM_POWER_W,
    estimatedLoadW,
    safetyHeadroomW,
    manufacturerMinimumW,
    recommendedPsuW: Math.ceil(requiredW / 50) * 50,
  };
};

const caseFormRank: Record<string, number> = {
  "Micro Tower": 1,
  "Mid Tower": 2,
  "Full Tower": 3,
};

const graphicFitsCase = (
  graphic: BuildProduct,
  caseItem: BuildProduct,
): boolean => {
  const requiredRank = caseFormRank[graphic.minimumCaseForm ?? ""];
  const availableRank = caseFormRank[caseItem.form ?? ""];
  return (
    requiredRank != null &&
    availableRank != null &&
    availableRank >= requiredRank
  );
};

export const isPartialBuildCompatible = (
  build: Partial<CompleteBuild>,
): boolean => {
  const {
    cpu,
    motherboard,
    ram,
    graphic,
    power,
    ssd,
    case: caseItem,
    fan,
  } = build;

  if (
    cpu &&
    motherboard &&
    (cpu.cpu_socket !== motherboard.cpu_socket ||
      !includesProduct(cpu.motherboards, motherboard) ||
      !includesProduct(motherboard.cpus, cpu))
  ) {
    return false;
  }

  if (
    cpu &&
    ram &&
    (!includesProduct(cpu.rams, ram) ||
      !includesProduct(ram.cpus, cpu) ||
      cpu.minimumRamGb == null ||
      ram.capacityGb == null ||
      ram.capacityGb * (ram.quantity ?? 1) < cpu.minimumRamGb)
  ) {
    return false;
  }

  if (
    motherboard &&
    ram &&
    (!includesProduct(motherboard.rams, ram) ||
      !includesProduct(ram.motherboards, motherboard) ||
      motherboard.total_slot_ram == null ||
      (ram.quantity ?? 1) > motherboard.total_slot_ram)
  ) {
    return false;
  }

  if (
    cpu &&
    graphic &&
    (!includesProduct(cpu.graphics, graphic) ||
      !includesProduct(graphic.cpus, cpu))
  ) {
    return false;
  }

  const psuCalculation = calculatePsuRequirement({ cpu, graphic, fan });
  if (
    graphic &&
    power &&
    (!psuCalculation ||
      !includesProduct(graphic.powers, power) ||
      !includesProduct(power.graphics, graphic) ||
      !Number.isFinite(Number(power.psu)) ||
      Number(power.psu) < psuCalculation.recommendedPsuW)
  ) {
    return false;
  }

  if (
    cpu &&
    fan &&
    (!includesProduct(cpu.fans, fan) ||
      !includesProduct(fan.cpus, cpu) ||
      !coolerSupportsCpuSocket(fan.cpu_sockets, cpu.cpu_socket) ||
      cpu.maxTurboPowerW == null ||
      fan.coolingCapacityW == null ||
      fan.coolingCapacityW < cpu.maxTurboPowerW)
  ) {
    return false;
  }

  if (
    motherboard &&
    ssd &&
    (!ssd.form || motherboard.storageForms?.includes(ssd.form) !== true)
  ) {
    return false;
  }

  if (
    motherboard &&
    caseItem &&
    (!motherboard.size ||
      caseItem.motherboardSizes?.includes(motherboard.size) !== true)
  ) {
    return false;
  }

  if (graphic && caseItem && !graphicFitsCase(graphic, caseItem)) return false;

  return true;
};

export const isBuildCompatible = (build: CompleteBuild): boolean =>
  isPartialBuildCompatible(build);

export const findMinimumPriceBuild = (
  catalog: BuildCatalog,
  maxBudget?: number,
): BuildRecommendation | undefined => {
  const pricedCatalog = Object.fromEntries(
    BUILD_PART_TYPES.map((partType) => [
      partType,
      catalog[partType]
        .filter(hasPrice)
        .sort((first, second) => Number(first.price) - Number(second.price)),
    ]),
  ) as Record<BuildPartType, (BuildProduct & { price: string })[]>;

  let bestBuild: CompleteBuild | undefined;
  let bestPrice = Number.POSITIVE_INFINITY;

  for (const cpu of pricedCatalog.cpu) {
    const fan = pricedCatalog.fan.find(
      (candidate) =>
        includesProduct(cpu.fans, candidate) &&
        includesProduct(candidate.cpus, cpu) &&
        coolerSupportsCpuSocket(candidate.cpu_sockets, cpu.cpu_socket) &&
        candidate.coolingCapacityW != null &&
        cpu.maxTurboPowerW != null &&
        candidate.coolingCapacityW >= cpu.maxTurboPowerW,
    );
    if (!fan) continue;

    let graphic: BuildProduct | undefined;
    let power: BuildProduct | undefined;
    let graphicAndPowerPrice = Number.POSITIVE_INFINITY;

    for (const graphicCandidate of pricedCatalog.graphic) {
      if (
        !includesProduct(cpu.graphics, graphicCandidate) ||
        !includesProduct(graphicCandidate.cpus, cpu)
      ) {
        continue;
      }

      const powerCandidate = pricedCatalog.power.find((candidate) => {
        const calculation = calculatePsuRequirement({
          cpu,
          graphic: graphicCandidate,
          fan,
        });
        return (
          calculation != null &&
          includesProduct(graphicCandidate.powers, candidate) &&
          includesProduct(candidate.graphics, graphicCandidate) &&
          Number(candidate.psu) >= calculation.recommendedPsuW
        );
      });
      if (!powerCandidate) continue;

      const pairPrice =
        Number(graphicCandidate.price) + Number(powerCandidate.price);
      if (pairPrice < graphicAndPowerPrice) {
        graphic = graphicCandidate;
        power = powerCandidate;
        graphicAndPowerPrice = pairPrice;
      }
    }

    if (!graphic || !power) continue;
    const selectedGraphic = graphic;

    for (const motherboard of pricedCatalog.motherboard) {
      if (
        cpu.cpu_socket !== motherboard.cpu_socket ||
        !includesProduct(cpu.motherboards, motherboard) ||
        !includesProduct(motherboard.cpus, cpu)
      ) {
        continue;
      }

      const ram = pricedCatalog.ram.find(
        (candidate) =>
          includesProduct(cpu.rams, candidate) &&
          includesProduct(motherboard.rams, candidate) &&
          includesProduct(candidate.cpus, cpu) &&
          includesProduct(candidate.motherboards, motherboard) &&
          candidate.capacityGb != null &&
          cpu.minimumRamGb != null &&
          candidate.capacityGb >= cpu.minimumRamGb,
      );
      if (!ram) continue;

      const ssd = pricedCatalog.ssd.find(
        (candidate) =>
          Boolean(candidate.form) &&
          motherboard.storageForms?.includes(candidate.form!) === true,
      );
      const caseItem = pricedCatalog.case.find(
        (candidate) =>
          Boolean(motherboard.size) &&
          candidate.motherboardSizes?.includes(motherboard.size!) === true &&
          graphicFitsCase(selectedGraphic, candidate),
      );
      if (!ssd || !caseItem) continue;

      const candidate: CompleteBuild = {
        cpu,
        motherboard,
        ram,
        graphic: selectedGraphic,
        power,
        ssd,
        case: caseItem,
        fan,
      };
      if (!isBuildCompatible(candidate)) continue;

      const totalPrice = BUILD_PART_TYPES.reduce(
        (total, partType) => total + Number(candidate[partType].price),
        0,
      );

      if (totalPrice > (maxBudget ?? Number.POSITIVE_INFINITY)) continue;
      if (totalPrice >= bestPrice) continue;

      bestBuild = candidate;
      bestPrice = totalPrice;
    }
  }

  if (!bestBuild) return undefined;
  const selectedBuild = bestBuild;

  return {
    products: selectedBuild,
    selection: Object.fromEntries(
      BUILD_PART_TYPES.map((partType) => [
        partType,
        selectedBuild[partType].id,
      ]),
    ) as BuildSelection,
    totalPrice: bestPrice,
  };
};

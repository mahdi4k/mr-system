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
  condition?: string;
  ram?: number;
  manufacturer?: string;
  brand?: string;
}

export type BuildCatalog = Record<BuildPartType, BuildProduct[]>;
export type CompleteBuild = Record<BuildPartType, BuildProduct>;
export type BuildSelection = Record<BuildPartType, number>;

export type BuildObjective = "minimum_price" | "best_value" | "maximum_price";
export type BrandPreference = "intel" | "amd" | "nvidia";

export interface BuildIntent {
  objective: BuildObjective;
  maxBudget?: number;
  cpuBrand?: BrandPreference;
  graphicBrand?: BrandPreference;
  minRamGb?: number;
  preferNew?: boolean;
  needsStrongGraphic?: boolean;
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
    /(?:under|below|تا|زیر|بودجه|تا\s*قیمت)\s*(\d+(?:\.\d+)?)\s*(?:million|میلیون|m\b)|(\d+(?:\.\d+)?)\s*(?:million|میلیون|m\b)/,
  );
  const millionValue = millionMatch?.[1] ?? millionMatch?.[2];
  if (millionValue) return Math.round(Number(millionValue) * 1_000_000);

  const tomanMatch = normalized.match(
    /(?:under|below|تا|زیر|بودجه)\s*(\d{6,})|(?:\d{6,})\s*(?:تومان|toman)/,
  );
  const rawBudget = tomanMatch?.[1] ?? tomanMatch?.[0].match(/\d{6,}/)?.[0];

  return rawBudget ? Number(rawBudget) : undefined;
};

export const parseBudgetFromMessage = parseBudget;

const parseRamRequirement = (message: string): number | undefined => {
  const patterns = [
    /رم[^.]*?(\d+)\s*(?:گیگابایت|گیگ|gb|g\b)/,
    /(\d+)\s*(?:گیگابایت|گیگ|gb)\s*رم/,
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return Number(match[1]);
  }
  return undefined;
};

const CPU_BRAND_KEYWORDS: [BrandPreference, RegExp][] = [
  ["intel", /اینتی?ل|intel/],
  ["amd", /ای‌?ام‌?دی|amd|ریزن|ryzen/],
];

const GRAPHIC_BRAND_KEYWORDS: [BrandPreference, RegExp][] = [
  ["nvidia", /انویدیا|nvidia|جی‌?فورس|geforce|\brtx\b|\bgtx\b/],
  ["amd", /ای‌?ام‌?دی|amd|رادئون|رادیون|radeon|\brx ?\d/],
];

const detectBrand = (
  message: string,
  keywords: [BrandPreference, RegExp][],
): BrandPreference | undefined =>
  keywords.find(([, pattern]) => pattern.test(message))?.[0];

const STRONG_GRAPHIC_KEYWORDS = [
  "گیمینگ",
  "بازی",
  "gaming",
  "رندر",
  "طراحی",
  "ادیت",
  "قوی",
  "بهترین",
];

export const parseBuildIntent = (message: string): BuildIntent | undefined => {
  const normalized = normalizeDigits(message).toLowerCase();
  const asksForBuild = [
    "system",
    "build",
    "pc",
    "computer",
    "سیستم",
    "کامپیوتر",
    "ست",
  ].some((keyword) => normalized.includes(keyword));

  if (!asksForBuild) return undefined;

  const maxBudget = parseBudget(normalized);
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
    "کم‌هزینه",
  ].some((keyword) => normalized.includes(keyword));
  const asksForHighPrice = [
    "most expensive",
    "گران‌ترین",
    "گران ترین",
    "گرانترین",
    "گرون‌ترین",
    "گرون ترین",
    "گرونترین",
    "لاکچری",
    "لاکژری",
    "luxury",
  ].some((keyword) => normalized.includes(keyword));
  const needsStrongGraphic = STRONG_GRAPHIC_KEYWORDS.some((keyword) =>
    normalized.includes(keyword),
  );

  let objective: BuildObjective;
  if (asksForLowPrice) {
    objective = "minimum_price";
  } else if (asksForHighPrice) {
    objective = "maximum_price";
  } else if (needsStrongGraphic || maxBudget != null) {
    objective = "best_value";
  } else {
    objective = "minimum_price";
  }

  const ramMatch = parseRamRequirement(normalized);
  const preferNew =
    /(^|[\s،.])نو([\s،.]|$)/.test(normalized) ||
    normalized.includes("آکبند") ||
    normalized.includes("در حد نو");

  return {
    objective,
    maxBudget,
    cpuBrand: detectBrand(normalized, CPU_BRAND_KEYWORDS),
    graphicBrand: detectBrand(normalized, GRAPHIC_BRAND_KEYWORDS),
    minRamGb: ramMatch,
    preferNew,
    needsStrongGraphic,
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

const detectProductBrand = (
  product: BuildProduct,
): BrandPreference | undefined => {
  const haystack =
    `${product.manufacturer ?? ""} ${product.brand ?? ""} ${product.name ?? ""}`.toLowerCase();
  if (/intel|اینتی?ل/.test(haystack)) return "intel";
  if (/amd|ای‌?ام‌?دی|ریزن|ryzen|radeon|رادئون/.test(haystack)) return "amd";
  if (/nvidia|انویدیا|جی‌?فورس|geforce/.test(haystack)) return "nvidia";
  return undefined;
};

const matchesBrand = (
  product: BuildProduct,
  brand: BrandPreference,
): boolean => {
  const detected = detectProductBrand(product);
  // Products with no detectable brand stay available for every preference.
  return detected == null || detected === brand;
};

const preferFreshProducts = <T extends BuildProduct>(products: T[]): T[] => {
  const fresh = products.filter((product) => product.condition !== "used");
  return fresh.length > 0 ? fresh : products;
};

const applyIntentPreferences = (
  catalog: BuildCatalog,
  intent: BuildIntent,
): BuildCatalog => {
  const filterBy = <T extends BuildProduct>(
    products: T[],
    predicate: (product: T) => boolean,
  ): T[] => {
    const filtered = products.filter(predicate);
    return filtered.length > 0 ? filtered : products;
  };

  let result = catalog;
  if (intent.cpuBrand) {
    const brand = intent.cpuBrand;
    result = {
      ...result,
      cpu: filterBy(result.cpu, (product) => matchesBrand(product, brand)),
    };
  }
  if (intent.graphicBrand) {
    const brand = intent.graphicBrand;
    result = {
      ...result,
      graphic: filterBy(result.graphic, (product) =>
        matchesBrand(product, brand),
      ),
    };
  }
  if (intent.minRamGb != null) {
    const minRamGb = intent.minRamGb;
    result = {
      ...result,
      ram: filterBy(
        result.ram,
        (product) => (product.capacityGb ?? 0) >= minRamGb,
      ),
    };
  }
  if (intent.preferNew) {
    result = {
      ...result,
      cpu: preferFreshProducts(result.cpu),
      motherboard: preferFreshProducts(result.motherboard),
      ram: preferFreshProducts(result.ram),
      graphic: preferFreshProducts(result.graphic),
      power: preferFreshProducts(result.power),
      ssd: preferFreshProducts(result.ssd),
      case: preferFreshProducts(result.case),
      fan: preferFreshProducts(result.fan),
    };
  }
  return result;
};

const buildPerformanceScore = (
  build: CompleteBuild,
  intent: BuildIntent,
): number => {
  const graphicVramWeight = intent.needsStrongGraphic ? 10 : 4;
  return (
    (build.graphic.ram ?? 0) * graphicVramWeight +
    (build.cpu.maxTurboPowerW ?? 0) / 25 +
    (build.ram.capacityGb ?? 0) / 16 +
    (build.ssd.capacityGb ?? 0) / 1024
  );
};

export const findBuildRecommendation = (
  catalog: BuildCatalog,
  intent: BuildIntent,
): BuildRecommendation | undefined => {
  const preferredCatalog = applyIntentPreferences(catalog, intent);
  const pricedCatalog = Object.fromEntries(
    BUILD_PART_TYPES.map((partType) => [
      partType,
      preferredCatalog[partType]
        .filter(hasPrice)
        .sort((first, second) => Number(first.price) - Number(second.price)),
    ]),
  ) as Record<BuildPartType, (BuildProduct & { price: string })[]>;

  const maximizeValue = intent.objective === "best_value";
  const maximizePrice = intent.objective === "maximum_price";
  const maxBudget = intent.maxBudget ?? Number.POSITIVE_INFINITY;

  let bestBuild: CompleteBuild | undefined;
  let bestPrice = maximizePrice
    ? Number.NEGATIVE_INFINITY
    : Number.POSITIVE_INFINITY;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const cpu of pricedCatalog.cpu) {
    const fanCandidates = pricedCatalog.fan.filter(
      (candidate) =>
        includesProduct(cpu.fans, candidate) &&
        includesProduct(candidate.cpus, cpu) &&
        coolerSupportsCpuSocket(candidate.cpu_sockets, cpu.cpu_socket) &&
        candidate.coolingCapacityW != null &&
        cpu.maxTurboPowerW != null &&
        candidate.coolingCapacityW >= cpu.maxTurboPowerW,
    );
    if (fanCandidates.length === 0) continue;
    const fan = maximizePrice
      ? fanCandidates[fanCandidates.length - 1]
      : fanCandidates[0];

    for (const selectedGraphic of pricedCatalog.graphic) {
      if (
        !includesProduct(cpu.graphics, selectedGraphic) ||
        !includesProduct(selectedGraphic.cpus, cpu)
      ) {
        continue;
      }

      const powerCandidates = pricedCatalog.power.filter((candidate) => {
        const calculation = calculatePsuRequirement({
          cpu,
          graphic: selectedGraphic,
          fan,
        });
        return (
          calculation != null &&
          includesProduct(selectedGraphic.powers, candidate) &&
          includesProduct(candidate.graphics, selectedGraphic) &&
          Number(candidate.psu) >= calculation.recommendedPsuW
        );
      });
      if (powerCandidates.length === 0) continue;
      const power = maximizePrice
        ? powerCandidates[powerCandidates.length - 1]
        : powerCandidates[0];

      for (const motherboard of pricedCatalog.motherboard) {
        if (
          cpu.cpu_socket !== motherboard.cpu_socket ||
          !includesProduct(cpu.motherboards, motherboard) ||
          !includesProduct(motherboard.cpus, cpu)
        ) {
          continue;
        }

        const ramCandidates = pricedCatalog.ram.filter(
          (candidate) =>
            includesProduct(cpu.rams, candidate) &&
            includesProduct(motherboard.rams, candidate) &&
            includesProduct(candidate.cpus, cpu) &&
            includesProduct(candidate.motherboards, motherboard) &&
            candidate.capacityGb != null &&
            cpu.minimumRamGb != null &&
            candidate.capacityGb >= cpu.minimumRamGb,
        );
        if (ramCandidates.length === 0) continue;
        const ram = maximizePrice
          ? ramCandidates[ramCandidates.length - 1]
          : maximizeValue
            ? [...ramCandidates].sort(
                (first, second) =>
                  (second.capacityGb ?? 0) - (first.capacityGb ?? 0) ||
                  Number(first.price) - Number(second.price),
              )[0]
            : ramCandidates[0];

        const ssdCandidates = pricedCatalog.ssd.filter(
          (candidate) =>
            Boolean(candidate.form) &&
            motherboard.storageForms?.includes(candidate.form!) === true,
        );
        if (ssdCandidates.length === 0) continue;
        const ssd = maximizePrice
          ? ssdCandidates[ssdCandidates.length - 1]
          : maximizeValue
            ? [...ssdCandidates].sort(
                (first, second) =>
                  (second.capacityGb ?? 0) - (first.capacityGb ?? 0) ||
                  Number(first.price) - Number(second.price),
              )[0]
            : ssdCandidates[0];

        const caseCandidates = pricedCatalog.case.filter(
          (candidate) =>
            Boolean(motherboard.size) &&
            candidate.motherboardSizes?.includes(motherboard.size!) === true &&
            graphicFitsCase(selectedGraphic, candidate),
        );
        if (caseCandidates.length === 0) continue;
        const caseItem = maximizePrice
          ? caseCandidates[caseCandidates.length - 1]
          : caseCandidates[0];

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

        if (totalPrice > maxBudget) continue;

        if (maximizeValue) {
          const score = buildPerformanceScore(candidate, intent);
          if (
            score > bestScore ||
            (score === bestScore && totalPrice < bestPrice)
          ) {
            bestBuild = candidate;
            bestPrice = totalPrice;
            bestScore = score;
          }
        } else if (maximizePrice) {
          if (totalPrice > bestPrice) {
            bestBuild = candidate;
            bestPrice = totalPrice;
          }
        } else if (totalPrice < bestPrice) {
          bestBuild = candidate;
          bestPrice = totalPrice;
        }
      }
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

export const findMinimumPriceBuild = (
  catalog: BuildCatalog,
  maxBudget?: number,
): BuildRecommendation | undefined =>
  findBuildRecommendation(catalog, {
    objective: "minimum_price",
    maxBudget,
  });

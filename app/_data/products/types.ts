export type PartType =
  | "cpu"
  | "motherboard"
  | "graphic"
  | "power"
  | "ram"
  | "fan"
  | "ssd"
  | "case";

export type ProductCondition = "new" | "used";

export interface RecommendableProduct {
  recommendations?: Partial<Record<PartType, number[]>>;
  condition?: ProductCondition;
}

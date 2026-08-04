export type PartType =
  | "cpu"
  | "motherboard"
  | "graphic"
  | "power"
  | "ram"
  | "fan"
  | "ssd"
  | "case";

export interface RecommendableProduct {
  recommendations?: Partial<Record<PartType, number[]>>;
}

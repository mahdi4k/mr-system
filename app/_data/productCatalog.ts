import type { CASE } from "@/_redux/services/caseApi";
import type { CPU } from "@/_redux/services/cpuApi";
import type { FAN } from "@/_redux/services/fanApi";
import type { Graphic } from "@/_redux/services/graphicApi";
import type { Motherboard } from "@/_redux/services/motherboardApi";
import type { POWER } from "@/_redux/services/powerApi";
import type { RAM } from "@/_redux/services/ramApi";
import type { SSD } from "@/_redux/services/ssdApi";
import { cases } from "./products/cases";
import { cpus } from "./products/cpus";
import { fans } from "./products/fans";
import { graphics } from "./products/graphics";
import { motherboards } from "./products/motherboards";
import { powers } from "./products/powers";
import { rams } from "./products/rams";
import { ssds } from "./products/ssds";

export { cases, cpus, fans, graphics, motherboards, powers, rams, ssds };

export const getCpu = (id: string): CPU | undefined =>
  cpus.find((cpu) => cpu.id === Number(id));

export const getCpusByIds = (ids: number[]): CPU[] =>
  cpus.filter((cpu) => ids.includes(cpu.id));

export const getGraphic = (id: string): Graphic | undefined =>
  graphics.find((graphic) => graphic.id === Number(id));

export const getGraphicsByIds = (ids: number[]): Graphic[] =>
  graphics.filter((graphic) => ids.includes(graphic.id));

export const getMotherboard = (id: string): Motherboard | undefined =>
  motherboards.find((motherboard) => motherboard.id === Number(id));

export const getMotherboardsByIds = (ids: number[]): Motherboard[] =>
  motherboards.filter((motherboard) => ids.includes(motherboard.id));

export const getRam = (id: string): RAM | undefined =>
  rams.find((ram) => ram.id === Number(id));

export const getRamsByIds = (ids: number[]): RAM[] =>
  rams.filter((ram) => ids.includes(ram.id));

export const getPower = (id: string): POWER | undefined =>
  powers.find((power) => power.id === Number(id));

export const getPowersByIds = (ids: number[]): POWER[] =>
  powers.filter((power) => ids.includes(power.id));

export const getCase = (id: string): CASE | undefined =>
  cases.find((caseItem) => caseItem.id === Number(id));

export const getFan = (id: string): FAN | undefined =>
  fans.find((fan) => fan.id === Number(id));

export const getFansByIds = (ids: number[]): FAN[] =>
  fans.filter((fan) => ids.includes(fan.id));

export const getSsd = (id: string): SSD | undefined =>
  ssds.find((ssd) => ssd.id === Number(id));

export const filterCpus = (filters: {
  manufacturer?: string[];
  search?: string;
}): CPU[] => {
  let result = cpus;

  if (filters.manufacturer?.length) {
    result = result.filter((cpu) =>
      filters.manufacturer?.includes(cpu.manufacturer),
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((cpu) => cpu.name.toLowerCase().includes(search));
  }

  return result;
};

export const filterGraphics = (filters: {
  manufacturer?: string[];
  search?: string;
}): Graphic[] => {
  let result = graphics;

  if (filters.manufacturer?.length) {
    result = result.filter((graphic) =>
      filters.manufacturer?.includes(graphic.manufacturer),
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((graphic) =>
      graphic.name.toLowerCase().includes(search),
    );
  }

  return result;
};

export const filterMotherboards = (filters: {
  manufacturer?: string[];
  search?: string;
}): Motherboard[] => {
  let result = motherboards;

  if (filters.manufacturer?.length) {
    result = result.filter((motherboard) =>
      filters.manufacturer?.includes(motherboard.brand),
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((motherboard) =>
      motherboard.name.toLowerCase().includes(search),
    );
  }

  return result;
};

export const filterPowers = (filters: {
  modular?: string[];
  search?: string;
}): POWER[] => {
  let result = powers;

  if (filters.modular?.length) {
    result = result.filter((power) =>
      filters.modular?.includes(String(power.modular)),
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((power) =>
      power.name.toLowerCase().includes(search),
    );
  }

  return result;
};

import { api } from "./api";
import { IResult } from "./caseApi";
import { filterPowers, getPower, powers } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";

export type POWER = RecommendableProduct & {
  id: number;
  name: string;
  attributes?: string[];
  image: string;
  price?: string;
  links: string;
  graphics: number[];
  brand?: string;
  psu: string;
  modular: number;
  torobUrl?: string;
};

interface TorobProduct {
  price?: number | null;
  image?: string | null;
  url: string;
}

interface TorobProductResponse {
  success: boolean;
  product?: TorobProduct;
  error?: string;
}

const enrichPowerWithTorob = async (power: POWER): Promise<POWER> => {
  if (!power.torobUrl) return power;

  try {
    const params = new URLSearchParams({ url: power.torobUrl });
    const response = await fetch(`/api/torob-product?${params}`);
    const result = (await response.json()) as TorobProductResponse;

    if (!response.ok || !result.success || !result.product) {
      throw new Error(result.error ?? "Failed to fetch Torob product");
    }

    return {
      ...power,
      price:
        result.product.price == null
          ? power.price
          : String(result.product.price),
      image: result.product.image ?? power.image,
      links: result.product.url,
    };
  } catch {
    return power;
  }
};

export const PowerApi = api.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getPowers: builder.query<
      POWER[],
      {
        modular?: string[] | never[];
        eighty_plus?: string[] | never[];
        search?: string;
      }
    >({
      queryFn: async ({ modular, eighty_plus, search }) => {
        const canonicalPowers = filterPowers({ modular, search });
        const data = await Promise.all(
          canonicalPowers.map(enrichPowerWithTorob),
        );
        return { data };
      },
      providesTags: ["power"],
    }),
    getPower: builder.query<IResult<POWER>, { id: string }>({
      queryFn: async ({ id }) => {
        const power = getPower(id);
        if (power) {
          const data = await enrichPowerWithTorob(power);
          return { data: { message: "Power یافت شد", data } };
        }
        return { data: { message: "Power یافت نشد", data: powers[0] } };
      },
      providesTags: ["power"],
    }),
    createPower: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Power با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["power"],
    }),
    addPowerImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removePower: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Power با موفقیت حذف شد" } };
      },
      invalidatesTags: ["power"],
    }),
  }),
});

export const {
  useGetPowersQuery,
  useLazyGetPowersQuery,
  useLazyGetPowerQuery,
  useCreatePowerMutation,
  useAddPowerImageMutation,
  useRemovePowerMutation,
} = PowerApi;

import { api } from "./api";
import { IResult } from "./caseApi";
import {
  filterMotherboards,
  getMotherboard,
  motherboards,
} from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";

export type Motherboard = RecommendableProduct & {
  id: number;
  name: string;
  size: string;
  total_slot_ram: number;
  brand: string;
  price?: string;
  cpu_socket?: string;
  ddr3?: boolean;
  ddr4?: boolean;
  ddr5?: boolean;
  wifi_support?: boolean;
  links: string;
  image: string;
  cpus: number[];
  rams: number[];
  storageForms: ("M.2" | "2.5-inch")[];
  attributes?: string[];
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

const enrichMotherboardWithTorob = async (
  motherboard: Motherboard,
): Promise<Motherboard> => {
  if (!motherboard.torobUrl) return motherboard;

  try {
    const params = new URLSearchParams({ url: motherboard.torobUrl });
    const response = await fetch(`/api/torob-product?${params}`);
    const result = (await response.json()) as TorobProductResponse;

    if (!response.ok || !result.success || !result.product) {
      throw new Error(result.error ?? "Failed to fetch Torob product");
    }

    return {
      ...motherboard,
      price:
        result.product.price == null
          ? motherboard.price
          : String(result.product.price),
      image: result.product.image ?? motherboard.image,
      links: result.product.url,
    };
  } catch {
    return motherboard;
  }
};

type authTokenDTO = {
  auth: {
    userToken: {
      user: string;
    };
  };
};
export const motherboardApi = api.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getMotherboards: builder.query<
      Motherboard[],
      { manufacturer?: string[] | never[]; search?: string }
    >({
      queryFn: async ({ manufacturer, search }) => {
        const canonicalMotherboards = filterMotherboards({
          manufacturer,
          search,
        });
        const data = await Promise.all(
          canonicalMotherboards.map(enrichMotherboardWithTorob),
        );
        return { data };
      },
      providesTags: ["motherboards"],
    }),
    getMotherboard: builder.query<IResult<Motherboard>, { id: string }>({
      queryFn: async ({ id }) => {
        const motherboard = getMotherboard(id);
        if (motherboard) {
          const data = await enrichMotherboardWithTorob(motherboard);
          return {
            data: { message: "Motherboard یافت شد", data },
          };
        }
        return {
          data: { message: "Motherboard یافت نشد", data: motherboards[0] },
        };
      },
      providesTags: ["motherboards"],
    }),
    createMotherboard: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
          data: { message: "Motherboard با موفقیت ایجاد شد", data: payload },
        };
      },
      invalidatesTags: ["motherboards"],
    }),
    addMotherboardImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeMotherboard: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Motherboard با موفقیت حذف شد" } };
      },
      invalidatesTags: ["motherboards"],
    }),
  }),
});

export const {
  useGetMotherboardsQuery,
  useLazyGetMotherboardsQuery,
  useLazyGetMotherboardQuery,
  useCreateMotherboardMutation,
  useAddMotherboardImageMutation,
  useRemoveMotherboardMutation,
} = motherboardApi;

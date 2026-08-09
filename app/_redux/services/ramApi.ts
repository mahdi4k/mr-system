import { api } from "./api";
import { IResult } from "./caseApi";
import { getRam, rams } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";

export type RAM = RecommendableProduct & {
  id: number;
  name: string;
  frequency: string;
  brand?: string;
  rgb: boolean;
  image: string;
  price?: string;
  links: string;
  cpus: number[];
  motherboards: number[];
  capacityGb: number;
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

const enrichRamWithTorob = async (ram: RAM): Promise<RAM> => {
  if (!ram.torobUrl) return ram;

  try {
    const params = new URLSearchParams({ url: ram.torobUrl });
    const response = await fetch(`/api/torob-product?${params}`);
    const result = (await response.json()) as TorobProductResponse;

    if (!response.ok || !result.success || !result.product) {
      throw new Error(result.error ?? "Failed to fetch Torob product");
    }

    return {
      ...ram,
      price:
        result.product.price == null ? ram.price : String(result.product.price),
      image: result.product.image ?? ram.image,
      links: result.product.url,
    };
  } catch {
    return ram;
  }
};

export const RamApi = api.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getRams: builder.query<RAM[], { search?: string }>({
      queryFn: async ({ search }) => {
        let data = rams;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((ram) =>
            ram.name.toLowerCase().includes(searchLower),
          );
        }
        return { data: await Promise.all(data.map(enrichRamWithTorob)) };
      },
      providesTags: ["ram"],
    }),
    createRam: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "RAM با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["ram"],
    }),
    getRam: builder.query<IResult<RAM>, { id: string }>({
      queryFn: async ({ id }) => {
        const ram = getRam(id);
        if (ram) {
          const data = await enrichRamWithTorob(ram);
          return { data: { message: "RAM یافت شد", data } };
        }
        return { data: { message: "RAM یافت نشد", data: rams[0] } };
      },
      providesTags: ["ram"],
    }),

    addRamImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeRam: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "RAM با موفقیت حذف شد" } };
      },
      invalidatesTags: ["ram"],
    }),
  }),
});

export const {
  useGetRamsQuery,
  useLazyGetRamsQuery,
  useLazyGetRamQuery,
  useCreateRamMutation,
  useAddRamImageMutation,
  useRemoveRamMutation,
} = RamApi;

import { api } from "./api";
import { IResult } from "./caseApi";
import { getSsd, ssds } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";

export type SSD = RecommendableProduct & {
  id: number;
  name: string;
  size: string;
  brand?: string;
  read: string;
  write: string;
  age: string;
  image: string;
  emalls?: string;
  torob?: string;
  form: "M.2" | "2.5-inch";
  price?: string;
  links: string;
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

const enrichSsdWithTorob = async (ssd: SSD): Promise<SSD> => {
  if (!ssd.torobUrl) return ssd;

  try {
    const params = new URLSearchParams({ url: ssd.torobUrl });
    const response = await fetch(`/api/torob-product?${params}`);
    const result = (await response.json()) as TorobProductResponse;

    if (!response.ok || !result.success || !result.product) {
      throw new Error(result.error ?? "Failed to fetch Torob product");
    }

    return {
      ...ssd,
      price:
        result.product.price == null ? ssd.price : String(result.product.price),
      image: result.product.image ?? ssd.image,
      links: result.product.url,
    };
  } catch {
    return ssd;
  }
};

export const SsdApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSsds: builder.query<SSD[], { search?: string }>({
      queryFn: async ({ search }) => {
        let data = ssds;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((ssd) =>
            ssd.name.toLowerCase().includes(searchLower),
          );
        }
        return { data: await Promise.all(data.map(enrichSsdWithTorob)) };
      },
      providesTags: ["ssd"],
    }),
    getSsd: builder.query<IResult<SSD>, { id: string }>({
      queryFn: async ({ id }) => {
        const ssd = getSsd(id);
        if (ssd) {
          const data = await enrichSsdWithTorob(ssd);
          return { data: { message: "SSD یافت شد", data } };
        }
        return { data: { message: "SSD یافت نشد", data: ssds[0] } };
      },
      providesTags: ["ssd"],
    }),
    createSsd: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "SSD با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["ssd"],
    }),
    updateSsd: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "SSD با موفقیت ویرایش شد", data: payload } };
      },
      invalidatesTags: ["ssd"],
    }),
    addSsdImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeSsd: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "SSD با موفقیت حذف شد" } };
      },
      invalidatesTags: ["ssd"],
    }),
  }),
});

export const {
  useGetSsdsQuery,
  useLazyGetSsdsQuery,
  useLazyGetSsdQuery,
  useCreateSsdMutation,
  useAddSsdImageMutation,
  useRemoveSsdMutation,
  useUpdateSsdMutation,
  useGetSsdQuery,
} = SsdApi;

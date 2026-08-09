import { api } from "./api";
import { cases, getCase } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";

export interface IResult<T> {
  message: string;
  data: T;
}

export type CASE = RecommendableProduct & {
  id: number;
  name: string;
  max_total_fan: string;
  brand?: string;
  form: string;
  motherboardSizes: ("ATX" | "Micro-ATX")[];
  rgb: boolean;
  image: string;
  emalls?: string;
  torob?: string;
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

const enrichCaseWithTorob = async (caseItem: CASE): Promise<CASE> => {
  if (!caseItem.torobUrl) return caseItem;

  try {
    const params = new URLSearchParams({ url: caseItem.torobUrl });
    const response = await fetch(`/api/torob-product?${params}`);
    const result = (await response.json()) as TorobProductResponse;

    if (!response.ok || !result.success || !result.product) {
      throw new Error(result.error ?? "Failed to fetch Torob product");
    }

    return {
      ...caseItem,
      price:
        result.product.price == null
          ? caseItem.price
          : String(result.product.price),
      image: result.product.image ?? caseItem.image,
      links: result.product.url,
    };
  } catch {
    return caseItem;
  }
};

export const CaseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCases: builder.query<CASE[], { search?: string }>({
      queryFn: async ({ search }) => {
        let data = cases;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((c) => c.name.toLowerCase().includes(searchLower));
        }
        return { data: await Promise.all(data.map(enrichCaseWithTorob)) };
      },
      providesTags: ["case"],
    }),
    getCase: builder.query<IResult<CASE>, { id: string }>({
      queryFn: async ({ id }) => {
        const caseItem = getCase(id);
        if (caseItem) {
          const data = await enrichCaseWithTorob(caseItem);
          return { data: { message: "Case یافت شد", data } };
        }
        return { data: { message: "Case یافت نشد", data: cases[0] } };
      },
      providesTags: ["case"],
    }),
    createCase: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Case با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["case"],
    }),
    updateCase: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Case با موفقیت ویرایش شد", data: payload } };
      },
      invalidatesTags: ["case"],
    }),
    addCaseImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeCase: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Case با موفقیت حذف شد" } };
      },
      invalidatesTags: ["case"],
    }),
  }),
});

export const {
  useGetCasesQuery,
  useLazyGetCasesQuery,
  useLazyGetCaseQuery,
  useCreateCaseMutation,
  useAddCaseImageMutation,
  useRemoveCaseMutation,
  useUpdateCaseMutation,
  useGetCaseQuery,
} = CaseApi;

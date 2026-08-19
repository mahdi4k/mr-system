import { api } from "./api";
import { cases, getCase } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";
import { enrichCatalogParts } from "../../_features/productCatalog/client";

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

const enrichCaseWithCatalog = (cases: CASE[]): Promise<CASE[]> =>
  enrichCatalogParts<CASE>(cases, "case");

export const CaseApi = api.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getCases: builder.query<CASE[], { search?: string }>({
      queryFn: async ({ search }) => {
        let data = cases;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((c) => c.name.toLowerCase().includes(searchLower));
        }
        return { data: await enrichCaseWithCatalog(data) };
      },
      providesTags: ["case"],
    }),
    getCase: builder.query<IResult<CASE>, { id: string }>({
      queryFn: async ({ id }) => {
        const caseItem = getCase(id);
        if (caseItem) {
          const data = (await enrichCaseWithCatalog([caseItem]))[0];
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

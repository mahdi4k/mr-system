import { api } from "./api";
import { IResult } from "./caseApi";
import {
  filterMotherboards,
  getMotherboard,
  motherboards,
} from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";
import { enrichCatalogParts } from "../../_features/productCatalog/client";

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

const enrichMotherboardWithCatalog = (
  motherboards: Motherboard[],
): Promise<Motherboard[]> =>
  enrichCatalogParts<Motherboard>(motherboards, "motherboard");

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
        const data = await enrichMotherboardWithCatalog(canonicalMotherboards);
        return { data };
      },
      providesTags: ["motherboards"],
    }),
    getMotherboard: builder.query<IResult<Motherboard>, { id: string }>({
      queryFn: async ({ id }) => {
        const motherboard = getMotherboard(id);
        if (motherboard) {
          const data = (await enrichMotherboardWithCatalog([motherboard]))[0];
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

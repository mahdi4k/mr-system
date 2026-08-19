import { api } from "./api";
import { IResult } from "./caseApi";
import { filterCpus, getCpu } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";
import { enrichCatalogParts } from "../../_features/productCatalog/client";

export type CPU = RecommendableProduct & {
  id: number;
  name: string;
  cpu_socket: string;
  integrated_graphic: string;
  manufacturer: string;
  price?: string;
  attributes?: string[];
  image: string;
  motherboards: number[];
  fans: number[];
  graphics: number[];
  links: string;
  brand?: string;
  rams: number[];
  maxTurboPowerW: number;
  minimumRamGb: number;
  torobUrl?: string;
};

const enrichCpusWithCatalog = (cpus: CPU[]): Promise<CPU[]> =>
  enrichCatalogParts<CPU>(cpus, "cpu");

export const cpuApi = api.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getCpus: builder.query<CPU[], { manufacturer?: string[]; search?: string }>(
      {
        queryFn: async ({ manufacturer, search }) => {
          const canonicalCpus = filterCpus({ manufacturer, search });
          const data = await enrichCpusWithCatalog(canonicalCpus);
          return { data };
        },
        providesTags: ["cpu"],
      },
    ),
    getCpu: builder.query<IResult<CPU>, { id: string }>({
      queryFn: async ({ id }) => {
        const cpu = getCpu(id);

        if (!cpu) {
          return { error: { status: 404, data: "CPU یافت نشد" } };
        }

        const data = (await enrichCpusWithCatalog([cpu]))[0];
        return { data: { message: "CPU یافت شد", data } };
      },
      providesTags: ["cpu"],
    }),
    createCpus: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "CPU با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["cpu"],
    }),
    addCpuImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeCpu: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "CPU با موفقیت حذف شد" } };
      },
      invalidatesTags: ["cpu"],
    }),
  }),
});

export const {
  useGetCpusQuery,
  useLazyGetCpuQuery,
  useLazyGetCpusQuery,
  useCreateCpusMutation,
  useAddCpuImageMutation,
  useRemoveCpuMutation,
} = cpuApi;

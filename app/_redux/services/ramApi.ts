import { api } from "./api";
import { IResult } from "./caseApi";
import { getRam, rams } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";
import { enrichCatalogParts } from "../../_features/productCatalog/client";

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

const enrichRamWithCatalog = (rams: RAM[]): Promise<RAM[]> =>
  enrichCatalogParts<RAM>(rams, "ram");

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
        return { data: await enrichRamWithCatalog(data) };
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
          const data = (await enrichRamWithCatalog([ram]))[0];
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

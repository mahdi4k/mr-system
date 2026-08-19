import { api } from "./api";
import { IResult } from "./caseApi";
import { fans, getFan } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";
import { enrichCatalogParts } from "../../_features/productCatalog/client";

export type FAN = RecommendableProduct & {
  id: number;
  name: string;
  fan_noise?: string;
  heat_sink_material?: string;
  cpu_sockets?: string;
  rgb: boolean;
  image: string;
  price?: string;
  links: string;
  cpus: number[];
  coolingCapacityW?: number;
  powerDrawW: number;
  brand?: string;
  torobUrl?: string;
};

const enrichFanWithCatalog = (fans: FAN[]): Promise<FAN[]> =>
  enrichCatalogParts<FAN>(fans, "fan");

export const FanApi = api.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getFans: builder.query<FAN[], { search?: string }>({
      queryFn: async ({ search }) => {
        let data = fans;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((fan) =>
            fan.name.toLowerCase().includes(searchLower),
          );
        }
        return { data: await enrichFanWithCatalog(data) };
      },
      providesTags: ["fan"],
    }),
    getFan: builder.query<IResult<FAN>, { id: string }>({
      queryFn: async ({ id }) => {
        const fan = getFan(id);
        if (fan) {
          const data = (await enrichFanWithCatalog([fan]))[0];
          return { data: { message: "Fan یافت شد", data } };
        }
        return { data: { message: "Fan یافت نشد", data: fans[0] } };
      },
      providesTags: ["fan"],
    }),
    createFan: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Fan با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["fan"],
    }),
    addFanImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeFan: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Fan با موفقیت حذف شد" } };
      },
      invalidatesTags: ["fan"],
    }),
  }),
});

export const {
  useGetFansQuery,
  useLazyGetFansQuery,
  useLazyGetFanQuery,
  useGetFanQuery,
  useCreateFanMutation,
  useAddFanImageMutation,
  useRemoveFanMutation,
} = FanApi;

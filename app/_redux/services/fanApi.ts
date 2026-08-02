import { api } from "./api";
import { IResult } from "./caseApi";
import { fans, getFan } from "@/_data/productCatalog";

export type FAN = {
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
  brand?: string;
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

const enrichFanWithTorob = async (fan: FAN): Promise<FAN> => {
  if (!fan.torobUrl) return fan;

  try {
    const params = new URLSearchParams({ url: fan.torobUrl });
    const response = await fetch(`/api/torob-product?${params}`);
    const result = (await response.json()) as TorobProductResponse;

    if (!response.ok || !result.success || !result.product) {
      throw new Error(result.error ?? "Failed to fetch Torob product");
    }

    return {
      ...fan,
      price:
        result.product.price == null ? fan.price : String(result.product.price),
      image: result.product.image ?? fan.image,
      links: result.product.url,
    };
  } catch {
    return fan;
  }
};

export const FanApi = api.injectEndpoints({
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
        return { data: await Promise.all(data.map(enrichFanWithTorob)) };
      },
      providesTags: ["fan"],
    }),
    getFan: builder.query<IResult<FAN>, { id: string }>({
      queryFn: async ({ id }) => {
        const fan = getFan(id);
        if (fan) {
          const data = await enrichFanWithTorob(fan);
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

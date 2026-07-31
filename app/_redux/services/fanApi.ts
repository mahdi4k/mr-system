import { api } from "./api";
import { IResult } from "./caseApi";
import { mockFans, getMockFan } from "./mockData";

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
};

export const FanApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFans: builder.query<FAN[], { search?: string }>({
      queryFn: async ({ search }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let data = mockFans;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((fan) =>
            fan.name.toLowerCase().includes(searchLower),
          );
        }
        return { data };
      },
      providesTags: ["fan"],
    }),
    getFan: builder.query<IResult<FAN>, { id: string }>({
      queryFn: async ({ id }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const fan = getMockFan(id);
        if (fan) {
          return { data: { message: "Fan یافت شد", data: fan } };
        }
        return { data: { message: "Fan یافت نشد", data: mockFans[0] } };
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

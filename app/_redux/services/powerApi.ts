import { api } from "./api";
import { IResult } from "./caseApi";
import { mockPowers, filterMockPowers, getMockPower } from "./mockData";

export type POWER = {
  id: number;
  name: string;
  attributes?: string[];
  image: string;
  price?: string;
  links: string;
  graphics: number[];
  brand?: string;
  psu: string;
  modular: number;
};

export const PowerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPowers: builder.query<
      POWER[],
      {
        modular?: string[] | never[];
        eighty_plus?: string[] | never[];
        search?: string;
      }
    >({
      queryFn: async ({ modular, eighty_plus, search }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data = filterMockPowers({ modular, eighty_plus, search });
        return { data };
      },
      providesTags: ["power"],
    }),
    getPower: builder.query<IResult<POWER>, { id: string }>({
      queryFn: async ({ id }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const power = getMockPower(id);
        if (power) {
          return { data: { message: "Power یافت شد", data: power } };
        }
        return { data: { message: "Power یافت نشد", data: mockPowers[0] } };
      },
      providesTags: ["power"],
    }),
    createPower: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Power با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["power"],
    }),
    addPowerImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removePower: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Power با موفقیت حذف شد" } };
      },
      invalidatesTags: ["power"],
    }),
  }),
});

export const {
  useGetPowersQuery,
  useLazyGetPowersQuery,
  useLazyGetPowerQuery,
  useCreatePowerMutation,
  useAddPowerImageMutation,
  useRemovePowerMutation,
} = PowerApi;

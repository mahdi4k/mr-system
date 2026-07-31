import { api } from "./api";
import { IResult } from "./caseApi";
import {
  mockMotherboards,
  filterMockMotherboards,
  getMockMotherboard,
} from "./mockData";

export type Motherboard = {
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
  attributes?: string[];
};

type authTokenDTO = {
  auth: {
    userToken: {
      user: string;
    };
  };
};
export const motherboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMotherboards: builder.query<
      Motherboard[],
      { manufacturer?: string[] | never[]; search?: string }
    >({
      queryFn: async ({ manufacturer, search }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data = filterMockMotherboards({ manufacturer, search });
        return { data };
      },
      providesTags: ["motherboards"],
    }),
    getMotherboard: builder.query<IResult<Motherboard>, { id: string }>({
      queryFn: async ({ id }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const motherboard = getMockMotherboard(id);
        if (motherboard) {
          return {
            data: { message: "Motherboard یافت شد", data: motherboard },
          };
        }
        return {
          data: { message: "Motherboard یافت نشد", data: mockMotherboards[0] },
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

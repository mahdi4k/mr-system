import { api } from "./api";
import { IResult } from "./caseApi";
import {
  mockCpus,
  filterMockCpus,
  getMockCpu,
  mockIResultCpu,
} from "./mockData";

export type CPU = {
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
};

export const cpuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCpus: builder.query<
      CPU[],
      { manufacturer?: string[] | never[]; search?: string }
    >({
      queryFn: async ({ manufacturer, search }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data = filterMockCpus({ manufacturer, search });
        return { data };
      },
      providesTags: ["cpu"],
    }),
    getCpu: builder.query<IResult<CPU>, { id: string }>({
      queryFn: async ({ id }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const cpu = getMockCpu(id);
        if (cpu) {
          return { data: { message: "CPU یافت شد", data: cpu } };
        }
        return { data: { message: "CPU یافت نشد", data: mockCpus[0] } };
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

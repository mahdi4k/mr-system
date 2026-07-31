import { api } from "./api";
import { IResult } from "./caseApi";
import { mockRams, getMockRam } from "./mockData";

export type RAM = {
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
};

export const RamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRams: builder.query<RAM[], { search?: string }>({
      queryFn: async ({ search }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let data = mockRams;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((ram) =>
            ram.name.toLowerCase().includes(searchLower),
          );
        }
        return { data };
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
        await new Promise((resolve) => setTimeout(resolve, 300));
        const ram = getMockRam(id);
        if (ram) {
          return { data: { message: "RAM یافت شد", data: ram } };
        }
        return { data: { message: "RAM یافت نشد", data: mockRams[0] } };
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

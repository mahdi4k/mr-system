import { api } from "./api";
import { IResult } from "./caseApi";
import { mockSsds, getMockSsd } from "./mockData";

export type SSD = {
  id: number;
  name: string;
  size: string;
  brand?: string;
  read: string;
  write: string;
  age: string;
  image: string;
  emalls?: string;
  torob?: string;
  form: "M.2" | "2.5-inch";
  price?: string;
  links: string;
};

export const SsdApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSsds: builder.query<SSD[], { search?: string }>({
      queryFn: async ({ search }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let data = mockSsds;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((ssd) =>
            ssd.name.toLowerCase().includes(searchLower),
          );
        }
        return { data };
      },
      providesTags: ["ssd"],
    }),
    getSsd: builder.query<IResult<SSD>, { id: string }>({
      queryFn: async ({ id }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const ssd = getMockSsd(id);
        if (ssd) {
          return { data: { message: "SSD یافت شد", data: ssd } };
        }
        return { data: { message: "SSD یافت نشد", data: mockSsds[0] } };
      },
      providesTags: ["ssd"],
    }),
    createSsd: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "SSD با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["ssd"],
    }),
    updateSsd: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "SSD با موفقیت ویرایش شد", data: payload } };
      },
      invalidatesTags: ["ssd"],
    }),
    addSsdImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeSsd: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "SSD با موفقیت حذف شد" } };
      },
      invalidatesTags: ["ssd"],
    }),
  }),
});

export const {
  useGetSsdsQuery,
  useLazyGetSsdsQuery,
  useLazyGetSsdQuery,
  useCreateSsdMutation,
  useAddSsdImageMutation,
  useRemoveSsdMutation,
  useUpdateSsdMutation,
  useGetSsdQuery,
} = SsdApi;

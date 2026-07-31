import { api } from "./api";
import { mockCases, getMockCase } from "./mockData";

export interface IResult<T> {
  message: string;
  data: T;
}

export type CASE = {
  id: number;
  name: string;
  max_total_fan: string;
  brand?: string;
  form: string;
  rgb: boolean;
  image: string;
  emalls?: string;
  torob?: string;
  price?: string;
  links: string;
};

export const CaseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCases: builder.query<CASE[], { search?: string }>({
      queryFn: async ({ search }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let data = mockCases;
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter((c) => c.name.toLowerCase().includes(searchLower));
        }
        return { data };
      },
      providesTags: ["case"],
    }),
    getCase: builder.query<IResult<CASE>, { id: string }>({
      queryFn: async ({ id }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const caseItem = getMockCase(id);
        if (caseItem) {
          return { data: { message: "Case یافت شد", data: caseItem } };
        }
        return { data: { message: "Case یافت نشد", data: mockCases[0] } };
      },
      providesTags: ["case"],
    }),
    createCase: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Case با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["case"],
    }),
    updateCase: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Case با موفقیت ویرایش شد", data: payload } };
      },
      invalidatesTags: ["case"],
    }),
    addCaseImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeCase: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Case با موفقیت حذف شد" } };
      },
      invalidatesTags: ["case"],
    }),
  }),
});

export const {
  useGetCasesQuery,
  useLazyGetCasesQuery,
  useLazyGetCaseQuery,
  useCreateCaseMutation,
  useAddCaseImageMutation,
  useRemoveCaseMutation,
  useUpdateCaseMutation,
  useGetCaseQuery,
} = CaseApi;

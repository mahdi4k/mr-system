import { api } from "./api";
import { IResult } from "./caseApi";
import { mockGraphics, filterMockGraphics, getMockGraphic } from "./mockData";

export type Graphic = {
  id: number;
  name: string;
  manufacturer: string;
  attributes?: string[];
  links: string;
  type?: string;
  ram?: number;
  image: string;
  price?: string;
  cpus: number[];
  brand?: string;
  psu: string;
  powers: number[];
};

export const graphicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGraphics: builder.query<
      Graphic[],
      { manufacturer?: string[] | never[]; search?: string }
    >({
      queryFn: async ({ manufacturer, search }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data = filterMockGraphics({ manufacturer, search });
        return { data };
      },
      providesTags: ["graphic"],
    }),
    getGraphic: builder.query<IResult<Graphic>, { id: string }>({
      queryFn: async ({ id }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const graphic = getMockGraphic(id);
        if (graphic) {
          return { data: { message: "Graphic یافت شد", data: graphic } };
        }
        return { data: { message: "Graphic یافت نشد", data: mockGraphics[0] } };
      },
      providesTags: ["graphic"],
    }),
    createGraphic: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
          data: { message: "Graphic با موفقیت ایجاد شد", data: payload },
        };
      },
      invalidatesTags: ["graphic"],
    }),
    addGraphicImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeGraphic: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "Graphic با موفقیت حذف شد" } };
      },
      invalidatesTags: ["graphic"],
    }),
  }),
});

export const {
  useGetGraphicsQuery,
  useLazyGetGraphicsQuery,
  useLazyGetGraphicQuery,
  useCreateGraphicMutation,
  useAddGraphicImageMutation,
  useRemoveGraphicMutation,
} = graphicApi;

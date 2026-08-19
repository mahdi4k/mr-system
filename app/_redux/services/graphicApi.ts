import { api } from "./api";
import { IResult } from "./caseApi";
import { filterGraphics, getGraphic, graphics } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";
import { enrichCatalogParts } from "../../_features/productCatalog/client";

export type Graphic = RecommendableProduct & {
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
  boardPowerW: number;
  minimumCaseForm: "Micro Tower" | "Mid Tower" | "Full Tower";
  torobUrl?: string;
};

const enrichGraphicWithCatalog = (graphics: Graphic[]): Promise<Graphic[]> =>
  enrichCatalogParts<Graphic>(graphics, "graphic");

export const graphicApi = api.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getGraphics: builder.query<
      Graphic[],
      { manufacturer?: string[] | never[]; search?: string }
    >({
      queryFn: async ({ manufacturer, search }) => {
        const canonicalGraphics = filterGraphics({ manufacturer, search });
        const data = await enrichGraphicWithCatalog(canonicalGraphics);
        return { data };
      },
      providesTags: ["graphic"],
    }),
    getGraphic: builder.query<IResult<Graphic>, { id: string }>({
      queryFn: async ({ id }) => {
        const graphic = getGraphic(id);
        if (graphic) {
          const data = (await enrichGraphicWithCatalog([graphic]))[0];
          return { data: { message: "Graphic یافت شد", data } };
        }
        return { data: { message: "Graphic یافت نشد", data: graphics[0] } };
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

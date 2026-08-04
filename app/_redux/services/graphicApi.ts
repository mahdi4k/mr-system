import { api } from "./api";
import { IResult } from "./caseApi";
import { filterGraphics, getGraphic, graphics } from "@/_data/productCatalog";
import type { RecommendableProduct } from "@/_data/products/types";

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

const enrichGraphicWithTorob = async (graphic: Graphic): Promise<Graphic> => {
  if (!graphic.torobUrl) return graphic;

  try {
    const params = new URLSearchParams({ url: graphic.torobUrl });
    const response = await fetch(`/api/torob-product?${params}`);
    const result = (await response.json()) as TorobProductResponse;

    if (!response.ok || !result.success || !result.product) {
      throw new Error(result.error ?? "Failed to fetch Torob product");
    }

    return {
      ...graphic,
      price:
        result.product.price == null
          ? graphic.price
          : String(result.product.price),
      image: result.product.image ?? graphic.image,
      links: result.product.url,
    };
  } catch {
    return graphic;
  }
};

export const graphicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGraphics: builder.query<
      Graphic[],
      { manufacturer?: string[] | never[]; search?: string }
    >({
      queryFn: async ({ manufacturer, search }) => {
        const canonicalGraphics = filterGraphics({ manufacturer, search });
        const data = await Promise.all(
          canonicalGraphics.map(enrichGraphicWithTorob),
        );
        return { data };
      },
      providesTags: ["graphic"],
    }),
    getGraphic: builder.query<IResult<Graphic>, { id: string }>({
      queryFn: async ({ id }) => {
        const graphic = getGraphic(id);
        if (graphic) {
          const data = await enrichGraphicWithTorob(graphic);
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

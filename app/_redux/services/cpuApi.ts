import { api } from "./api";
import { IResult } from "./caseApi";
import { filterCpus, getCpu } from "@/_data/productCatalog";

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
  torobUrl?: string;
};

interface TorobProduct {
  title: string;
  price?: number | null;
  image?: string | null;
  url: string;
}

interface TorobProductResponse {
  success: boolean;
  product?: TorobProduct;
  error?: string;
}

const fetchTorobProduct = async (url: string): Promise<TorobProduct> => {
  const params = new URLSearchParams({ url });
  const response = await fetch(`/api/torob-product?${params}`);
  const result = (await response.json()) as TorobProductResponse;

  if (!response.ok || !result.success || !result.product) {
    throw new Error(result.error ?? "Failed to fetch Torob product");
  }

  return result.product;
};

const enrichCpuWithTorob = async (cpu: CPU): Promise<CPU> => {
  if (!cpu.torobUrl) return cpu;

  try {
    const product = await fetchTorobProduct(cpu.torobUrl);

    return {
      ...cpu,
      price: product.price == null ? cpu.price : String(product.price),
      image: product.image ?? cpu.image,
      links: product.url,
    };
  } catch {
    return cpu;
  }
};

export const cpuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCpus: builder.query<CPU[], { manufacturer?: string[]; search?: string }>(
      {
        queryFn: async ({ manufacturer, search }) => {
          const canonicalCpus = filterCpus({ manufacturer, search });
          const data = await Promise.all(canonicalCpus.map(enrichCpuWithTorob));
          return { data };
        },
        providesTags: ["cpu"],
      },
    ),
    getCpu: builder.query<IResult<CPU>, { id: string }>({
      queryFn: async ({ id }) => {
        const cpu = getCpu(id);

        if (!cpu) {
          return { error: { status: 404, data: "CPU یافت نشد" } };
        }

        const data = await enrichCpuWithTorob(cpu);
        return { data: { message: "CPU یافت شد", data } };
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

import { api } from "./api";
import { IResult } from "./caseApi";

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

interface TorobProduct {
  id?: string;
  title?: string;
  englishTitle?: string | null;
  price?: number | null;
  image?: string | null;
  url?: string | null;
}

interface TorobProductsResponse {
  success: boolean;
  products?: TorobProduct[];
  error?: string;
}

const getNumericId = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const fetchTorobCpus = async (): Promise<CPU[]> => {
  const response = await fetch("/api/test-torob-products", {
    cache: "no-store",
  });
  const result = (await response.json()) as TorobProductsResponse;

  if (!response.ok || !result.success || !Array.isArray(result.products)) {
    throw new Error(result.error ?? "Failed to fetch Torob products");
  }

  return result.products.map((product, index) => ({
    id: getNumericId(product.id ?? `${product.title}-${index}`),
    name: product.title ?? product.englishTitle ?? "پردازنده بدون نام",
    cpu_socket: "نامشخص",
    integrated_graphic: "نامشخص",
    manufacturer: "Intel",
    price: product.price == null ? undefined : String(product.price),
    attributes: product.englishTitle ? [product.englishTitle] : undefined,
    image: product.image ?? "/svg/cpu.svg",
    motherboards: [],
    fans: [],
    graphics: [],
    links: product.url ?? "",
    brand: "Intel",
    rams: [],
  }));
};

const toQueryError = (error: unknown) => ({
  status: "CUSTOM_ERROR" as const,
  error: error instanceof Error ? error.message : "Failed to fetch CPUs",
});

export const cpuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCpus: builder.query<CPU[], { manufacturer?: string[]; search?: string }>(
      {
        queryFn: async ({ manufacturer, search }) => {
          try {
            let data = await fetchTorobCpus();

            if (manufacturer && manufacturer.length > 0) {
              data = data.filter((cpu) =>
                manufacturer.includes(cpu.manufacturer),
              );
            }

            if (search) {
              const normalizedSearch = search.toLowerCase();
              data = data.filter((cpu) =>
                cpu.name.toLowerCase().includes(normalizedSearch),
              );
            }

            return { data };
          } catch (error) {
            return { error: toQueryError(error) };
          }
        },
        providesTags: ["cpu"],
      },
    ),
    getCpu: builder.query<IResult<CPU>, { id: string }>({
      queryFn: async ({ id }) => {
        try {
          const cpus = await fetchTorobCpus();
          const cpu = cpus.find((item) => item.id === Number(id));

          if (!cpu) {
            return { error: { status: 404, data: "CPU یافت نشد" } };
          }

          return { data: { message: "CPU یافت شد", data: cpu } };
        } catch (error) {
          return { error: toQueryError(error) };
        }
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

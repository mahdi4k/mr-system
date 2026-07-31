import { api } from "./api";
import {
  mockApiResponse,
  filterMockProducts,
  mockIResultProduct,
} from "./mockData";

export interface IResult<T> {
  message: string;
  data: T;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: Category;
  user: User;
  image?: string;
  price: string;
  created_at: string;
  status: string;
  city: string;
  ostan: string;
}

export interface Category {
  id: number;
  name: string;
  value: string;
  icon: string;
}

export interface User {
  id: number;
  name?: string;
  username: string;
  phone: string;
  email?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const AdsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdsList: builder.query<ApiResponse, { page?: number }>({
      queryFn: async ({ page }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: mockApiResponse };
      },
      providesTags: ["ads"],
    }),
    getAdsListCategory: builder.query<
      ApiResponse,
      {
        category?: string;
        search?: string;
        price_from?: string;
        price_to?: string;
        sort?: string;
        page?: string;
        ostan?: string;
      }
    >({
      queryFn: async ({
        category,
        search,
        price_from,
        price_to,
        sort,
        page,
        ostan,
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data = filterMockProducts({
          category,
          search,
          price_from,
          price_to,
          page,
          ostan,
        });
        return { data };
      },
      providesTags: ["ads"],
    }),

    approveAdsItem: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "آگهی با موفقیت تأیید شد" } };
      },
      invalidatesTags: ["ads"],
    }),
    rejectAdsItem: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "آگهی رد شد" } };
      },
      invalidatesTags: ["ads"],
    }),
    getAds: builder.query<IResult<Product>, { id: string }>({
      queryFn: async ({ id }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: mockIResultProduct };
      },
      providesTags: ["case"],
    }),
    createCase: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "آگهی با موفقیت ایجاد شد", data: payload } };
      },
      invalidatesTags: ["case"],
    }),
    updateCase: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "آگهی با موفقیت ویرایش شد", data: payload } };
      },
      invalidatesTags: ["case"],
    }),
    addCaseImage: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "تصویر با موفقیت آپلود شد" } };
      },
    }),
    removeAds: builder.mutation({
      queryFn: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { message: "آگهی با موفقیت حذف شد" } };
      },
      invalidatesTags: ["ads"],
    }),
  }),
});

export const {
  useGetAdsListQuery,
  useLazyGetAdsListCategoryQuery,
  useApproveAdsItemMutation: useApproveAdsItem,
  useRejectAdsItemMutation: useRejectAdsItem,
  useRemoveAdsMutation: useRemoveAds,
} = AdsApi;

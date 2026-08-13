import { api } from "./api";
import {
  deleteAd,
  getAdById,
  getAds,
  moderateAd,
} from "../../_features/ads/data";
import { createClient } from "../../_lib/supabase/client";
import type {
  AdsFilters,
  AdsResponse,
  Category,
  Product,
} from "../../_features/ads/types";

export type { Category, Product } from "../../_features/ads/types";

export interface IResult<T> {
  message: string;
  data: T;
}

export type ApiResponse = AdsResponse;

export const AdsApi = api.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getAdsList: builder.query<
      ApiResponse,
      { page?: number; search?: string; status?: AdsFilters["status"] }
    >({
      queryFn: async ({ page, search, status }) => {
        try {
          return {
            data: await getAds(
              { page, search, status },
              createClient(),
              undefined,
              true,
            ),
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "خطا در دریافت آگهی‌ها",
            },
          };
        }
      },
      providesTags: ["ads"],
    }),
    getAdsListCategory: builder.query<ApiResponse, AdsFilters>({
      queryFn: async (filters) => {
        try {
          return { data: await getAds(filters) };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "خطا در دریافت آگهی‌ها",
            },
          };
        }
      },
      providesTags: ["ads"],
    }),

    approveAdsItem: builder.mutation<{ message: string }, { id: string }>({
      queryFn: async ({ id }) => {
        try {
          await moderateAd(id, "published");
          return { data: { message: "آگهی با موفقیت تأیید شد" } };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "تأیید آگهی ناموفق بود",
            },
          };
        }
      },
      invalidatesTags: ["ads"],
    }),
    rejectAdsItem: builder.mutation<{ message: string }, { id: string }>({
      queryFn: async ({ id }) => {
        try {
          await moderateAd(id, "rejected");
          return { data: { message: "آگهی رد شد" } };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error ? error.message : "رد آگهی ناموفق بود",
            },
          };
        }
      },
      invalidatesTags: ["ads"],
    }),
    getAds: builder.query<IResult<Product>, { id: string }>({
      queryFn: async ({ id }) => {
        try {
          const product = await getAdById(id, createClient());
          if (!product) {
            return { error: { status: 404, data: "آگهی یافت نشد" } };
          }
          return { data: { message: "", data: product } };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error ? error.message : "خطا در دریافت آگهی",
            },
          };
        }
      },
      providesTags: ["ads"],
    }),
    removeAds: builder.mutation<{ message: string }, string>({
      queryFn: async (id) => {
        try {
          await deleteAd(id);
          return { data: { message: "آگهی با موفقیت حذف شد" } };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error ? error.message : "حذف آگهی ناموفق بود",
            },
          };
        }
      },
      invalidatesTags: ["ads"],
    }),
  }),
});

export const {
  useGetAdsListQuery,
  useGetAdsListCategoryQuery,
  useLazyGetAdsListCategoryQuery,
  useGetAdsQuery,
  useApproveAdsItemMutation: useApproveAdsItem,
  useRejectAdsItemMutation: useRejectAdsItem,
  useRemoveAdsMutation: useRemoveAds,
} = AdsApi;

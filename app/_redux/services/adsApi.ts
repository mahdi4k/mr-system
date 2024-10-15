import { api } from './api'

export interface IResult<T> {
    message: string;
    data: T
}

export interface Product {
    id: number;
    title: string;
    description: string
    category: Category;
    user: User;
    image?: string
    price: string;
    created_at: string
    status: string;
    city: string;
    ostan: string
}

export interface Category {
    id: number;
    name: string;
    icon: string;
}

export interface User {
    id: number;
    username: string;
    phone: string;
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
            query: ({ page }) => {
                return {
                    url: `/products/admin/ads?${page}`,
                    method: 'GET',
                    params: { page: page }
                }
            },
            providesTags: ['ads']
        }),
        getAdsListCategory: builder.query<ApiResponse, { category?: string, search?: string, price_from?: string, price_to?: string, sort?: string , page?: string }>({
            query: ({ category, search, price_from, price_to, sort, page  }) => {
                return {
                    url: `/products/category`,
                    method: 'GET',
                    params: { category, search, price_from, price_to, sort, page  }
                }
            },
            providesTags: ['ads']
        }),

        approveAdsItem: builder.mutation({
            query: (payload) => ({
                url: `products/${payload.id}/approve`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['ads']
        }),
        rejectAdsItem: builder.mutation({
            query: (payload) => ({
                url: `products/${payload.id}/reject`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['ads']
        }),
        getAds: builder.query<IResult<Product>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/cases/${id}`,
                    method: 'GET',

                }
            },
            providesTags: ['case']
        }),
        createCase: builder.mutation({
            query: (payload) => ({
                url: `/cases`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['case']
        }),
        updateCase: builder.mutation({
            query: (payload) => ({
                url: `cases/${payload.id}/`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['case']
        }),
        addCaseImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/cases/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removeAds: builder.mutation({
            query: (payload) => {
                return {
                    url: `/products/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['ads']
        })
    }),
});

export const { useGetAdsListQuery, useLazyGetAdsListCategoryQuery, useApproveAdsItemMutation: useApproveAdsItem, useRejectAdsItemMutation: useRejectAdsItem, useRemoveAdsMutation: useRemoveAds } = AdsApi;

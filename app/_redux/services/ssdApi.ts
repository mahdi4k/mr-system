import { api } from './api'
import { IResult } from './caseApi';
 

export type SSD = {
    id: number
    name: string
    size: string
    brand?: string
    read: string
    write: string
    age: string
    image: string
    emalls?: string
    torob?: string
    form: 'M.2' | '2.5-inch'
    price?: string
    links: string
};


export const SsdApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getSsds: builder.query<SSD[], { modular?: string[] | never[] }>({
            query: ({ modular }) => {
                return {
                    url: `/ssds`,
                    method: 'GET',
                    params: { modular: modular }
                }
            },
            providesTags: ['ssd']
        }),
        getSsd: builder.query<IResult<SSD>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/ssds/${id}`,
                    method: 'GET',

                }
            },
            providesTags: ['ssd']
        }),
        createSsd: builder.mutation({
            query: (payload) => ({
                url: `/ssds`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['ssd']
        }),
        updateSsd: builder.mutation({
            query: (payload) => ({
                url: `ssds/${payload.id}/`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['ssd']
        }),
        addSsdImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/ssds/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removeSsd: builder.mutation({
            query: (payload) => {
                return {
                    url: `/ssds/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['ssd']
        })
    }),
});

export const { useGetSsdsQuery, useLazyGetSsdsQuery , useLazyGetSsdQuery, useCreateSsdMutation, useAddSsdImageMutation, useRemoveSsdMutation, useUpdateSsdMutation, useGetSsdQuery } = SsdApi;

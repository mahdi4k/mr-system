import { api } from './api'

export type RAM = {
    id: number
    name: string
    frequency:string
    brand?: string
    rgb: boolean
    image: string
    price?: string
    links: string
};


export const RamApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getRams: builder.query<RAM[], { modular?: string[] | never[] }>({
            query: ({ modular }) => {
                return {
                    url: `/rams`,
                    method: 'GET',
                    params: { modular: modular }
                }
            },
            providesTags: ['ram']
        }),
        createRam: builder.mutation({
            query: (payload) => ({
                url: `/rams`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['ram']
        }),
        addRamImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/rams/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removeRam: builder.mutation({
            query: (payload) => {
                return {
                    url: `/rams/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['ram']
        })
    }),
});

export const { useGetRamsQuery, useCreateRamMutation, useAddRamImageMutation, useRemoveRamMutation } = RamApi;

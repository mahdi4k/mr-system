import { api } from './api'
import { IResult } from './caseApi';
import { CPU } from './cpuApi';
import { Motherboard } from './motherboardApi';

export type RAM = {
    id: number
    name: string
    frequency: string
    brand?: string
    rgb: boolean
    image: string
    price?: string
    links: string
    cpus: CPU[]
    motherboards: Motherboard[]
};


export const RamApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getRams: builder.query<RAM[], { search?: string }>({
            query: ({ search }) => {
                return {
                    url: `/rams`,
                    method: 'GET',
                    params: { search: search }
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
        getRam: builder.query<IResult<RAM>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/rams/${id}`,
                    method: 'GET',
                }
            },
            providesTags: ['ram']
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

export const { useGetRamsQuery, useLazyGetRamsQuery, useLazyGetRamQuery, useCreateRamMutation, useAddRamImageMutation, useRemoveRamMutation } = RamApi;

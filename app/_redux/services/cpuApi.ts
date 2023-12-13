import { api } from './api'
import { Motherboard } from './motherboardApi';

export type CPU = {
    id: number;
    name: string;
    cpu_socket: string
    integrated_graphic: string
    manufacturer: string;
    attributes?: string[]
    image: string,
    motherboards: Motherboard[] 
    brand?: string
};


export const cpuApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getCpus: builder.query<CPU[], void>({
            query: () => "/cpus",
            providesTags: ['cpu']
        }),
        createCpus: builder.mutation({
            query: (payload) => ({
                url: `/cpus`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['cpu']
        }),
        addCpuImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/cpus/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removeCpu: builder.mutation({
            query: (payload) => {
                return {
                    url: `/cpus/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['cpu']
        })
    }),
});

export const { useGetCpusQuery, useCreateCpusMutation, useAddCpuImageMutation, useRemoveCpuMutation } = cpuApi;

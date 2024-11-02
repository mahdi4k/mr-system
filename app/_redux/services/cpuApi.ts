import { api } from './api'
import { IResult } from './caseApi';
import { FAN } from './fanApi';
import { Graphic } from './graphicApi';
import { Motherboard } from './motherboardApi';

export type CPU = {
    id: number
    name: string
    cpu_socket: string
    integrated_graphic: string
    manufacturer: string
    price?: string
    attributes?: string[]
    image: string
    motherboards: Motherboard[]
    fans: FAN[]
    graphics: Graphic[]
    links: string
    brand?: string
};


export const cpuApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getCpus: builder.query<CPU[], { manufacturer?: string[] | never[],search?:string }>({
            query: ({ manufacturer ,search}) => {
                return {
                    url: `/cpus`,
                    method: 'GET',
                    params: { manufacturer: manufacturer ,search}
                }
            },

            providesTags: ['cpu']
        }),
        getCpu: builder.query<IResult<CPU>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/cpus/${id}`,
                    method: 'GET',

                }
            },
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

export const { useGetCpusQuery, useLazyGetCpuQuery, useLazyGetCpusQuery, useCreateCpusMutation, useAddCpuImageMutation, useRemoveCpuMutation } = cpuApi;

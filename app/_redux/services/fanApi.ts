import { api } from './api'
import { IResult } from './caseApi';
import { CPU } from './cpuApi';

export type FAN = {
    id: number
    name: string
    fan_noise?: string
    heat_sink_material?: string
    cpu_sockets?: string
    rgb: boolean
    image: string
    price?: string
    links: string
    cpus: CPU[]
    brand?: string
};


export const FanApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getFans: builder.query<FAN[], { search?: string  }>({
            query: ({ search }) => {
                return {
                    url: `/fans`,
                    method: 'GET',
                    params: { search: search }
                }
            },
            providesTags: ['fan']
        }),
        getFan: builder.query<IResult<FAN>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/fans/${id}`,
                    method: 'GET',
                }
            },
            providesTags: ['fan']
        }),
        createFan: builder.mutation({
            query: (payload) => ({
                url: `/fans`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['fan']
        }),
        addFanImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/fans/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removeFan: builder.mutation({
            query: (payload) => {
                return {
                    url: `/fans/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['fan']
        })
    }),
});

export const { useGetFansQuery, useLazyGetFansQuery, useLazyGetFanQuery, useGetFanQuery, useCreateFanMutation, useAddFanImageMutation, useRemoveFanMutation } = FanApi;

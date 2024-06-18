import { api } from './api'

export type FAN = {
    id: number
    name: string
    fan_noise?: string
    heat_sink_material?: string
    cpu_sockets?: string
    rgb:boolean
    image: string
    price?: string
    links: string
    brand?: string
};


export const FanApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getFans: builder.query<FAN[], { modular?: string[] | never[] }>({
            query: ({ modular }) => {
                return {
                    url: `/fans`,
                    method: 'GET',
                    params: { modular: modular }
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

export const { useGetFansQuery, useCreateFanMutation, useAddFanImageMutation, useRemoveFanMutation } = FanApi;

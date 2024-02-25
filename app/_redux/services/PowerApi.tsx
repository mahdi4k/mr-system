import { api } from './api'
import { Graphic } from './graphicApi';

export type POWER = {
    id: number
    name: string
    attributes?: string[]
    image: string
    price?:string
    links:string
    graphics: Graphic[]
    brand?: string
    psu:string
    modular:boolean
};


export const PowerApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getPowers: builder.query<POWER[], void>({
            query: () => "/powers",
            providesTags: ['power']
        }),
        createPower: builder.mutation({
            query: (payload) => ({
                url: `/powers`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['power']
        }),
        addPowerImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/powers/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removePower: builder.mutation({
            query: (payload) => {
                return {
                    url: `/powers/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['power']
        })
    }),
});

export const { useGetPowersQuery, useCreatePowerMutation, useAddPowerImageMutation, useRemovePowerMutation } = PowerApi;

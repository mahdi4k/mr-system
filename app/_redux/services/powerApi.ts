import { api } from './api'
import { IResult } from './caseApi';
import { Graphic } from './graphicApi';

export type POWER = {
    id: number
    name: string
    attributes?: string[]
    image: string
    price?: string
    links: string
    graphics: Graphic[]
    brand?: string
    psu: string
    modular: number
};


export const PowerApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getPowers: builder.query<POWER[], { modular?: string[] | never[] }>({
            query: ({ modular }) => {
                return {
                    url: `/powers`,
                    method: 'GET',
                    params: { modular: modular }
                }
            },
            providesTags: ['power']
        }),
        getPower: builder.query<IResult<POWER>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/powers/${id}`,
                    method: 'GET',
                }
            },
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

export const { useGetPowersQuery, useLazyGetPowersQuery, useLazyGetPowerQuery, useCreatePowerMutation, useAddPowerImageMutation, useRemovePowerMutation } = PowerApi;

import { api } from './api'
import { IResult } from './caseApi';
import { CPU } from './cpuApi';

export type Motherboard = {
    id: number
    name: string
    size: string
    total_slot_ram: number
    brand: string
    price?: string
    cpu_socket?: string
    ddr3?: boolean
    ddr4?: boolean
    ddr5?: boolean
    wifi_support?: boolean
    links: string
    image: string
    cpus: CPU[]
    attributes?: string[]
};

type authTokenDTO = {
    auth: {
        userToken: {
            user: string
        }
    }
}
export const motherboardApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getMotherboards: builder.query<Motherboard[], { manufacturer?: string[] | never[] }>({
            query: ({ manufacturer }) => {
                return {
                    url: `/motherboards`,
                    method: 'GET',
                    params: { manufacturer: manufacturer }
                }
            },
            providesTags: ['motherboards']
        }),
        getMotherboard: builder.query<IResult<Motherboard>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/motherboards/${id}`,
                    method: 'GET',

                }
            },
            providesTags: ['motherboards']
        }),
        createMotherboard: builder.mutation({
            query: (payload) => ({
                url: `/motherboards`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['motherboards']
        }),
        addMotherboardImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/motherboards/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removeMotherboard: builder.mutation({
            query: (payload) => {
                return {
                    url: `/motherboards/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['motherboards']
        })
    }),
});

export const { useGetMotherboardsQuery, useLazyGetMotherboardsQuery, useLazyGetMotherboardQuery, useCreateMotherboardMutation, useAddMotherboardImageMutation, useRemoveMotherboardMutation } = motherboardApi;

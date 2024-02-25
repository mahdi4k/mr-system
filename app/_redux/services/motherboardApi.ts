import { api } from './api'
import { CPU } from './cpuApi';

export type Motherboard = {
    id: number
    name: string
    size: string
    total_slot_ram: number
    brand: string
    price?:string
    links:string
    image:string
    cpus:CPU[]
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
        getMotherboards: builder.query<Motherboard[], void>({
            query: () => "/motherboards",
            providesTags:['motherboards']
        }),
        createMotherboard: builder.mutation({
            query: (payload) => ({
                url: `/motherboards`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags:['motherboards']
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
            invalidatesTags:['motherboards']
        })
    }),
});

export const {useGetMotherboardsQuery, useCreateMotherboardMutation, useAddMotherboardImageMutation,useRemoveMotherboardMutation} = motherboardApi;

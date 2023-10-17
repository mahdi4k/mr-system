import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

type Motherboard = {
    id: number;
    name: string;
    size: string
    total_slot_ram: number;
    brand: string
};

type authTokenDTO = {
    auth: {
        userToken: {
            user: string
        }
    }
}
export const motherboardApi = createApi({
    reducerPath: "motherboardApi",
    refetchOnFocus: true,
    tagTypes:['motherboards'],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api",
        prepareHeaders: (headers, {getState}) => {
            const token = getState() as authTokenDTO
            headers.set('Accept', `application/json`)
            headers.set('Authorization', `Bearer ${token.auth.userToken}`)
            return headers
        },
    }),
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

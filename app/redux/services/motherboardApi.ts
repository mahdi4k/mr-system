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
        }),
        createMotherboard: builder.mutation({
            query: (payload) => ({
                url: `/motherboards`,
                method: 'POST',
                body: payload,
            })
        })
    }),
});

export const {useGetMotherboardsQuery, useCreateMotherboardMutation} = motherboardApi;

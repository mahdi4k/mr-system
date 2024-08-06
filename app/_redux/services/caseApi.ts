import { api } from './api'

export interface IResult<T> {
    message: string;
    data: T
}

export type CASE = {
    id: number
    name: string
    max_total_fan: string
    brand?: string
    form: string
    rgb: boolean
    image: string
    emalls?: string
    torob?: string
    price?: string
    links: string
};


export const CaseApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getCases: builder.query<CASE[], { modular?: string[] | never[] }>({
            query: ({ modular }) => {
                return {
                    url: `/cases`,
                    method: 'GET',
                    params: { modular: modular }
                }
            },
            providesTags: ['case']
        }),
        getCase: builder.query<IResult<CASE>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/cases/${id}`,
                    method: 'GET',

                }
            },
            providesTags: ['case']
        }),
        createCase: builder.mutation({
            query: (payload) => ({
                url: `/cases`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['case']
        }),
        updateCase: builder.mutation({
            query: (payload) => ({
                url: `cases/${payload.id}/`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['case']
        }),
        addCaseImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/cases/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removeCase: builder.mutation({
            query: (payload) => {
                return {
                    url: `/cases/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['case']
        })
    }),
});

export const { useGetCasesQuery, useLazyGetCasesQuery, useLazyGetCaseQuery, useCreateCaseMutation, useAddCaseImageMutation, useRemoveCaseMutation, useUpdateCaseMutation, useGetCaseQuery } = CaseApi;

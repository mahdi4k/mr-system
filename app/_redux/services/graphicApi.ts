import { POWER } from './powerApi';
import { api } from './api'
import { CPU } from './cpuApi';
import { IResult } from './caseApi';

export type Graphic = {
    id: number
    name: string
    manufacturer: string
    attributes?: string[]
    links: string
    type?: string,
    ram?: number,
    image: string
    price?: string
    cpus: CPU[]
    brand?: string
    psu: string
    powers: POWER[]
}


export const graphicApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getGraphics: builder.query<Graphic[], { manufacturer?: string[] | never[] }>({
            query: ({ manufacturer }) => {
                return {
                    url: `/graphics`,
                    method: 'GET',
                    params: { manufacturer: manufacturer }
                }
            },
            providesTags: ['graphic']
        }),
        getGraphic: builder.query<IResult<Graphic>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/graphics/${id}`,
                    method: 'GET',

                }
            },
            providesTags: ['graphic']
        }),
        createGraphic: builder.mutation({
            query: (payload) => ({
                url: `/graphics`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['graphic']
        }),
        addGraphicImage: builder.mutation({
            query: (payload) => {
                return {
                    url: `/graphics/${payload.id}/image`,
                    method: 'POST',
                    body: payload.logo,
                }
            }
        }),
        removeGraphic: builder.mutation({
            query: (payload) => {
                return {
                    url: `/graphics/${payload}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['graphic']
        })
    }),
});

export const { useGetGraphicsQuery, useLazyGetGraphicsQuery, useLazyGetGraphicQuery, useCreateGraphicMutation, useAddGraphicImageMutation, useRemoveGraphicMutation } = graphicApi;

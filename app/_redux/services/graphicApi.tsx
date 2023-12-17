import { api } from './api'
import { CPU } from './cpuApi';

export type Graphic = {
    id: number;
    name: string;
    manufacturer: string;
    attributes?: string[]
    image: string,
    cpus: CPU[] 
    brand?: string,
    psu:string
};


export const graphicApi = api.injectEndpoints({

    endpoints: (builder) => ({
        getGraphics: builder.query<Graphic[], void>({
            query: () => "/graphics",
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

export const { useGetGraphicsQuery, useCreateGraphicMutation, useAddGraphicImageMutation, useRemoveGraphicMutation } = graphicApi;

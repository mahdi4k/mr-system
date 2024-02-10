import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import queryString from 'query-string'

type authTokenDTO = {
    auth: {
        userToken: {
            user: string
        }
    }
}
// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api',
    prepareHeaders: (headers, { getState }) => {
        // By default, if we have a token in the store, let's use that for authenticated requests
        const token = getState() as authTokenDTO
        headers.set('Accept', `application/json`)
        headers.set('Authorization', `Bearer ${token.auth.userToken}`)
        return headers
    },
    paramsSerializer: (params: Record<string, unknown>) =>
        queryString.stringify(params, { arrayFormat: 'bracket' }),
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 })

export const api = createApi({
    /**
     * `reducerPath` is optional and will not be required by most users.
     * This is useful if you have multiple API definitions,
     * e.g. where each has a different domain, with no interaction between endpoints.
     * Otherwise, a single API definition should be used in order to support tag invalidation,
     * among other features
     */
    reducerPath: 'splitApi',
    /**
     * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
     */
    baseQuery: baseQueryWithRetry,
    /**
     * Tag types must be defined in the original API definition
     * for any tags that would be provided by injected endpoints
     */
    tagTypes: ['motherboards', 'cpu','graphic','power'],
    /**
     * This api has endpoints injected in adjacent files,
     * which is why no endpoints are shown below.
     * If you want all endpoints defined in the same file, they could be included here instead
     */
    endpoints: () => ({}),
})

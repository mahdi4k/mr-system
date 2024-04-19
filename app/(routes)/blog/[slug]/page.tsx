import React from 'react'
import ClientPage from './clientPage';
import { postsMO } from '@/_components/articleSection/ArticleSection';


export async function generateMetadata({ params }: { params: { slug: string } }) {
    return {
        title: ` ${params.slug} - کیوی پارت`,
    }
}
async function getData(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/posts?slug=${slug}&_embed`)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

const Page = async ({ params }: { params: { slug: string } }) => {
    const post: postsMO[] = await getData(params.slug)

    return (
        <ClientPage post={post} />
    )
}

export default Page


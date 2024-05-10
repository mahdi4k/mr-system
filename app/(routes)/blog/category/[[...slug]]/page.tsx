import React from 'react'
import { postsMO } from '@/_components/articleSection/ArticleSection';
import PageClient from './page.client';

export type categoriesMO = {
    id: string;
    slug: string;
    name: string
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    return {
        title: `  کیوی پارت - مقالات`,
    }
}
async function getPosts(slug: string, categories: categoriesMO[]) {

    const categoryID = categories.filter(category => category.slug === slug)

    let url = `${process.env.NEXT_PUBLIC_WORDPRESS_API}/posts?_fields=id,content,slug,excerpt,date,title,_links,_embedded&_embed`;
    if (categoryID && categoryID.length > 0) {
        console.log("🚀 ~ getPosts ~ categoryID:", categoryID)
        url += `&categories[]=${categoryID[0].id}`;
    }
    const res = await fetch(url)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
async function getCategories() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/categories?_fields=id,slug,name`)

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch dataa')
    }

    return res.json()
}
const Page = async ({ params }: { params: { slug: string } }) => {

    const categories: categoriesMO[] = await getCategories()
    const posts: postsMO[] = await getPosts(params.slug ? params.slug[0] : '', categories)

    return (
        <PageClient posts={posts} categories={categories} />
    )
}

export default Page


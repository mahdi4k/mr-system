import PageClient from './page.client'
import { postsMO } from '@/_components/articleSection/ArticleSection';

export interface CategoryProdcut {
    id: number;
    value:string
    name: string;
  }
  

export async function generateMetadata({ params }: { params: { slug: string } }) {
    return {
        title: 'آگهی قطعات',
    }
}
async function getData(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

const Page = async ({ params }: { params: { slug: string } }) => {
    const categories: CategoryProdcut[] = await getData(params.slug)

    return (
        <PageClient categories={categories} />
    )
}

export default Page


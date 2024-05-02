import ArticleSectionClient from "./ArticleSection.client"


type featuredmedia ={
    id:number,
    link:string,
    mime_type:string,
}

export type postsMO = {
    title: { rendered: string },
    excerpt:{ rendered: string },
    id: string,
    date:string,
    slug:string,
    content: { rendered: string },
    _embedded: { 'wp:featuredmedia': featuredmedia[] }

}

async function getData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/posts?_fields=id,content,slug,excerpt,date,title,_links,_embedded&_embed`) 
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

const ArticleSection = async () => {
    const posts: postsMO[] = await getData()

    return (
        <ArticleSectionClient posts={posts} />
    )
}

export default ArticleSection
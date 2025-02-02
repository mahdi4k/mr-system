import ArticleSectionClient from "./ArticleSection.client"
import { headers } from "next/headers";


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

    const host = headers().get("host"); // Get current domain
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const url = `${protocol}://${host}/api/articles`; // Construct absolute URL

    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
}

const ArticleSection = async () => {
    const posts: postsMO[] = await getData()

    return (
        <ArticleSectionClient posts={posts} />
    )
}

export default ArticleSection
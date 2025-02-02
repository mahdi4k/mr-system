export const runtime = "edge"; // Use Edge runtime for better speed

export async function GET() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/posts?_fields=id,content,slug,excerpt,date,title,_links,_embedded&_embed`, {
        next: { revalidate: 86000 }, // Cache for 1 hour
    });

    if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}

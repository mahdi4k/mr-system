import { mockBlogPosts } from "@/_redux/services/mockData";

export async function GET() {
  return new Response(JSON.stringify(mockBlogPosts), { status: 200 });
}

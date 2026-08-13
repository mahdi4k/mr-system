import { NextResponse } from "next/server";
import { getPublishedArticles } from "../../_features/articles/data";
import { createClient } from "../../_lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();
  try {
    const articles = await getPublishedArticles(supabase, {
      category: searchParams.get("category") || undefined,
      slug: searchParams.get("slug") || undefined,
      limit: Math.min(Number(searchParams.get("limit")) || 20, 50),
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { message: "دریافت مقالات ناموفق بود." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getAdminForSession } from "../../../_lib/supabase/adminAuth";
import { importCatalogImages } from "../../../_features/productCatalog/imageImport";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const client = await getAdminForSession();
  if (!client) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { limit?: number } = {};
  try {
    body = (await request.json()) as { limit?: number };
  } catch {
    body = {};
  }

  try {
    const result = await importCatalogImages(client, { limit: body.limit });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

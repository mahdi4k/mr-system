import { NextResponse } from "next/server";
import { getAdminForSession } from "../../../_lib/supabase/adminAuth";
import { backfillTorobReferences } from "../../../_features/productCatalog/backfill";

export const dynamic = "force-dynamic";

export async function POST() {
  const client = await getAdminForSession();
  if (!client) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await backfillTorobReferences(client);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

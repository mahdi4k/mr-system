import { NextResponse } from "next/server";
import { createClient } from "../../_lib/supabase/server";
import {
  suggestCandidates,
  reviewCandidate,
} from "../../_features/parseBot/match";
import { CATALOG_PART_TYPES } from "../../_features/productCatalog/types";
import type { CatalogPartType } from "../../types/database.types";

export const dynamic = "force-dynamic";

function invalidJson(): NextResponse {
  return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
}

export async function GET(request: Request) {
  const client = await createClient();
  const url = new URL(request.url);
  const status = (url.searchParams.get("status") ?? "pending") as
    | "pending"
    | "approved"
    | "rejected";
  try {
    const { data, error } = await client
      .from("torob_match_candidates")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return NextResponse.json(data ?? []);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const client = await createClient();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalidJson();
  }
  const { partType, productId, query } = body as {
    partType?: string;
    productId?: number;
    query?: string;
  };
  if (
    !partType ||
    !CATALOG_PART_TYPES.includes(partType as CatalogPartType) ||
    !Number.isInteger(productId) ||
    (productId as number) <= 0
  ) {
    return invalidJson();
  }
  try {
    const count = await suggestCandidates(client, {
      partType: partType as CatalogPartType,
      productId: productId as number,
      searchQuery: query ?? "",
    });
    return NextResponse.json({ count });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const client = await createClient();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalidJson();
  }
  const { candidateId, status } = body as {
    candidateId?: string;
    status?: string;
  };
  if (!candidateId || !["approved", "rejected"].includes(status ?? "")) {
    return invalidJson();
  }
  try {
    await reviewCandidate(
      client,
      candidateId,
      status as "approved" | "rejected",
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

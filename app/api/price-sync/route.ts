import { NextResponse } from "next/server";
import { getAdminForSession } from "../../_lib/supabase/adminAuth";
import {
  claimDueRows,
  refreshClaimedRow,
  type ClaimedRow,
} from "../../_features/priceSync/worker";

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
  const limitCandidates = Math.min(Math.max(body.limit ?? 20, 1), 100);

  try {
    const claimed = await claimDueRows(client, limitCandidates);
    const successes: Array<{
      partType: string;
      productId: number;
      price: number;
    }> = [];
    const failures: Array<{
      partType: string;
      productId: number;
      error: string;
    }> = [];

    for (const row of claimed as ClaimedRow[]) {
      const result = await refreshClaimedRow(client, row);
      if ("price" in result) {
        successes.push({
          partType: result.partType,
          productId: result.productId,
          price: result.price,
        });
      } else {
        failures.push({
          partType: result.partType,
          productId: result.productId,
          error: result.error,
        });
      }
    }

    return NextResponse.json({
      claimed: claimed.length,
      successes,
      failures,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

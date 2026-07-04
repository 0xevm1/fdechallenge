import { createRma, getOrderById } from "@/lib/airtable";
import { errorResponse } from "@/lib/api-error";

export const runtime = "nodejs";

interface RmaRequestBody {
  orderId: string;
  sku: string;
  reason: string;
  comment?: string;
}

function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

/**
 * Generates an RMA number of the form "RMA-#####".
 *
 * The 5 digits are derived from the current timestamp (milliseconds since
 * epoch, mod 100000) with a small random jitter mixed in to reduce collisions
 * for requests landing in the same millisecond — not Math.random-only.
 */
function generateRmaNumber(): string {
  const digits = (Date.now() + Math.floor(Math.random() * 7)) % 100_000;
  return `RMA-${String(digits).padStart(5, "0")}`;
}

function parseBody(raw: unknown): RmaRequestBody | string {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return "Request body must be a JSON object.";
  }
  const body = raw as Record<string, unknown>;

  for (const field of ["orderId", "sku", "reason"] as const) {
    const value = body[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      return `Field "${field}" is required and must be a non-empty string.`;
    }
  }
  if (body.comment !== undefined && typeof body.comment !== "string") {
    return 'Field "comment" must be a string when provided.';
  }

  return {
    orderId: (body.orderId as string).trim(),
    sku: (body.sku as string).trim(),
    reason: (body.reason as string).trim(),
    comment: typeof body.comment === "string" ? body.comment.trim() : undefined,
  };
}

/**
 * POST /api/rmas
 *
 * Body: { orderId, sku, reason, comment? }
 * Creates an RMA record in Airtable and returns { rma } with a generated
 * rmaNumber. 400 on invalid input, 404 if the order does not exist.
 */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const parsed = parseBody(raw);
  if (typeof parsed === "string") {
    return badRequest(parsed);
  }

  try {
    const order = await getOrderById(parsed.orderId);
    if (!order) {
      return Response.json(
        { error: `Order "${parsed.orderId}" not found.` },
        { status: 404 }
      );
    }

    const rma = await createRma({
      rmaNumber: generateRmaNumber(),
      orderId: order.orderId,
      sku: parsed.sku,
      reason: parsed.comment
        ? `${parsed.reason} — ${parsed.comment}`
        : parsed.reason,
      status: "Open",
      createdAt: new Date().toISOString(),
    });

    return Response.json({ rma }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

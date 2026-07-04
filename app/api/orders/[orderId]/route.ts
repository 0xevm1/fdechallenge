import { getOrderById, getOrderItems } from "@/lib/airtable";
import { errorResponse } from "@/lib/api-error";

export const runtime = "nodejs";

/**
 * GET /api/orders/[orderId]
 *
 * Returns { order, items } for a human-readable order id (e.g. NG-1042),
 * or a 404 JSON error if the order does not exist.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return Response.json(
        { error: `Order "${orderId}" not found.` },
        { status: 404 }
      );
    }

    const items = await getOrderItems(order.orderId);
    return Response.json({ order, items });
  } catch (error) {
    return errorResponse(error);
  }
}

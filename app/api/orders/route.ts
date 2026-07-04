import { getOrdersByEmail } from "@/lib/airtable";
import { errorResponse } from "@/lib/api-error";

export const runtime = "nodejs";

/**
 * GET /api/orders?email=jane@example.com
 *
 * Returns { orders: [...] } for the customer, or a 404 JSON error when no
 * orders exist for that email. This doubles as a customer-verification
 * endpoint: 200 means the email is a known customer, 404 means it is not.
 */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email")?.trim();

  if (!email || !email.includes("@")) {
    return Response.json(
      { error: "Query parameter \"email\" is required, e.g. /api/orders?email=jane@example.com." },
      { status: 400 }
    );
  }

  try {
    const orders = await getOrdersByEmail(email);
    if (orders.length === 0) {
      return Response.json(
        { error: `No orders found for "${email}".` },
        { status: 404 }
      );
    }
    return Response.json({ orders });
  } catch (error) {
    return errorResponse(error);
  }
}

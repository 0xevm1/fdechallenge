/**
 * Typed Airtable REST client for the "Nimbus Gear" base.
 *
 * Uses plain `fetch` against https://api.airtable.com/v0 (no airtable npm
 * package) so it runs on the Node runtime on Vercel without extra deps.
 *
 * Required env vars (see .env.example):
 * - AIRTABLE_PAT      Personal Access Token with data.records:read/write on the base
 * - AIRTABLE_BASE_ID  e.g. appXXXXXXXXXXXXXX
 *
 * Expected tables/fields are documented in airtable/schema.md.
 */

const AIRTABLE_API_URL = "https://api.airtable.com/v0";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export interface Customer {
  email: string;
  name: string;
  phone: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

export interface Order {
  /** Human-readable order id, e.g. "NG-1042" */
  orderId: string;
  customerEmail: string;
  /** ISO date string, e.g. "2026-06-14" */
  date: string;
  status: OrderStatus;
  carrier: string;
  trackingNumber: string;
  total: number;
}

export interface OrderItem {
  orderId: string;
  sku: string;
  productName: string;
  qty: number;
  price: number;
  returnable: boolean;
}

export interface Rma {
  /** e.g. "RMA-40213" */
  rmaNumber: string;
  orderId: string;
  sku: string;
  reason: string;
  status: string;
  /** ISO timestamp */
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * Error thrown for any Airtable API failure. The message never contains the
 * PAT (it only ever travels in the Authorization header) and is safe to
 * surface in JSON error responses.
 */
export class AirtableError extends Error {
  constructor(
    message: string,
    /** HTTP status returned by Airtable, or 500 for config/network issues. */
    public readonly status: number = 500
  ) {
    super(message);
    this.name = "AirtableError";
  }
}

// ---------------------------------------------------------------------------
// Low-level fetch helpers
// ---------------------------------------------------------------------------

interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

interface AirtableCreateResponse {
  records: AirtableRecord[];
}

function getConfig(): { pat: string; baseId: string } {
  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!pat || !baseId) {
    throw new AirtableError(
      "Airtable is not configured: set the AIRTABLE_PAT and AIRTABLE_BASE_ID environment variables (see .env.example).",
      500
    );
  }
  return { pat, baseId };
}

async function airtableFetch<T>(
  tableName: string,
  init: { method?: "GET" | "POST"; query?: Record<string, string>; body?: unknown } = {}
): Promise<T> {
  const { pat, baseId } = getConfig();

  const url = new URL(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`);
  for (const [key, value] of Object.entries(init.query ?? {})) {
    url.searchParams.set(key, value);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Bearer ${pat}`,
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new AirtableError("Could not reach the Airtable API.", 502);
  }

  if (!res.ok) {
    // Never echo Airtable's raw error body or the request back to callers —
    // keep the message generic so the PAT and base internals cannot leak.
    throw new AirtableError(
      `Airtable request for table "${tableName}" failed with status ${res.status}.`,
      res.status === 401 || res.status === 403 ? 502 : res.status
    );
  }

  return (await res.json()) as T;
}

/**
 * Escapes a value for interpolation into a filterByFormula string literal.
 * We wrap values in double quotes, so double quotes and backslashes must be
 * escaped to prevent formula injection.
 */
function formulaString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

async function listRecords(
  tableName: string,
  filterByFormula: string,
  maxRecords = 100
): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const query: Record<string, string> = {
      filterByFormula,
      maxRecords: String(maxRecords),
    };
    if (offset) query.offset = offset;

    const page = await airtableFetch<AirtableListResponse>(tableName, { query });
    records.push(...page.records);
    offset = page.offset;
  } while (offset && records.length < maxRecords);

  return records;
}

// ---------------------------------------------------------------------------
// Field mapping (Airtable {records:[{id, fields}]} -> clean domain types)
// ---------------------------------------------------------------------------

function asString(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : Number(value) || 0;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function toOrder(record: AirtableRecord): Order {
  const f = record.fields;
  const status = asString(f.Status);
  return {
    orderId: asString(f.OrderID),
    customerEmail: asString(f.CustomerEmail),
    date: asString(f.Date),
    status: (["Processing", "Shipped", "Delivered"].includes(status)
      ? status
      : "Processing") as OrderStatus,
    carrier: asString(f.Carrier),
    trackingNumber: asString(f.TrackingNumber),
    total: asNumber(f.Total),
  };
}

function toOrderItem(record: AirtableRecord): OrderItem {
  const f = record.fields;
  return {
    orderId: asString(f.OrderID),
    sku: asString(f.SKU),
    productName: asString(f.ProductName),
    qty: asNumber(f.Qty),
    price: asNumber(f.Price),
    returnable: asBoolean(f.Returnable),
  };
}

function toRma(record: AirtableRecord): Rma {
  const f = record.fields;
  return {
    rmaNumber: asString(f.RMANumber),
    orderId: asString(f.OrderID),
    sku: asString(f.SKU),
    reason: asString(f.Reason),
    status: asString(f.Status),
    createdAt: asString(f.CreatedAt),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Looks up a single order by its human-readable id (e.g. "NG-1042"). */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const records = await listRecords(
    "Orders",
    `{OrderID} = ${formulaString(orderId)}`,
    1
  );
  return records.length > 0 ? toOrder(records[0]) : null;
}

/** Lists all orders for a customer email (case-insensitive). */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const records = await listRecords(
    "Orders",
    `LOWER({CustomerEmail}) = ${formulaString(email.trim().toLowerCase())}`
  );
  return records.map(toOrder);
}

/** Lists the line items belonging to an order. */
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const records = await listRecords(
    "OrderItems",
    `{OrderID} = ${formulaString(orderId)}`
  );
  return records.map(toOrderItem);
}

export interface CreateRmaInput {
  rmaNumber: string;
  orderId: string;
  sku: string;
  reason: string;
  status?: string;
  createdAt?: string;
}

/** Creates an RMA record and returns the clean, mapped result. */
export async function createRma(input: CreateRmaInput): Promise<Rma> {
  const response = await airtableFetch<AirtableCreateResponse>("RMAs", {
    method: "POST",
    body: {
      records: [
        {
          fields: {
            RMANumber: input.rmaNumber,
            OrderID: input.orderId,
            SKU: input.sku,
            Reason: input.reason,
            Status: input.status ?? "Open",
            CreatedAt: input.createdAt ?? new Date().toISOString(),
          },
        },
      ],
    },
  });

  const record = response.records[0];
  if (!record) {
    throw new AirtableError("Airtable did not return the created RMA record.", 502);
  }
  return toRma(record);
}

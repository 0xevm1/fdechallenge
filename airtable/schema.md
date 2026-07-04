# Airtable Schema — "Nimbus Gear" Base

The typed client in [`lib/airtable.ts`](../lib/airtable.ts) and the seed script
in [`scripts/seed-airtable.ts`](../scripts/seed-airtable.ts) expect a base with
the four tables below. **Field names must match exactly** (they are referenced
in `filterByFormula` expressions and in record `fields` payloads).

Cross-table references use the plain-text `OrderID` / `CustomerEmail` values
(not Airtable linked-record fields) so that `filterByFormula` lookups stay
simple for both this app and the Cognigy HTTP Request node.

## Tables

### Customers

| Field | Airtable type       | Example                 |
| ----- | ------------------- | ----------------------- |
| Email | Single line text    | `maya.chen@example.com` |
| Name  | Single line text    | `Maya Chen`             |
| Phone | Phone number / text | `+1-415-555-0181`       |

### Orders

| Field          | Airtable type                                            | Example                 |
| -------------- | -------------------------------------------------------- | ----------------------- |
| OrderID        | Single line text                                          | `NG-1042`               |
| CustomerEmail  | Single line text                                          | `maya.chen@example.com` |
| Date           | Date (ISO)                                                | `2026-07-01`            |
| Status         | Single select: `Processing`, `Shipped`, `Delivered`       | `Shipped`               |
| Carrier        | Single line text                                          | `UPS`                   |
| TrackingNumber | Single line text                                          | `1Z999AA10123456784`    |
| Total          | Currency / Number (2 decimals)                            | `524.90`                |

### OrderItems

| Field       | Airtable type                  | Example                  |
| ----------- | ------------------------------ | ------------------------ |
| OrderID     | Single line text               | `NG-1042`                |
| SKU         | Single line text               | `NG-GPS-W2`              |
| ProductName | Single line text               | `TrailSync GPS Watch v2` |
| Qty         | Number (integer)               | `1`                      |
| Price       | Currency / Number (2 decimals) | `379.99`                 |
| Returnable  | Checkbox                       | checked                  |

### RMAs

| Field     | Airtable type                                                | Example                      |
| --------- | ------------------------------------------------------------ | ---------------------------- |
| RMANumber | Single line text                                              | `RMA-40213`                  |
| OrderID   | Single line text                                              | `NG-1042`                    |
| SKU       | Single line text                                              | `NG-GPS-W2`                  |
| Reason    | Long text                                                     | `Defective — screen flicker` |
| Status    | Single select: `Open`, `Approved`, `Received`, `Closed`       | `Open`                       |
| CreatedAt | Date with time (ISO) / text                                   | `2026-07-03T10:15:00.000Z`   |

> The seed script sends `typecast: true`, so single-select options
> (`Status`) are created automatically on first insert if they don't exist.

## PAT (Personal Access Token) scoping

Create a token at <https://airtable.com/create/tokens>:

1. **Scopes:** add `data.records:read` and `data.records:write`. Nothing else
   is needed — do **not** grant `schema.bases:write` or workspace-level scopes.
2. **Access:** grant access to **only this base** ("Nimbus Gear"), not "all
   current and future bases".
3. Copy the token (`pat...`) into `AIRTABLE_PAT`; the base id (`app...`, from
   the base URL or <https://airtable.com/api>) goes into `AIRTABLE_BASE_ID`.
   See `.env.example`.

## Calling from Cognigy (HTTP Request node)

Two options — either works; the proxy keeps the PAT out of Cognigy entirely.

### Option A — Airtable directly

Cognigy's built-in ApiKey auth types don't emit a `Bearer` prefix, so set the
header manually on the HTTP Request node:

- **URL:**
  `https://api.airtable.com/v0/{baseId}/Orders?filterByFormula={OrderID}='{{context.order_id}}'`
  (URL-encode the formula; same pattern for `OrderItems` with `{OrderID}` or
  `Orders` with `{CustomerEmail}`)
- **Headers:** `{ "Authorization": "Bearer patXXXX..." }`
- **Response:** Airtable returns `{ "records": [ { "id", "createdTime",
  "fields": {...} } ] }` — store it in a Context key and flatten
  `records[].fields` with a Code node before the Resolve Tool Action.
- To create an RMA: `POST https://api.airtable.com/v0/{baseId}/RMAs` with body
  `{ "records": [ { "fields": { "RMANumber": "...", "OrderID": "...", "SKU":
  "...", "Reason": "...", "Status": "Open", "CreatedAt": "..." } } ] }`.

### Option B — this app's `/api` proxy (deployed on Vercel)

No auth header needed in Cognigy; the PAT lives only in Vercel env vars and
responses are already flattened into clean JSON:

| Purpose                       | Request                                                             | Success | Not found |
| ----------------------------- | ------------------------------------------------------------------- | ------- | --------- |
| Order status + line items     | `GET https://<app>.vercel.app/api/orders/NG-1042`                   | `200 { order, items }` | `404` |
| Orders by customer / verify a customer | `GET https://<app>.vercel.app/api/orders?email=maya.chen@example.com` | `200 { orders }` | `404` |
| Create an RMA                 | `POST https://<app>.vercel.app/api/rmas` with JSON body `{ "orderId", "sku", "reason", "comment"? }` | `201 { rma }` | `400`/`404` |

All error responses are JSON of the shape `{ "error": "..." }` and never
contain the PAT.

## Seeding

```bash
npm run seed          # or: npx tsx scripts/seed-airtable.ts
```

The tables must already exist with the fields above. The script **appends**
records (5 customers, 8 orders, 22 order items) and is not idempotent —
delete existing rows before re-running.

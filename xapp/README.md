# Nimbus Gear RMA xApp

`rma-form.html` is the source of truth for the return form shown during the
`start_return` tool flow (PLAN.md §2.3). It renders inside the Webchat v3
overlay, lists the customer's order items from Flow context, and sends the
selection back to the Flow via the Cognigy xApp SDK.

## Pasting into the Flow

1. In the Flow's `start_return` tool branch, make sure `context.products` is
   set before the xApp nodes (HTTP GET order line items, shaped to
   `[{ id, sku, name, price, qty, date }, ...]`).
2. Add **xApp: Init Session** (set brand colors/logo there), then
   **xApp: Show HTML** (node reference: [Set HTML xApp State](https://docs.cognigy.com/ai/agents/develop/node-reference/xApp/set-html-xApp-state)).
3. On the **xApp: Show HTML** node:
   - **Content mode: HTML document** — paste the entire contents of
     `rma-form.html` (it is a complete document; all CSS is inline and the
     SDK is loaded via the relative path `/sdk/app-page-sdk.js`, which
     Cognigy auto-hosts next to the xApp page).
   - **Waiting Behavior: on** — the Flow pauses until the user submits.
   - **Overlay Auto Open: on** — the form opens inline inside the Webchat v3
     overlay (supported since Webchat v4.75).
4. The `{{JSON.stringify(cc.products)}}` expression in the HTML is
   CognigyScript — Cognigy resolves it server-side when serving the page, so
   the form receives the real products from context.

## What comes back to the Flow

Submitting calls `SDK.submit(payload)`, which resumes the Flow. The next node
after **xApp: Show HTML** can read the payload at:

```
input.data._cognigy._app.payload
```

Payload shape:

```json
{
  "productId": "itm_002",
  "sku": "NG-HDL-3302",
  "name": "Cirrus 400 Headlamp",
  "reason": "Defective",
  "comment": "Stopped charging after two days."
}
```

`reason` is one of: `Defective`, `Wrong item`, `No longer needed`, `Other`.
`comment` may be an empty string. Use these fields for the HTTP POST that
creates the RMA record in Airtable, then return the RMA number via
**Resolve Tool Action**.

## Local preview

Run `npm run dev` and open [http://localhost:3000/xapp-preview](http://localhost:3000/xapp-preview).
The route renders this exact HTML in a 360px sandboxed iframe with mock
products and a stubbed SDK that displays the submitted payload on screen —
no Cognigy session needed. If the form is opened outside Cognigy without the
stub, `SDK` is undefined and the payload is logged to the console instead.

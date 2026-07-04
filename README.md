# Nimbus Gear — Cognigy FDE Challenge Demo

Demo app for the Cognigy FDE candidate challenge: a branded storefront with an
embedded Cognigy Webchat v3 agent, the RMA xApp form, an Airtable-backed order
API, and the FAQ knowledge source. See [PLAN.md](PLAN.md) for the full
implementation plan and [DEMO-SCRIPT.md](DEMO-SCRIPT.md) for the presentation
script.

Built with [Next.js](https://nextjs.org) 16 (TypeScript, App Router, Tailwind)
on the [Bun](https://bun.sh) runtime.

## Getting Started

```bash
bun install
bun run dev        # dev server via `bun --bun next dev`
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and
[http://localhost:3000/xapp-preview](http://localhost:3000/xapp-preview) for
the RMA xApp preview.

Other scripts:

```bash
bun run build      # production build
bun run start      # serve the production build
bun run lint       # eslint
bun run seed       # seed the Airtable base (needs env vars)
```

## Environment

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_COGNIGY_WEBCHAT_CONFIG_URL` — Cognigy Webchat v3 endpoint config URL
- `AIRTABLE_PAT` / `AIRTABLE_BASE_ID` — for the order/RMA API routes and seed script

## Project layout

- `app/` — storefront, `/xapp-preview`, API routes (`/api/orders`, `/api/rmas`)
- `components/CognigyWebchat.tsx` — Webchat v3 embed
- `xapp/rma-form.html` — source of truth for the Cognigy "xApp: Show HTML" node
- `knowledge/faqs.ctxt` — Knowledge AI FAQ source (CTXT)
- `airtable/schema.md` — Airtable base schema + Cognigy call patterns
- `scripts/seed-airtable.ts` — seed data (run with Bun)

## Deploy on Vercel

Import the repo in Vercel (Bun is auto-detected via `bun.lock`), set the three
env vars above, and deploy. The production URL is the CX demo surface; the
`/api/*` routes double as the third-party proxy for Cognigy's HTTP Request
node.

/**
 * Seeds the "Nimbus Gear" Airtable base with demo data via the REST API.
 *
 * Usage:
 *   npx tsx scripts/seed-airtable.ts
 *
 * Requires AIRTABLE_PAT and AIRTABLE_BASE_ID in the environment (the script
 * also reads .env.local / .env from the project root if present).
 *
 * PREREQUISITE: the tables must already exist in the base with the exact
 * field names documented in airtable/schema.md — Customers, Orders,
 * OrderItems, RMAs. This script only creates records; it does not create
 * tables or fields.
 *
 * IDEMPOTENCY WARNING: this script APPENDS records every time it runs. It
 * does not check for or delete existing rows — running it twice creates
 * duplicates. To re-seed cleanly, delete the records in Airtable first.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// --- minimal .env loader (no dotenv dependency) ----------------------------

for (const file of [".env.local", ".env"]) {
  try {
    const contents = readFileSync(resolve(process.cwd(), file), "utf8");
    for (const line of contents.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // file not present — fine
  }
}

const PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!PAT || !BASE_ID) {
  console.error(
    "Missing AIRTABLE_PAT and/or AIRTABLE_BASE_ID. Set them in the environment or in .env.local."
  );
  process.exit(1);
}

// --- seed data --------------------------------------------------------------

const customers = [
  { Email: "maya.chen@example.com", Name: "Maya Chen", Phone: "+1-415-555-0181" },
  { Email: "diego.ramirez@example.com", Name: "Diego Ramirez", Phone: "+1-303-555-0144" },
  { Email: "priya.patel@example.com", Name: "Priya Patel", Phone: "+1-206-555-0192" },
  { Email: "liam.osullivan@example.com", Name: "Liam O'Sullivan", Phone: "+1-617-555-0137" },
  { Email: "sofia.novak@example.com", Name: "Sofia Novak", Phone: "+1-512-555-0169" },
];

const orders = [
  { OrderID: "NG-1001", CustomerEmail: "maya.chen@example.com", Date: "2026-05-28", Status: "Delivered", Carrier: "UPS", TrackingNumber: "1Z999AA10123456784", Total: 289.80 },
  { OrderID: "NG-1007", CustomerEmail: "diego.ramirez@example.com", Date: "2026-06-02", Status: "Delivered", Carrier: "FedEx", TrackingNumber: "771234567890", Total: 449.98 },
  { OrderID: "NG-1013", CustomerEmail: "priya.patel@example.com", Date: "2026-06-08", Status: "Delivered", Carrier: "USPS", TrackingNumber: "9400111899560001234567", Total: 154.90 },
  { OrderID: "NG-1018", CustomerEmail: "maya.chen@example.com", Date: "2026-06-12", Status: "Shipped", Carrier: "UPS", TrackingNumber: "1Z999AA10198765432", Total: 612.47 },
  { OrderID: "NG-1024", CustomerEmail: "liam.osullivan@example.com", Date: "2026-06-17", Status: "Shipped", Carrier: "DHL", TrackingNumber: "JD014600003828552861", Total: 199.99 },
  { OrderID: "NG-1029", CustomerEmail: "sofia.novak@example.com", Date: "2026-06-22", Status: "Shipped", Carrier: "FedEx", TrackingNumber: "779876543210", Total: 87.93 },
  { OrderID: "NG-1036", CustomerEmail: "diego.ramirez@example.com", Date: "2026-06-27", Status: "Processing", Carrier: "", TrackingNumber: "", Total: 329.95 },
  { OrderID: "NG-1042", CustomerEmail: "priya.patel@example.com", Date: "2026-07-01", Status: "Processing", Carrier: "", TrackingNumber: "", Total: 524.90 },
];

const orderItems = [
  // NG-1001 — Maya
  { OrderID: "NG-1001", SKU: "NG-HL-300", ProductName: "Summit 300 Rechargeable Headlamp", Qty: 1, Price: 49.95, Returnable: true },
  { OrderID: "NG-1001", SKU: "NG-TP-CARB", ProductName: "Carbon Trek Pro Trekking Poles (Pair)", Qty: 1, Price: 139.95, Returnable: true },
  { OrderID: "NG-1001", SKU: "NG-BT-750", ProductName: "ThermaFlask 750ml Insulated Bottle", Qty: 2, Price: 49.95, Returnable: true },
  // NG-1007 — Diego
  { OrderID: "NG-1007", SKU: "NG-GPS-W2", ProductName: "TrailSync GPS Watch v2", Qty: 1, Price: 379.99, Returnable: true },
  { OrderID: "NG-1007", SKU: "NG-SC-21W", ProductName: "SolarFlow 21W Folding Charger", Qty: 1, Price: 69.99, Returnable: true },
  // NG-1013 — Priya
  { OrderID: "NG-1013", SKU: "NG-HL-100", ProductName: "Ridge 100 Compact Headlamp", Qty: 1, Price: 24.95, Returnable: true },
  { OrderID: "NG-1013", SKU: "NG-DR-BAG", ProductName: "DryVault 20L Dry Bag", Qty: 1, Price: 34.95, Returnable: true },
  { OrderID: "NG-1013", SKU: "NG-FA-KIT", ProductName: "TrailMed First Aid Kit", Qty: 1, Price: 45.00, Returnable: false },
  { OrderID: "NG-1013", SKU: "NG-EW-SET", ProductName: "CampFeast Titanium Utensil Set", Qty: 2, Price: 25.00, Returnable: true },
  // NG-1018 — Maya
  { OrderID: "NG-1018", SKU: "NG-TT-2P", ProductName: "AlpineShelter 2-Person Tent", Qty: 1, Price: 449.00, Returnable: true },
  { OrderID: "NG-1018", SKU: "NG-SP-UL", ProductName: "FeatherRest Ultralight Sleeping Pad", Qty: 1, Price: 129.50, Returnable: true },
  { OrderID: "NG-1018", SKU: "NG-ST-MINI", ProductName: "PocketFlame Mini Stove", Qty: 1, Price: 33.97, Returnable: true },
  // NG-1024 — Liam
  { OrderID: "NG-1024", SKU: "NG-BP-45L", ProductName: "Cascade 45L Trekking Backpack", Qty: 1, Price: 199.99, Returnable: true },
  // NG-1029 — Sofia
  { OrderID: "NG-1029", SKU: "NG-SC-10K", ProductName: "VoltTrail 10K Power Bank", Qty: 1, Price: 39.99, Returnable: true },
  { OrderID: "NG-1029", SKU: "NG-LT-STR", ProductName: "CampGlow LED String Lights", Qty: 1, Price: 22.95, Returnable: true },
  { OrderID: "NG-1029", SKU: "NG-CP-EN", ProductName: "EnduraFuel Energy Gel 12-Pack", Qty: 1, Price: 24.99, Returnable: false },
  // NG-1036 — Diego
  { OrderID: "NG-1036", SKU: "NG-BN-10X", ProductName: "PeakView 10x42 Binoculars", Qty: 1, Price: 249.95, Returnable: true },
  { OrderID: "NG-1036", SKU: "NG-HL-300", ProductName: "Summit 300 Rechargeable Headlamp", Qty: 1, Price: 49.95, Returnable: true },
  { OrderID: "NG-1036", SKU: "NG-GL-WPF", ProductName: "StormGrip Waterproof Gloves", Qty: 1, Price: 30.05, Returnable: true },
  // NG-1042 — Priya
  { OrderID: "NG-1042", SKU: "NG-GPS-W2", ProductName: "TrailSync GPS Watch v2", Qty: 1, Price: 379.99, Returnable: true },
  { OrderID: "NG-1042", SKU: "NG-SC-21W", ProductName: "SolarFlow 21W Folding Charger", Qty: 1, Price: 69.99, Returnable: true },
  { OrderID: "NG-1042", SKU: "NG-TP-ALU", ProductName: "AluTrek Adjustable Trekking Poles (Pair)", Qty: 1, Price: 74.92, Returnable: true },
];

// --- REST helpers -----------------------------------------------------------

async function createRecords(
  tableName: string,
  fieldsList: Record<string, unknown>[]
): Promise<number> {
  let created = 0;
  // Airtable allows at most 10 records per create request.
  for (let i = 0; i < fieldsList.length; i += 10) {
    const chunk = fieldsList.slice(i, i + 10);
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: chunk.map((fields) => ({ fields })),
          typecast: true,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Failed to create records in "${tableName}" (HTTP ${res.status}): ${text}`
      );
    }

    const json = (await res.json()) as { records: unknown[] };
    created += json.records.length;
  }
  return created;
}

// --- main -------------------------------------------------------------------

async function main() {
  console.warn(
    "NOTE: this script appends records — running it more than once creates duplicates.\n"
  );

  console.log(`Seeding Airtable base ${BASE_ID} ...`);
  console.log(`  Customers:  ${await createRecords("Customers", customers)} created`);
  console.log(`  Orders:     ${await createRecords("Orders", orders)} created`);
  console.log(`  OrderItems: ${await createRecords("OrderItems", orderItems)} created`);
  console.log("Done. (RMAs table is left empty — records are created by the app.)");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

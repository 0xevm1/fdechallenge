import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "xApp Preview — RMA Return Form",
  description:
    "Local preview of xapp/rma-form.html with mock products and a stubbed Cognigy SDK.",
};

/** Mock stand-in for the Flow's `cc.products` (context.products). */
const MOCK_PRODUCTS = [
  {
    id: "itm_001",
    sku: "NG-TRK-9001",
    name: "Stratus Trekking Poles (Pair)",
    price: 89.0,
    qty: 1,
    date: "2026-06-24",
  },
  {
    id: "itm_002",
    sku: "NG-HDL-3302",
    name: "Cirrus 400 Headlamp",
    price: 54.5,
    qty: 2,
    date: "2026-06-24",
  },
  {
    id: "itm_003",
    sku: "NG-JKT-7210",
    name: "Altocumulus Rain Shell — M",
    price: 189.95,
    qty: 1,
    date: "2026-06-24",
  },
];

/**
 * Replaces the real Cognigy SDK (<script src="/sdk/app-page-sdk.js">) in
 * preview: SDK.submit(payload) renders the payload in an overlay inside the
 * iframe instead of sending it back to the Flow.
 */
const SDK_STUB = `<script>
  window.SDK = {
    submit: function (payload) {
      console.log("[xapp-preview] SDK.submit called with:", payload);
      var overlay = document.createElement("div");
      overlay.style.cssText =
        "position:fixed;inset:0;background:rgba(34,48,63,.55);" +
        "display:flex;align-items:center;justify-content:center;padding:20px;z-index:1000;";
      var panel = document.createElement("div");
      panel.style.cssText =
        "background:#fff;border-radius:12px;padding:18px;max-width:340px;width:100%;" +
        "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;";
      var title = document.createElement("div");
      title.textContent = "SDK.submit(payload) — sent back to the Flow:";
      title.style.cssText =
        "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
        "font-weight:700;font-size:13px;margin-bottom:10px;color:#22303f;";
      var pre = document.createElement("pre");
      pre.textContent = JSON.stringify(payload, null, 2);
      pre.style.cssText =
        "background:#eef2f6;border-radius:8px;padding:12px;overflow-x:auto;" +
        "white-space:pre-wrap;word-break:break-word;color:#22303f;margin:0;";
      var close = document.createElement("button");
      close.textContent = "Close";
      close.style.cssText =
        "margin-top:12px;width:100%;padding:9px;border:none;border-radius:8px;" +
        "background:#2d5f8f;color:#fff;font-weight:700;cursor:pointer;font-size:13px;";
      close.addEventListener("click", function () { overlay.remove(); });
      panel.appendChild(title);
      panel.appendChild(pre);
      panel.appendChild(close);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);
    },
  };
</` + `script>`;

export default function XappPreviewPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "xapp", "rma-form.html"),
    "utf8",
  );

  // 1. Resolve the CognigyScript expression the way the Flow would,
  //    but with mock data. 2. Swap the Cognigy-hosted SDK for a local stub.
  const html = raw
    .replace("{{JSON.stringify(cc.products)}}", JSON.stringify(MOCK_PRODUCTS))
    .replace('<script src="/sdk/app-page-sdk.js"></script>', SDK_STUB);

  return (
    <div className="flex flex-1 flex-col items-center gap-6 bg-zinc-100 px-4 py-10 dark:bg-zinc-900">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          xApp preview: RMA return form
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          This is a local preview of{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            xapp/rma-form.html
          </code>{" "}
          (the source of truth pasted into the Cognigy &ldquo;xApp: Show
          HTML&rdquo; node). The CognigyScript expression{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            {"{{JSON.stringify(cc.products)}}"}
          </code>{" "}
          is replaced with mock products and the Cognigy SDK is stubbed, so
          submitting shows the payload on screen instead of resuming a Flow.
        </p>
      </div>
      <iframe
        srcDoc={html}
        sandbox="allow-scripts"
        title="RMA return form preview (xapp/rma-form.html)"
        className="h-[680px] w-[360px] rounded-2xl border border-zinc-300 bg-white shadow-lg dark:border-zinc-700"
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Rendered at 360px wide in a sandboxed iframe, matching the Webchat v3
        overlay.
      </p>
    </div>
  );
}

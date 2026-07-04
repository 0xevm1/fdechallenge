import CognigyWebchat from "@/components/CognigyWebchat";

const products = [
  {
    sku: "NG-0117",
    name: "Ridgeline Headlamp 450",
    spec: "450 lm · IPX7 · 62 g",
    price: "$54",
    emoji: "🔦",
    tile: "bg-glacier",
  },
  {
    sku: "NG-0342",
    name: "Cirrus 38 Pack",
    spec: "38 L · 1.1 kg · roll-top",
    price: "$189",
    emoji: "🎒",
    tile: "bg-mist",
  },
  {
    sku: "NG-0503",
    name: "StratoBeacon Mini",
    spec: "GPS + satellite SOS",
    price: "$249",
    emoji: "📡",
    tile: "bg-mist",
    badge: "New",
  },
  {
    sku: "NG-0288",
    name: "Solstice 20 Panel",
    spec: "20 W solar · USB-C PD",
    price: "$89",
    emoji: "🔋",
    tile: "bg-glacier",
  },
  {
    sku: "NG-0611",
    name: "Alto Trail Watch",
    spec: "Baro-altimeter · 21-day battery",
    price: "$199",
    emoji: "⌚",
    tile: "bg-glacier",
  },
  {
    sku: "NG-0450",
    name: "Basecamp 2P Tent",
    spec: "2-person · 3-season · 1.9 kg",
    price: "$329",
    emoji: "⛺",
    tile: "bg-mist",
  },
];

const promises = [
  { label: "Free shipping", detail: "on orders over $75" },
  { label: "30-day returns", detail: "trail-tested or not" },
  { label: "2-year warranty", detail: "on all electronics" },
  { label: "Live order help", detail: "chat, bottom right" },
];

function NimbusMark({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 21L10.5 8.5L15 15.5L18.5 10.5L23 21H3Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M7.5 6.5a3.5 3.5 0 016.7-1.4 3 3 0 013.3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function TopoLines() {
  return (
    <svg
      viewBox="0 0 900 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-pine"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.16">
        <path d="M-20 340 C120 300 180 360 320 330 S560 250 700 290 880 360 940 330" />
        <path d="M-20 300 C110 255 200 320 330 285 S550 200 690 245 870 320 940 285" />
        <path d="M-20 258 C100 210 215 280 340 240 S545 152 685 200 860 278 940 240" />
        <path d="M-20 214 C95 168 225 238 350 196 S540 106 680 156 850 236 940 196" />
        <path d="M60 170 C160 130 260 196 366 156 S535 66 672 114 840 194 940 152" />
        <path d="M170 128 C255 96 300 152 388 118 S528 30 664 74 828 152 940 110" />
        <path d="M290 88 C350 66 380 108 430 84 S520 4 656 38 816 112 940 70" />
      </g>
      <g fill="currentColor" opacity="0.35">
        <circle cx="640" cy="120" r="3" />
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-mist bg-fog/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="#top"
            className="flex items-center gap-2 text-pine-deep focus-visible:outline-2 focus-visible:outline-pine"
          >
            <NimbusMark />
            <span className="font-display text-lg font-bold tracking-tight text-spruce">
              Nimbus Gear
            </span>
          </a>
          <nav
            aria-label="Main"
            className="hidden items-center gap-7 text-sm font-medium text-spruce/80 sm:flex"
          >
            <a href="#shop" className="transition-colors hover:text-pine">
              Shop
            </a>
            <a href="#promises" className="transition-colors hover:text-pine">
              Why Nimbus
            </a>
            <a href="#support" className="transition-colors hover:text-pine">
              Support
            </a>
          </nav>
          <button
            type="button"
            className="relative flex items-center gap-2 rounded-full border border-spruce/15 bg-white px-4 py-2 text-sm font-medium text-spruce transition-colors hover:border-pine hover:text-pine focus-visible:outline-2 focus-visible:outline-pine"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 5h10l-1 8H4L3 5Zm2.5 0a2.5 2.5 0 015 0"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Cart
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-semibold text-white">
              2
            </span>
          </button>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-mist bg-glacier/60">
          <TopoLines />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-pine">
              Spring expedition drop · 2026
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-spruce sm:text-6xl">
              Gear for the weather you didn’t plan for.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-spruce/75">
              Packs, lights, and navigation electronics, trail-tested in the
              Cascades. Free shipping over $75 and 30-day returns on
              everything we make.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#shop"
                className="inline-flex h-12 items-center justify-center rounded-full bg-pine px-7 text-sm font-semibold text-white transition-colors hover:bg-pine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
              >
                Shop the collection
              </a>
              <a
                href="#support"
                className="inline-flex h-12 items-center justify-center rounded-full border border-spruce/20 bg-white/80 px-7 text-sm font-semibold text-spruce transition-colors hover:border-pine hover:text-pine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
              >
                Track an order
              </a>
            </div>
          </div>
        </section>

        {/* Promises strip */}
        <section
          id="promises"
          aria-label="Store promises"
          className="border-b border-mist bg-white"
        >
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-4 px-4 py-6 sm:px-6 lg:grid-cols-4">
            {promises.map((p) => (
              <div key={p.label} className="flex flex-col">
                <span className="text-sm font-semibold text-spruce">
                  {p.label}
                </span>
                <span className="text-sm text-spruce/60">{p.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Product grid */}
        <section id="shop" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-spruce">
                Trail essentials
              </h2>
              <p className="mt-2 text-spruce/70">
                Six pieces our field team refuses to hike without.
              </p>
            </div>
            <span className="hidden font-mono text-xs uppercase tracking-widest text-spruce/50 sm:block">
              06 items
            </span>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li
                key={product.sku}
                className="group flex flex-col overflow-hidden rounded-2xl border border-mist bg-white transition-shadow hover:shadow-lg hover:shadow-spruce/10"
              >
                <div
                  className={`relative flex h-44 items-center justify-center ${product.tile}`}
                >
                  <span
                    role="img"
                    aria-hidden="true"
                    className="text-6xl transition-transform duration-300 group-hover:scale-110"
                  >
                    {product.emoji}
                  </span>
                  {product.badge ? (
                    <span className="absolute left-3 top-3 rounded-full bg-signal px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-white">
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-spruce/45">
                    {product.sku}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-spruce">
                    {product.name}
                  </h3>
                  <p className="text-sm text-spruce/60">{product.spec}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-base font-semibold text-spruce">
                      {product.price}
                    </span>
                    <button
                      type="button"
                      className="rounded-full border border-pine/30 px-4 py-1.5 text-sm font-medium text-pine transition-colors hover:bg-pine hover:text-white focus-visible:outline-2 focus-visible:outline-pine"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Support band */}
        <section id="support" className="bg-pine-deep">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                Where’s my order?
              </h2>
              <p className="mt-3 leading-7 text-white/75">
                Ask the Nimbus assistant. Check an order, start a return, or
                get product advice around the clock — in English o en español.
              </p>
            </div>
            <p className="flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white/90">
              <span
                aria-hidden="true"
                className="flex h-2.5 w-2.5 rounded-full bg-signal"
              />
              Open the chat bubble, bottom right
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-spruce text-white/70">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-glacier">
              <NimbusMark />
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Nimbus Gear
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6">
              Outdoor equipment and backcountry electronics, designed in
              Bend, Oregon and tested above the treeline.
            </p>
          </div>
          {[
            {
              heading: "Shop",
              links: ["Packs", "Lighting", "Navigation", "Shelter"],
            },
            {
              heading: "Support",
              links: ["Order status", "Returns & RMA", "Warranty", "Contact"],
            },
            {
              heading: "Company",
              links: ["Our story", "Field team", "Sustainability", "Careers"],
            },
          ].map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-white/50">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto w-full max-w-6xl px-4 py-5 text-xs text-white/40 sm:px-6">
            © 2026 Nimbus Gear. A fictional retailer built to demo a
            Cognigy.AI customer-experience agent.
          </p>
        </div>
      </footer>

      <CognigyWebchat />
    </div>
  );
}

# Nimbus Gear FAQ Knowledge Source

`faqs.ctxt` is the FAQ knowledge source for the Skye AI Agent, written in Cognigy's [CTXT format](https://docs.cognigy.com/ai/empower/knowledge-ai/knowledge-source/text-formats/ctxt/): backtick-wrapped header metadata (`version`, `title`, `url`, `tags`), then one chunk per FAQ separated by a blank line. Each chunk is the question on the first line, the answer below, and a backtick-wrapped `url:` metadata line pointing at the (fictional) help-center article. 14 chunks, all well under the 2,000-character chunk limit.

## Uploading to Cognigy

1. In your Cognigy.AI project, go to **Build > Knowledge**.
2. Click **Create Knowledge Store** (e.g. name it `Nimbus Gear FAQs`).
   - You will be asked to pick an **embedding model**. This choice is **PERMANENT for the entire project** — it cannot be changed later, and it applies to all Knowledge Stores in the project. Pick deliberately (the default OpenAI embedding model is fine for this demo). Make sure an embedding model is configured under **Manage > LLMs** first.
3. Inside the store, add a **Knowledge Source** and choose the **Cognigy CTXT** file type.
4. Upload `faqs.ctxt`. Cognigy parses it into one Knowledge Chunk per FAQ; verify in the source view that 14 chunks were created and that each chunk shows its `url` metadata.

## Attaching to the AI Agent

The store is consumed via a **Knowledge Tool** child node on the AI Agent node (the recommended pattern since 2025.23):

1. Under the AI Agent node, add a child node of type **Knowledge Tool**.
2. Select the `Nimbus Gear FAQs` Knowledge Store.
3. Give it a name like `faq` and a description the LLM can route on, e.g. *"Use for questions about Nimbus Gear policies: shipping, returns, warranty, payments, sizing, gift cards, promo codes, sustainability, and support hours."*
4. Set **Top K = 3** — the three most relevant chunks are retrieved and passed to the LLM as grounding for the answer.

## Cross-lingual answers

The source is written in English only, but answers work cross-lingually: retrieval is embedding-based and the LLM generates the reply in the user's language. If a user asks *"¿Cuál es su política de devoluciones?"*, the agent retrieves the English return-policy chunk and answers in Spanish. No translated copy of the file is needed for the live language-switch part of the demo.

## Consistency notes

Policy details in the FAQs are the canonical demo facts — keep other assets (persona instructions, demo script, Airtable seed data) consistent with them:

- Free standard shipping over **$75**; standard 3-5 business days ($5.95), express 1-2 days ($14.95)
- **30-day** return window; defective items get a **prepaid return label**; refunds in 5-7 business days
- Returns require an **RMA number**, issued in chat (matches the `start_return` xApp flow)
- **2-year** limited warranty
- Order numbers look like **NG-1042**
- Support hours **Mon-Fri 9:00-18:00 CET**

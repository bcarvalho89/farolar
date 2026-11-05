# Spec: FaroLar, an AI-powered real estate search

**Status:** not started. **Schedule:** first week of Nov 9 to 15 (data, deduplication, API, filter search), second week of Nov 16 to 22 (AI, evals, polish).

**If the schedule slips, cut in this order:** Storybook; list/map toggle; property page map; synthetic geography (falling back to descriptions only); conversational refinement; the local versus API model comparison; evals from about 100 to about 50 searches. Deduplication, explained search, and the virtualized list are not cut.

## Goal

Build a real estate search where people write what they want the way they would tell someone. The system understands the request, explains each result, and shows when the same property appears at more than one agency, with its price difference and history.

Example: "casa com quintal para cachorro, perto de escola, até R$ 600 mil" (a house with a yard for a dog, near a school, up to R$ 600k).

The first version is a public demo with **fictional data, clearly labeled as such**.

## Positioning

A "Google for real estate" with regular filters and an AI search assistant **on the buyer's side**. Each agency shows its own listings, and the product brings them together, compares them, and says what has not been confirmed.

Do not call it a "broker" or "digital broker" in the product. Real estate brokerage is a regulated profession in Brazil, and agencies may see that name as a threat.

**The assistant does not:**
- Negotiate, intermediate a sale, or charge a commission.
- Say something is a "good deal" or recommend buying.
- Give legal or financial advice.
- Invent an attribute that is not in the listing.

## What I want to learn and practice

- Integrating an LLM into a real product, with cost, limits, and failures under control.
- Measuring AI quality with evals instead of eyeballing it.
- Hybrid search: structured filters combined with semantic search, using pgvector.
- Postgres modeling: price history and deduplication.
- Running local models on CPU and comparing them honestly with an API model.
- Front-end performance: virtualized lists, filters in the URL, caching, and SSR.
- Explaining architecture decisions in interviews.

## What makes it different

1. **Same property, many listings:** group duplicates and show price differences and history.
2. **Explained results:** each attribute is shown as "matches", "likely", or "unconfirmed".
3. **Public quality numbers:** evals with accuracy, cost, and response time in the README.

## First version scope

**Data**
- Generator using faker-js with a fixed seed, in Brazilian Portuguese.
- Fictional neighborhoods and addresses, with a visible notice in the demo.
- Pick attributes first, such as type, bedrooms, area, price, and yard, then generate the description from them. Lorem ipsum cannot test semantic search.
- Create duplicates on purpose, varying the fictional agency, price, and text.
- Create price histories with drops and increases.
- Save the ground truth: which listings are the same property and which attributes each one has.
- Start with about 5,000 listings for about 3,500 properties, with about 30% of properties at more than one agency. These are configurable starting values, not measurements.
- Descriptions come from a single AI run on Gemini 3.5 Flash Lite, in batches with structured output keyed by listing id, saved as versioned JSONL. The generator tells the model which attributes it may mention and omits some on purpose, to test "unconfirmed". A validator rejects any description citing other attributes, and those are regenerated. A trial with 40 listings comes first, and the full run only starts after reviewing the sample and the rejection rate.

**Synthetic geography and map**

"Near a school" should be checkable, not only claimed by the listing.

- A fictional city with valid coordinates in the middle of the ocean, so no point lands on a real home: neighborhoods, streets, and points of interest (school, park, market, and hospital), drawn from the same seed and served as static GeoJSON, with no tile server.
- The distance to the nearest point of each kind is computed at load time, without PostGIS.
- Each listing's location has up to 150 m of noise, and about 15% have none. The true position stays in the ground truth. A property's location is the center of its listings' locations, shown as an "approximate location" circle.
- "Near" means up to 1 km in a straight line, and the screen always shows the distance and says it is a straight line.
- Labels: "matches" if the distance plus the 150 m margin fits in 1 km; "likely" if only the distance fits, or if there is no location and the description claims it; "unconfirmed" if there is no location and no claim.
- When the description claims proximity and the distance contradicts it, show both.
- MapLibre with our own style and GeoJSON. The map loads only when opened, and the list remains the main, accessible way to browse.
- Property page: the map shows the location and nearby points. Search: a list/map toggle with clustered points, without hover sync with the list and without "search this area".

**Search: one pipeline, two ways to fill it**

Regular filters and the assistant feed the same search. The AI is an optional layer, and the user always sees what it did.

1. The AI splits the request into hard filters and soft preferences:
   ```json
   {
     "filters": { "type": "house", "maxPrice": 600000 },
     "nearby": ["school"],
     "preferences": ["yard for a dog"]
   }
   ```
   `nearby` is an enum of `school`, `park`, `market`, and `hospital`, and is reflected in the UI and the URL (`?near=school`).
2. The output is validated by the same Zod schema the filters use, in `packages/shared`. Gemini silently ignores some JSON Schema keywords, so the response always goes through Zod. Invalid output is never applied, and the AI never generates SQL.
3. Filters appear filled in on the screen and in the URL, as if the user had clicked them. The user can change any of them, and the link can be shared.
4. Postgres applies the filters as hard rules.
5. Preferences and proximity only reorder results, and never remove a property. The proximity and semantic rankings are combined with Reciprocal Rank Fusion.
6. Each result explains why it appears, using "matches", "likely", and "unconfirmed". These labels are computed deterministically, without an LLM: "matches" from a confirmed structured field or computed distance, "likely" from high similarity with a description passage, "unconfirmed" when there is no evidence. The evals calibrate the "likely" threshold.

Results are properties, not listings. A property appears if at least one of its listings passes the filters, showing the lowest price and highlighting the difference. Groups are computed in batch at load time.

Sale listings only. Filters: type (house, apartment, land), price range, bedrooms, area, neighborhood, and features such as yard, pool, and parking.

Lists sorted by a stable field such as price use keyset pagination. With ranking by preferences, the search computes the top 500 (a starting value, not measured), the list pages within that set, and the screen says the list is limited.

Also in scope:
- Conversational refinement: "now only with 3 bedrooms". The front end sends the current filters with the new text, with no session on the server, and the model returns the full updated search, validated by the same Zod schema. Each refinement counts toward the daily cap.
- Virtualized list and property page with SSR.

Deduplication, price differences, and history do not depend on AI, so the main differentiator survives without the assistant.

**Deduplication**
- Group listings of the same property using attributes and text similarity.
- Show agencies, lowest and highest price, and history.
- Three outcomes: same property (grouped); lookalikes that are different (kept apart, such as identical units in one condominium); not enough evidence (not grouped, shown as "possibly the same property", with no price difference).
- Text similarity uses `pg_trgm`, not embeddings, so this works without AI. Location is only a weak signal.
- A listing joins a group only if it is compatible with all members, which prevents A~B~C from joining A and C.
- Listings from the same agency are never duplicates.
- Identical price, bedrooms, and area can replace text similarity, except within the same condominium or building, where the pair needs evidence that distinguishes the units.
- A land plot is confirmed only with the same area and evidence that identifies the lot, such as block and lot or an address number.
- The algorithm never reads the ground truth.

The generator must produce the cases that test these rules: chains of lookalikes; identical lots from one agency; shared condominium boilerplate; copied and original agency text; differing attributes such as suites for the same house; land area only in the text; identical units; and vague land plots with the same area. Lessons come from an earlier private prototype, but no thresholds, code, or real data are copied from it.

**Safeguards**
- Per-IP limit and a daily cap below the provider's quota: 400 calls per day and 12 per minute, counting retries and refinements, resetting at midnight Pacific like the provider's quota. These values live in configuration.
- Cache for repeated searches.
- Kill switch for the AI.
- Read-only API.

**Personal data and access**

The assistant field is free text, so a person can type personal data into it. Protection is best effort, and the README states this limit:
- A length limit, masking of CPF, phone, and email before sending, a notice next to the field, and no logging of the raw text.

The Gemini terms require a paid service for users in the EEA, Switzerland, and the UK, and restrict use to adults:
- The assistant runs live everywhere except those regions. There, filters and about 5 example searches served from cache remain available, with no Gemini call, plus a notice about the restriction.
- An 18+ notice sits next to the field.
- The country comes from `x-vercel-ip-country`, which is only trustworthy through Vercel.

**Request path**

The browser never calls the VPS. Every request goes through a Next route handler on Vercel, which sends a shared secret and the user's real IP. The API rejects any request without the secret on every route, and only trusts the forwarded IP when the secret is valid. The VPS address is still reachable on the internet, so the secret is the control.

**When the AI fails**

| Situation | Behavior |
|---|---|
| Quota exhausted or API down | The assistant field stays visible but disabled, with a short notice to use the filters |
| Request too slow | Cancel after a few seconds and suggest the filters |
| Invalid response | Retry once, then tell the user |
| Unclear request | Apply what was understood and show what was not |
| Repeated search | Serve from cache without using quota |

If a local embedding model works on the VPS, semantic search continues even with Gemini down. If it does not, use Postgres text search instead.

**Evals**
- About 100 searches with expected results.
- Metrics for filter accuracy, relevance, latency, and cost.
- Precision and recall metrics for deduplication.
- Evals and the demo share one Gemini project and its quota, so eval runs respect the daily cap. A run of 100 searches uses 20% of the daily quota and takes at least 7 minutes.
- CI validates against recorded responses, spending no quota. Real runs are manual and recorded in the README with date and model. `temperature` is deprecated, so real runs repeat to report variation.
- Deduplication precision and recall measure the algorithm against our generator, not the market, and the README says so.

## Out of scope for the first version

- Real data and scraping.
- Login, favorites, and alerts.
- Real basemaps, street routing, and "search this area".
- Monetization.

## Next steps, in order

**Assistant, right after the first version:**
1. Follow-up questions: "is it to live in or invest?" and "what is the real limit, including costs?".
2. Comparison: "compare these two properties", using only available data.
3. Visit preparation: what to confirm and what to ask, such as why the price dropped.
4. A real agent that chooses among tools such as search, compare, and price history, with evals.

**Phase 2:** MCP server; embeddable widget with a TypeScript SDK; OAuth for partners.

## Architecture

- **Front end:** Next.js on Vercel, with a few components documented in Storybook, and MapLibre for the map.
- **API:** Node and TypeScript, with Fastify, on the VPS.
- **Database:** Postgres with pgvector, on the VPS, in its own container. Plain SQL with the `pg` driver and numbered `.sql` migrations, with no ORM, because Postgres modeling is a learning goal.
- **Cache and counters:** Redis, on the VPS, in its own container with no published port. It holds assistant responses for 7 days, keyed by a hash of the normalized, masked text plus the model name and prompt version, and the daily cap and per-IP counters. Limits: 128 MB as a starting value, `volatile-lru`, a TTL on every key, and AOF written every second so a restart does not reset the counter. A test fills the cache and checks that the counter survives, and if it does not, the cache and counter move to separate instances. If Redis is down, the assistant is disabled and filters keep working. The example searches for restricted regions live in a versioned file, not in Redis.
- **Proxy:** Caddy.
- **Real-time AI:** Gemini 3.5 Flash Lite on the free tier to understand the search.
- **Embeddings:** the same model for descriptions (batch) and for each search's short query (online), chosen by measuring on the VPS. Candidates: `paraphrase-multilingual-MiniLM-L12-v2`, `multilingual-e5-small`, and Gemini Embedding 2 as the API comparison. Pass criteria, proposed before measuring: memory within the container limit, p95 below 300 ms per query, and relevance on a small set of Portuguese searches compared with Postgres text search. Time-boxed to half a day before falling back to Postgres text search.
- **Data sources:** the generator writes JSONL validated by Zod, and a loader reads it. A future source only has to produce the same file.
- **CI:** GitHub Actions runs Biome for lint and formatting, type checks, Vitest tests on Postgres with pgvector, and evals with recorded responses.
- **API deployment:** after CI passes on `main`, Actions builds an ARM image, pushes it to GHCR, and connects over SSH with a dedicated deploy user whose key can only run the deploy script. The script pulls the image, runs migrations, starts the new version, checks `/health`, and rolls back if that fails. Migrations must stay compatible with the previous API version, since a rollback does not undo them.
- **Front end deployment:** Vercel, with `apps/web` as the root directory. The Gemini key stays on the VPS, and Vercel only holds the API address and the shared secret. The two deployments are independent, so API changes stay compatible with the front end already live: add fields before using them, and never remove one in the same deployment.
- **License:** MIT.

**Resources:** the VPS is shared with other services, so containers need CPU and memory limits.

## Repository structure

**Monorepo with pnpm workspaces.** The front end and API share the filter schemas, and the data generator and evals use the same types. Phase 2 SDK, widget, and MCP server can become new packages without reorganizing anything.

```text
apps/web                 Next.js, deployed to Vercel from this folder
apps/api                 Node API, deployed to the VPS
packages/shared          Schemas and shared types
packages/data-generator  Seeded fictional data and ground truth
packages/evals           Search and deduplication evals
```

Start without Turborepo or Nx. Add Turborepo only if CI gets slow, and record the reason in `docs/decisions.md`.

## What I write by hand

- Data model and main queries.
- Deduplication.
- The flow that turns text into validated filters.
- Caching and the virtualized list.
- One accessible component.
- Evals and main tests.

Claude can speed up scaffolding, configuration, and repetitive tasks, and reviews everything.

## Language

Docs, code, comments, and commits are in English. The product UI and the fictional data are in Brazilian Portuguese, because that is the audience.

## Definition of done

- [ ] Public demo running with labeled fictional data.
- [ ] Natural language search with explained results.
- [ ] Duplicates grouped, with price differences and history.
- [ ] The demo stays usable without AI.
- [ ] Reproducible evals, with results in the README.
- [ ] Main tests and CI on GitHub Actions.
- [ ] README covering decisions and limitations.
- [ ] Video of up to 2 minutes.

## Risks

| Risk | Mitigation |
|---|---|
| Gemini quota changes or runs out | Own cap, cache, and fallback to regular filters |
| Local model too slow on the VPS | Measure against the pass criteria first, and fall back to Postgres text search |
| VPS disk nearly full | Expand the boot volume before starting |
| Data feels too artificial | Vary the text and state this limitation publicly |
| Scope creep | Respect the out-of-scope list |
| Assistant states something unsupported | Validate against listing data, show "unconfirmed", and cover it in evals |

## Open questions

- Which embedding model wins on relevance? Both local candidates passed memory and latency on the VPS ([measurements](measurements.md)). Relevance against Postgres text search, and the comparison with Gemini Embedding 2, wait for the generator's descriptions.

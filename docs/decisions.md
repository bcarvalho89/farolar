# Decisions

Each entry records what was decided and why.

## 2026-11-05: first session

- **Zod in `packages/shared` as the single source of schemas.** The UI, the API, and the AI output must share one schema, and Zod 4 exports JSON Schema for Gemini. Gemini silently ignores some keywords, so Zod also validates every response.
- **Fastify for the API.** The API is one long-running Node process with no edge deployment, which removes Hono's main advantage. Fastify includes request logs and `trustProxy`, and has an official rate limit plugin.
- **Results are grouped properties, computed in batch.** This keeps the search query simple and the list easy to page.
- **The generator degrades data on purpose.** With identical addresses, deduplication would be a `GROUP BY` and its published metrics would mean nothing.
- **Three deduplication outcomes, including "possibly the same property".** A wrong group shows a false price difference, which is worse than a missed duplicate.
- **Stricter rules for identical units and land plots.** An exact price signal would join identical condominium units, and a land rule that accepts matching area plus similar text would merge different plots. Both count as false positives here.
- **`pg_trgm` for deduplication text similarity.** The main differentiator must work without AI.
- **Embeddings run online for queries as well as in batch.** A user's preferences must become a vector at search time with the same model as the descriptions, which contradicted the earlier "only in batch" risk note.
- **Embedding pass criteria set before measuring.** This stops the result from being fitted afterward.
- **Deterministic "matches", "likely", and "unconfirmed" labels.** An LLM per result would burn the quota and could invent attributes, and this keeps explanations working without Gemini.
- **Gemini 3.5 Flash Lite as the only real-time model, with no fallback.** On Nov 5, 2026, AI Studio showed 15 RPM, 250K TPM, and 500 RPD for it, against 5 RPM and 20 RPD for 3.8 Flash. When quota runs out, the filters already cover the demo.
- **Daily cap of 400 and 12 per minute, resetting at midnight Pacific.** The cap stays below the provider's quota and resets when that quota does.
- **Evals share the demo's Gemini project, with recorded responses in CI.** A second project just for extra quota could conflict with the terms, which were not checked on this point.
- **Personal data protection is best effort.** No filter can guarantee that free text has no personal data, so the rule became a length limit, masking, a notice, and no raw logs, with the limit stated in the README.
- **The assistant is off in the EEA, Switzerland, and the UK, with cached examples instead.** The Gemini terms require paid services there, and a notice alone does not meet that. Recruiters abroad can still see full results without a Gemini call.
- **Synthetic geography in the ocean instead of a real city.** Distances can be checked rather than only claimed, and a fictional listing never lands on a real home.
- **MapLibre instead of Mapbox.** Over the ocean, Mapbox's basemap would only show water, since the whole city comes from our GeoJSON. MapLibre needs no token, account, or billing.
- **Flat `nearby` enum in the AI output.** Gemini's docs warn that `anyOf` and enums add schema complexity and can lead to a 400 error, so a union type is avoided.
- **Reciprocal Rank Fusion to combine rankings.** It uses only positions, so meters and similarity need no calibrated weights, and it still works if Postgres text search replaces embeddings.
- **Cut order fixed in the spec.** Two weeks is tight for this scope with so much written by hand.
- **Name: FaroLar.** Chosen by the owner. A web search found no real estate company with this name, but the INPI trademark registry was not checked. It joins *faro* (the search) and *lar* (home), and sounds like *farol* (lighthouse), which fits a product that guides without deciding for the buyer. The project needs no domain of its own for now.
- **Brand notes in `docs/design.md`, with the visual identity left for later.** The voice rules follow from the spec's limits on the assistant and can already guide UI copy, while logo and colors can wait until the UI work starts.
- **All traffic goes through Next route handlers, with a shared secret on every API route.** This keeps abuse away from the API, makes the forwarded IP and country trustworthy, and removes the need for CORS.
- **Redis for the cache and daily counter.** Postgres would have been enough, but learning Redis is a goal for this project, and that justifies the extra container.
- **Plain SQL and numbered migrations, with no ORM.** An ORM would hide the Postgres modeling this project is meant to practice.
- **JSONL instead of a provider interface.** An interface with one implementation adds nothing, and the file format is already the point where another source can plug in.
- **MIT license.** It is short and instantly recognized on a public portfolio project.
- **API deploys from CI over restricted SSH, not a webhook.** A webhook would add a public endpoint and authentication code to maintain, while a key limited to the deploy script reuses SSH with no new port, and failures show up in GitHub.
- **Assistant fails closed when Redis is down.** Without the counters, neither the daily cap nor the per-IP limit can be guaranteed, and filters keep the demo usable.
- **AOF persistence for Redis.** A restart that reset the counter could let through up to another day of quota.
- **Assistant cache lasts 7 days, and example searches live in a versioned file.** The demo data rarely changes, and the examples must keep working for restricted regions even with Redis down.
- **Independent front end and API deployments, with backward-compatible API changes.** Coordinating them through the Vercel CLI in Actions would be too much for a one-developer project.
- **Stateless conversational refinement.** State stays in the URL, so shared links keep working and the server stores no conversation, which also limits exposure of personal data.
- **Sale listings only.** Rentals would double the price and history cases without strengthening any differentiator.
- **Biome for lint and formatting.** One fast tool with little configuration, instead of ESLint plus Prettier.
- **Keyset pagination, with a capped candidate set for ranked searches.** `OFFSET` gets slower the deeper it goes, while ranking by RRF computes positions per search, so it pages within a fixed top set.

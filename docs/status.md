# Status

## Done

- Repository created, with the spec and the pnpm workspace root.
- First session: most open questions answered and recorded in [decisions.md](decisions.md), and the spec updated.
- VPS disk expanded to 100 GB.
- Local embedding models measured on the VPS for memory and latency.
- Brand notes for FaroLar written in [design.md](design.md), and the README updated.
- Task 1: pnpm workspace with the 5 packages, TypeScript, Vitest, and Biome. `pnpm lint`, `pnpm typecheck`, and `pnpm test` pass. `apps/web` is an empty package until task 14 runs the Next setup.
- Task 2: `compose.yaml` with Postgres 18 and pgvector, and Redis 8 with 128 MB, `volatile-lru`, and AOF every second. Both have CPU and memory limits. Checked locally: `vector` and `pg_trgm` install, and a Redis key survives a restart.

## Waiting on

- **Embedding relevance:** both local models passed memory and latency on the VPS ([measurements](measurements.md)). Relevance waits for the generator's descriptions.

## Next step

Tasks 3 (first CI) and 4 (Zod schemas, Bruno) can start, since they depend only on task 1.

## First stage: Nov 9 to 15

"Bruno" means written by hand, with Claude reviewing. "Claude" means Claude can speed it up.

| # | Task | Who | Depends on |
|---|---|---|---|
| 1 | Monorepo structure: the 5 packages, TypeScript, Vitest, and Biome | Claude | — |
| 2 | Local Docker Compose: Postgres with pgvector and Redis, with limits | Claude | 1 |
| 3 | First CI: lint, type checks, and tests | Claude | 1 |
| 4 | Zod schemas: property, listing, price history, ground truth, and filters | Bruno | 1 |
| 5 | SQL migrations: data model and price history | Bruno | 4 |
| 6 | Generator: fictional city, points of interest, attributes, and prices | Claude | 4 |
| 7 | Generator: duplicates and the hard deduplication cases from the spec | Claude, Bruno reviews the cases | 6 |
| 8 | Descriptions: 40-listing trial, Bruno's approval, then the full run | Claude, with Bruno's approval | 7, a Gemini key |
| 9 | JSONL loader into Postgres, computing distances | Claude | 5, 8 |
| 10 | Deduplication and rule tests | Bruno | 9 |
| 11 | Deduplication eval: precision and recall | Bruno | 10 |
| 12 | Fastify API: shared secret, `trustProxy`, `/health`, and routes | Claude | 1 |
| 13 | Search queries with filters and keyset pagination, and the property page with history | Bruno | 10, 12 |
| 14 | Next: search page with filters in the URL, and the property page with SSR | Claude | 12 |
| 15 | Virtualized list | Bruno | 13, 14 |
| 16 | Deployment: Compose on the VPS, Caddy, deploy user, and Vercel | Claude, Bruno creates the key | 3, 12 |

All of Bruno's tasks are on the critical path, and deduplication (10) is the largest. If the week gets tight, the virtualized list (15) moves to the start of week 2 without blocking the AI work.

The visual identity is defined in [design.md](design.md): palette, typography, icons, map style, result labels, and tagline. The logo mark is still open.

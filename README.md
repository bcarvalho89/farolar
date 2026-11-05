# FaroLar

Work in progress. A real estate search on the buyer's side: people describe what they want in their own words, each result explains why it appears, and the same property listed by several agencies is grouped with its price differences and history.

The name joins *faro* (a nose for finding things) and *lar* (home), and sounds like *farol* (lighthouse). See the [brand notes](docs/design.md).

The demo will use fictional data only, clearly labeled as such. See the [spec](docs/spec.md).

## Stack

Next.js on Vercel, a Fastify API on a shared VPS, Postgres with pgvector, Redis, and Gemini on the free tier. All of it runs at zero cost.

## Local development

Requires Node 26 (see `.nvmrc`; with [fnm](https://github.com/Schniz/fnm), run `fnm use`), pnpm, and Docker.

```sh
pnpm install
docker compose up -d --wait   # Postgres with pgvector, and Redis, on 127.0.0.1
pnpm lint && pnpm typecheck && pnpm test
```

## Docs

- [Spec](docs/spec.md): scope, architecture, and what is out of scope.
- [Status](docs/status.md): what is done and the next step.
- [Decisions](docs/decisions.md): what was decided, and why.
- [Measurements](docs/measurements.md): every published number, with how it was measured.

## License

[MIT](LICENSE)

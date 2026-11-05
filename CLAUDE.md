# CLAUDE.md

The spec is [docs/spec.md](docs/spec.md). Read it and [docs/status.md](docs/status.md) at the start of each session.

## How we work

- The parts listed under "What I write by hand" in the spec are written by me. Claude explains, asks questions, points out mistakes, and reviews, but does not hand over the finished solution unless I ask.
- Claude can speed up scaffolding, configuration, and repetitive tasks.
- Record each important decision in `docs/decisions.md`, with the reason.
- Keep `docs/status.md` up to date: what is done and the next step.
- When a decision changes the plan, update `docs/spec.md`.

## Rules

- Docs, code, comments, and commits are in English. The product UI and the fictional data are in Brazilian Portuguese.
- This repository is public: no private content and no real personal data.
- Zero cost: Gemini free tier and the shared Oracle VPS, with CPU and memory limits on every container.
- Never send personal data to the Gemini free tier, which uses content to improve its products.
- Only publish numbers that were measured, and explain how.
- Do not add Turborepo or Nx until CI is actually slow.

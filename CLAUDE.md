# CLAUDE.md

The spec is [docs/spec.md](docs/spec.md). At the start of each session, read it, [docs/status.md](docs/status.md), and [docs/decisions.md](docs/decisions.md), so settled decisions are not reopened. Read [docs/design.md](docs/design.md) before writing any UI copy.

## How we work

- The parts listed under "What I write by hand" in the spec are written by me. For these, Claude acts as a mentor: it explains, asks questions, points out mistakes, and reviews, but does not hand over the finished solution unless I ask. It also points to documentation or tutorials that cover the topic, preferring official docs, and only links pages it has confirmed exist.
- Claude explains each technical term, acronym, or library in plain words the first time it comes up, tied to what it does in this project.
- Claude can speed up scaffolding, configuration, and repetitive tasks.
- Record each important decision in `docs/decisions.md`, with the reason.
- Keep `docs/status.md` up to date: what is done and the next step.
- When a decision changes the plan, update `docs/spec.md`.

## Rules

- Docs, code, comments, and commits are in English. The product UI and the fictional data are in Brazilian Portuguese.
- This repository is public: no private content and no real personal data.
- Zero cost: Gemini free tier and the shared Oracle VPS, with CPU and memory limits on every container.
- The VPS is shared with other services: ask before running benchmarks or starting containers there.
- Do not send personal data to the Gemini free tier, which uses content to improve its products. Mask what can be detected, as the spec describes, and state the limit in the README.
- Only publish numbers that were measured, and explain how. They live in [docs/measurements.md](docs/measurements.md).
- Do not add Turborepo or Nx until CI is actually slow.

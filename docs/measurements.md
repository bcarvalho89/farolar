# Measurements

Every number published about this project comes from here, with how it was measured.

## Local embedding models on the VPS, 2026-11-05

**Setup:** Oracle VPS, ARM64 Neoverse-N1 with 2 cores and 11.6 GiB of RAM, shared with other services. Each model ran in a throwaway `node:22-bookworm-slim` container limited to 1 CPU and 1.5 GB (`--cpus=1 --memory=1536m`). It used Node 22.23.4, `@huggingface/transformers` 3.8.1, int8 quantized weights (`q8`), mean pooling, and normalized vectors. Script: [scripts/embedding-bench](../scripts/embedding-bench).

**Method:**
- 5 warmup queries, then 300 timed queries cycling through 30 short Portuguese preferences.
- 5,000 synthetic descriptions of 50 to 60 words, built from template phrases, in batches of 32.
- `multilingual-e5-small` used its `query: ` and `passage: ` prefixes.
- The models ran one after the other.

| Model | Dims | Peak RSS | Query p50 | Query p95 | 5,000 descriptions |
|---|---|---|---|---|---|
| `Xenova/paraphrase-multilingual-MiniLM-L12-v2` | 384 | 566 MB | 4.9 ms | 55.6 ms | 168.5 s (29.7/s) |
| `Xenova/multilingual-e5-small` | 384 | 556 MB | 5.9 ms | 56.7 ms | 175.6 s (28.5/s) |

**Machine load:** load average was 0.06 before the session. During the runs, the 1-minute load average went up to about 2.6, mostly from the benchmark itself, with no cron from other projects running.

**Pass criteria:** both pass two of the three criteria set in the spec before measuring: memory within the container limit, and p95 below 300 ms. Relevance compared with Postgres text search has not been measured yet, because it needs the generator's descriptions.

**Limits of this measurement:**
- The latency gap between p50 and p95 probably comes from the CPU quota throttling the runtime's threads, not from the model. This is not verified.
- The template descriptions repeat phrases, so their token lengths vary less than real text would.
- Load time includes the first model download, so it is not reported as a startup cost.
- Gemini Embedding 2 is not included, because no API key is on the VPS yet.

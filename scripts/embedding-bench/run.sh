#!/bin/sh
set -u
cd /tmp/farolar-bench
printf '{"type":"module","private":true}\n' > package.json
docker run --rm -v /tmp/farolar-bench:/app -w /app node:22-bookworm-slim \
  sh -c 'npm install --silent --no-audit --no-fund @huggingface/transformers@3 >/dev/null 2>&1; node -p "require(\"./node_modules/@huggingface/transformers/package.json\").version"'

for m in "Xenova/paraphrase-multilingual-MiniLM-L12-v2 plain" "Xenova/multilingual-e5-small e5"; do
  set -- $m
  echo "== $1 load_before=$(cut -d' ' -f1-3 /proc/loadavg)"
  docker run --rm --cpus=1 --memory=1536m --memory-swap=1536m \
    -v /tmp/farolar-bench:/app -w /app -e HF_HOME=/app/.cache \
    node:22-bookworm-slim node bench.mjs "$1" "$2" 2>&1 | tail -3
  echo "load_after=$(cut -d' ' -f1-3 /proc/loadavg)"
done

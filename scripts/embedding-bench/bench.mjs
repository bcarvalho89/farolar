import { pipeline } from '@huggingface/transformers';
import os from 'node:os';

const [model, mode] = process.argv.slice(2);
const queryPrefix = mode === 'e5' ? 'query: ' : '';
const passagePrefix = mode === 'e5' ? 'passage: ' : '';
const BATCH = 32;
const TOTAL_DESCRIPTIONS = 5000;

const queries = [
  'quintal para cachorro', 'perto de escola', 'casa térrea com garagem para dois carros',
  'apartamento com varanda gourmet', 'rua tranquila', 'área de lazer com piscina',
  'próximo a hospital', 'cozinha ampla e iluminada', 'condomínio fechado com segurança',
  'terreno plano para construir', 'sol da manhã', 'perto de mercado e padaria',
  'espaço para home office', 'suíte com closet', 'vista para o parque',
  'aceita pet', 'imóvel reformado', 'churrasqueira no quintal', 'bairro arborizado',
  'pronto para morar', 'dois banheiros', 'perto do metrô', 'jardim de inverno',
  'piso de madeira', 'lavanderia separada', 'edícula nos fundos', 'portaria 24 horas',
  'casa com três quartos e quintal grande', 'apartamento pequeno barato', 'silencioso e ventilado',
];

const parts = [
  ['Casa térrea', 'Sobrado', 'Apartamento', 'Casa em condomínio', 'Cobertura'],
  ['com três dormitórios, sendo uma suíte,', 'com dois quartos amplos', 'com quatro dormitórios e duas suítes', 'com um quarto e sala integrada'],
  ['sala para dois ambientes, cozinha planejada e lavanderia.', 'cozinha americana, área de serviço e banheiro social reformado.', 'sala de estar com pé-direito alto e lavabo.'],
  ['Quintal gramado com churrasqueira e espaço para animais.', 'Varanda gourmet com vista livre.', 'Área externa com piscina e jardim.', 'Garagem coberta para dois carros.'],
  ['Rua tranquila, próxima a escolas, mercado e transporte.', 'Bairro arborizado e silencioso, perto do parque.', 'Localização privilegiada, a poucos minutos do centro.'],
  ['Documentação em ordem, aceita financiamento.', 'Imóvel desocupado, pronto para morar.', 'Agende sua visita com nossa equipe.'],
];
const descriptions = Array.from({ length: TOTAL_DESCRIPTIONS }, (_, i) =>
  parts.map((options, j) => options[(i * (j + 3) + j) % options.length]).join(' '),
);

const percentile = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
const rssMb = () => Math.round(process.memoryUsage().rss / 1024 / 1024);

const t0 = performance.now();
const embed = await pipeline('feature-extraction', model, { dtype: 'q8' });
const loadMs = Math.round(performance.now() - t0);
const rssAfterLoad = rssMb();

const run = (texts) => embed(texts, { pooling: 'mean', normalize: true });
for (const q of queries.slice(0, 5)) await run(queryPrefix + q);

const latencies = [];
for (let i = 0; i < 300; i++) {
  const start = performance.now();
  await run(queryPrefix + queries[i % queries.length]);
  latencies.push(performance.now() - start);
}
latencies.sort((a, b) => a - b);

const batchStart = performance.now();
let dims = 0;
for (let i = 0; i < descriptions.length; i += BATCH) {
  const out = await run(descriptions.slice(i, i + BATCH).map((d) => passagePrefix + d));
  dims = out.dims.at(-1);
}
const batchSeconds = (performance.now() - batchStart) / 1000;

console.log(JSON.stringify({
  model, dtype: 'q8', dims, loadMs, rssAfterLoadMb: rssAfterLoad,
  peakRssMb: Math.round(process.resourceUsage().maxRSS / 1024),
  queryMs: { p50: +percentile(latencies, 50).toFixed(1), p95: +percentile(latencies, 95).toFixed(1), max: +latencies.at(-1).toFixed(1) },
  batch: { descriptions: descriptions.length, batchSize: BATCH, seconds: +batchSeconds.toFixed(1), perSecond: +(descriptions.length / batchSeconds).toFixed(1) },
  visibleCpus: os.availableParallelism(), node: process.version, loadavg: os.loadavg().map((l) => +l.toFixed(2)),
}));

# Design

This document covers the FaroLar brand and visual identity. Read it before writing any UI copy or styles.

## Name

**FaroLar** joins two Portuguese words:

- **Faro:** a sense of smell, and by extension the instinct for finding something. It stands for the search.
- **Lar:** a home, not only a property. It stands for what the person is looking for.

Together they sound like *farol*, a lighthouse, which suggests guidance for someone finding their way. This fits a product on the buyer's side that points things out and leaves the decision to the person.

### Writing the name

| Context | Form |
|---|---|
| Product, docs, and prose | `FaroLar` |
| Package names, URLs, and code identifiers | `farolar` |

The capital L shows where the two words meet, so keep it in all prose. Do not write "Farolar", "FAROLAR", or "Faro Lar".

## Positioning

FaroLar is a real estate search on the buyer's side. People describe what they want in their own words, each result explains why it appears, and the same property listed by several agencies is grouped with its price differences and history.

Do not call it a "broker", "digital broker", or anything similar. See [Positioning in the spec](spec.md#positioning) for the reason and for what the assistant does not do.

## Personality

- **Attentive:** it notices what a person would miss, such as the same property at two prices.
- **Honest:** it says what has not been confirmed, and shows its limits as clearly as its results.
- **Plain-spoken:** it talks like a person, without real estate or AI jargon.
- **Neutral:** it shows the facts and does not push anyone to buy.

## Voice

The product speaks Brazilian Portuguese, so these examples are in Portuguese.

| Do | Avoid | Why |
|---|---|---|
| "Quintal: não confirmado no anúncio" | "Provavelmente tem quintal!" | Does not claim what the listing does not support |
| "Este imóvel aparece em 3 imobiliárias, com R$ 18 mil de diferença" | "Economize R$ 18 mil!" | Shows the fact without implying a deal |
| "Preço caiu 5% em 30 dias" | "Ótima oportunidade" | Never says something is a good deal |
| "A escola mais próxima fica a 800 m em linha reta" | "Pertinho da escola" | Gives the measure and how it was taken |
| "O assistente está indisponível agora. Use os filtros." | "Ops! Algo deu errado :(" | Says what happened and what to do next |

Keep these rules in all copy:

- Use "imóvel" and "imobiliária". Do not use "corretor" for the product.
- Use "você", and short, direct sentences.
- Do not use hype, exclamation marks, or emoji in product text.
- Do not present the AI as a person. It has no name and no personal opinions.
- Always label fictional data as fictional.

### Result labels

The spec defines three labels, plus a fourth state for a contradicted claim:

| Spec | UI | Icon |
|---|---|---|
| matches | confere | `circle-check` |
| likely | provável | `circle-dot-dashed` |
| unconfirmed | não confirmado | `circle-question-mark`, in muted ink |
| claim contradicted by the distance | the measured distance, plus "O anúncio diz: …" | `equal-not` |

The label text is always written out. The icon reinforces it and never replaces it.

### Price copy

- Say "menor preço anunciado". Never say "melhor preço", "economia", or "oportunidade".
- Write amounts in full or with "mil", formatted with `Intl` for pt-BR: "R$ 585.000" or "R$ 585 mil". Never write a bare "585".
- Price history shows drops and increases the same way, with the percentage and the period: "Preço caiu 5% em 30 dias".

### Tagline

> Diga o que procura. A gente mostra o que confere.

In English: "Say what you are looking for. We show what checks out."

## Visual identity

### Concept

A lighthouse that lights up one point. The screen stays calm and neutral, and a single accent, the light, falls only on evidence. Anything dressed up or imprecise breaks the concept.

The AI is not the light. Its reading of the request is a guess, not evidence, so it is marked with text and never with the accent.

### Where the light is allowed

The evidence accent appears only on:

- the lowest price of a property with two or more listings, on the range line and on the price difference text, and on every listing tied for the lowest price;
- the "confere" label.

It never appears on:

- the AI interpretation or the filter chips;
- focus rings, errors, warnings, or notices;
- price drops or increases;
- the price of a property with a single listing;
- "possivelmente o mesmo imóvel", which shows no range and no difference;
- the map.

The accent is too light to carry information by itself (1.22:1 on white), so it always sits next to text or a navy mark.

### Color

Tokens are named by meaning, not by color.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `background` | `#F7F4EE` | Page | — |
| `surface` | `#FFFFFF` | Cards and inputs | — |
| `surface-muted` | `#ECE6DA` | Notice pills | — |
| `surface-disabled` | `#EFEBE3` | Disabled assistant field | — |
| `ink` | `#1B2433` | Text, icons, focus ring | 14.2 on `background` |
| `ink-muted` | `#5A5F6B` | Secondary text and notices | 5.83 on `background`, 5.15 on `surface-muted` |
| `data-neutral` | `#6B717C` | Range dots, chip borders, dashed borders | 4.91 on `surface`, 3.21 on `rule` |
| `border-control` | `#8A8172` | Input borders | 3.5 on `background` |
| `border-subtle` | `#E5DDD0` | Card edges, decorative only | — |
| `rule` | `#D8D0C2` | Range line, decorative only | — |
| `evidence` | `#FCE7B2` | The light: halo on the lowest price, highlight behind the price difference | 1.22 on `surface`, never alone |
| `logo-beam` | `#E9B23F` | Logo beam only | — |

Contrast ratios were computed with the WCAG formula. Text meets AA (4.5:1), and controls and data marks meet 3:1.

There is no red or green for prices. Traffic-light colors make any price above the lowest look like a warning. Errors and limits use `ink` plus text.

### Typography

| Role | Font | Rules |
|---|---|---|
| Headings | Source Serif 4 | Weight 600 only, loaded as a single static weight |
| Body, labels, and numbers | Source Sans 3 | Variable, latin subset |

- Load both with `next/font`, which self-hosts and preloads them. Measured on the latin woff2 files: about 50 KB in total.
- Source Sans 3 and Source Serif 4 have tabular figures by default, so prices, distances, and percentages align without extra CSS.
- Source Sans 3 has a small x-height, so the minimum size is 12px for notices, range labels, and the "Dados fictícios" pill, and 13px for result labels.
- Neither font has ✓, ≠, or ↔. Those marks are SVG icons.

### Icons

[Lucide](https://lucide.dev/guide/react), through `lucide-react`, with a 1.75 stroke. It is ISC licensed, and only imported icons reach the bundle.

| Use | Icon |
|---|---|
| Result labels | See [Result labels](#result-labels) |
| Possivelmente o mesmo imóvel | `arrow-left-right` |
| Notices | `info` |
| School, park, market, and hospital | `school`, `trees`, `shopping-basket`, `hospital` |

The AI has no icon. It is marked by an "IA" text tag. Lucide's `sparkles` is the most common AI symbol, and it reads as a promise.

### Logo

For now, the logo is the name set in Source Serif 4 at weight 600. A mark comes later, and it must work in `ink` alone, for the favicon and small sizes, since `logo-beam` is below 2:1 on a light background.

### Components

**AI interpretation and filters**

- After an AI response, one line appears above the filters: an "IA" tag, then "Entendi do seu texto:". It disappears when the user edits a filter or opens the page from a URL, because the URL does not record who set each filter.
- Filter chips are always neutral controls: `surface`, `ink` text, and a solid `data-neutral` border.
- Preferences, including `nearby`, sit in a separate "Prioriza" row with a dashed border, since they reorder results and never remove them.

**Price range**

- Agencies appear as `data-neutral` dots on a `rule` line, each with the agency name and the full price.
- The lowest price is an `ink` dot with an `evidence` halo. Every tied lowest price is lit.

**Result labels**

- The word "confere" sits on an `evidence` highlight. "Provável" and "não confirmado" have none.

**States**

- Contradicted claim: the measured distance, then "O anúncio diz: …" in `ink-muted`, with the `equal-not` icon.
- Possivelmente o mesmo imóvel: a dashed `data-neutral` note under the card, with no range and no difference.
- Assistant unavailable: the field stays visible on `surface-disabled`, with an `info` notice in `ink`: "O assistente está indisponível agora. Use os filtros."
- Notices for the EEA, UK, and Switzerland, the 18+ limit, and the top 500 limit use `ink` or `ink-muted` with the `info` icon, and no accent.
- "Dados fictícios" appears on every page, including the property page and the map.

### Map

The fictional city has no basemap, so the MapLibre style uses these tokens:

| Element | Value |
|---|---|
| Water | `#DCE3E6` |
| Land | `background` |
| Coastline | `#C9BFAE`, needed because water and land are only 1.18:1 apart |
| Streets | `#FFFFFF`, with a `border-subtle` casing |
| Parks | `#D2E0C8` |
| Neighborhood labels | `ink-muted`, uppercase |
| Points of interest | A white Lucide icon on a colored disc: school `#1B2433`, park `#3E6B4A`, market `#6B5A3A`, hospital `#4A5670`. Each disc is above 5.6:1 on land, and the white icon is above 6:1 on its disc |
| Approximate location | A circle with an `ink` fill at 7% and a dashed `ink` stroke |
| Distance | A dotted `ink` line, labeled "… em linha reta" |
| Clusters | A `surface` disc with a `data-neutral` border and the count in `ink` |
| Notice | "Cidade fictícia" in a corner |

MapLibre does not render React components, so the four point-of-interest icons are rasterized and added to the map as images.

### Open items

- Test the range line with only two agencies.
- Design the logo mark.
- Dark mode is not planned for the first version.

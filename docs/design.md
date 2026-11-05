# Design

This document covers the FaroLar brand. The visual identity has not been defined yet.

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

The spec defines three labels. This Portuguese wording is proposed, to be confirmed when the UI is built:

| Spec | UI |
|---|---|
| matches | confere |
| likely | provável |
| unconfirmed | não confirmado |

### Tagline

A draft, not final:

> Diga o que procura. A gente mostra o que confere.

In English: "Say what you are looking for. We show what checks out."

## Visual identity

To be defined: logo, color palette, typography, design tokens, and map style.

These requirements already apply, whatever the direction:

- Labels and price differences cannot rely on color alone.
- The fictional data notice must stay visible in the demo.
- The map style is our own, since the fictional city has no real basemap.
- Text and controls must meet WCAG AA contrast.

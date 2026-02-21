# YGrubs

YGrubs is a pickup-focused web app for Yale students that helps users find nearby food options within a budget. Users choose a Yale residential college as their starting point, enter a budget, and get a ranked list of restaurants with suggested meal combos that stay at or under budget, sorted by walking distance and value.

## MVP Goal

Deliver a working web app that answers one question quickly:

> "Where can I get pickup food near my college that fits my budget right now?"

## MVP Definition of Done

- [ ] User can choose a Yale residential college as a starting point.
- [ ] User can enter a budget amount.
- [ ] App shows restaurants within a defined walking radius.
- [ ] App returns at least one suggested combo per restaurant at or under budget.
- [ ] Results are sorted by distance, then value.
- [ ] Menu/combo data is available for the initial launch set of restaurants.
- [ ] Basic error/empty states are handled (no results, invalid budget, missing data).

## In Scope (MVP)

- Pickup-only recommendations.
- Curated menu data (not full live integrations).
- Basic ranking logic (distance + value).
- Mobile-friendly web UI.

## Out of Scope (Post-MVP)

- Delivery options.
- Real-time menu API integrations.
- Payments, ordering, or checkout.
- Personalized accounts/recommendation history.
- Non-Yale geographies.

## Local Setup

This repository is currently in planning/bootstrap stage.

1. Clone the repo.
2. Open it in your editor.
3. Keep all MVP decisions and scope changes documented in this `README.md`.
4. As soon as app scaffolding is added, update this section with exact run commands.


## First Development Milestones

1. Create app scaffold and confirm it runs locally.
2. Define the MVP restaurant data format (JSON/DB schema).
3. Implement budget filter + combo selection logic.
4. Add distance calculation/ranking from selected residential college.
5. Build a simple results page and validate against 3-5 test budgets.


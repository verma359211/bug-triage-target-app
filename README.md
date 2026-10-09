# Bug Triage Target App

A deliberately small in-memory shop used as the target repository for the AI bug-triage walking skeleton. It has an Express API, a compact React storefront, Jest/Supertest tests, and a GitHub Actions workflow that safely runs generated reproduction tests.

## Architecture

```text
React cart page
      |
      v
Express routes -> cart, pricing, stock, and order services -> in-memory store
      ^
      |
Jest/Supertest tests

GitHub Actions reproduction workflow -> generated repro test -> result artifact
```

## Backend

Requires Node.js 20 or newer.

```bash
npm ci
npm test
npm start
```

The API listens on `http://localhost:3000` by default and provides:

- `GET /health`
- `GET /products`
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:productId`
- `DELETE /cart/items/:productId`
- `POST /checkout/preview`
- `POST /checkout`
- `GET /orders`
- `GET /orders/:id`

All data is held in memory and resets whenever the server restarts.

## Frontend

Run the backend first, then use a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite serves the React client and proxies shop API requests to the backend. The storefront supports browsing live inventory, cart quantity changes, coupon previews, checkout totals, and in-memory order history.

Create an optimized frontend build with `npm run build`.

## Reproduction workflow

The `.github/workflows/repro.yml` workflow is dispatched by the triage agent. It checks out a temporary branch containing a generated `repro` test, installs locked backend dependencies, runs only that test with Jest, and uploads the JSON result. The agent is responsible for deleting temporary branches, artifacts, and workflow runs afterward.

This repository intentionally contains realistic defects for evaluation. Their locations and causes are kept outside this repository so the agent cannot read the answers.

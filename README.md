# Bug Triage Target App

A deliberately small in-memory shop used as the target repository for the AI bug-triage walking skeleton. It has an Express API, a compact React storefront, Jest/Supertest tests, and a GitHub Actions workflow that safely runs generated reproduction tests.

## Architecture

```text
React storefront
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

All data is held in memory. The storefront assigns each browser an anonymous demo-session ID, so visitors receive isolated carts, inventory, and orders. Sessions expire after two hours and everything resets whenever the server restarts.

## Frontend

For frontend development, run the backend first and then use a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite serves the React client and proxies shop API requests to the backend. The storefront supports browsing live inventory, cart quantity changes, coupon previews, checkout totals, and in-memory order history.

Create an optimized frontend build from the repository root with `npm run build`. After a build, Express serves the storefront and API together from port 3000.

## Deployment

The included `Dockerfile` creates a production image containing both the optimized React build and Express API. The hosting platform only needs to provide a `PORT` value; no secrets or database are required.

```bash
docker build -t bug-triage-target-app .
docker run --rm -p 3000:3000 -e PORT=3000 bug-triage-target-app
```

Use `GET /health` as the deployment health check. For a non-Docker host, use `npm ci && npm --prefix frontend ci && npm run build` as the build command and `npm start` as the start command.

## Reproduction workflow

The `.github/workflows/repro.yml` workflow is dispatched by the triage agent. It checks out a temporary branch containing a generated `repro` test, installs locked backend dependencies, runs only that test with Jest, and uploads the JSON result. The agent is responsible for deleting temporary branches, artifacts, and workflow runs afterward.

This repository intentionally contains realistic defects for evaluation. Their locations and causes are kept outside this repository so the agent cannot read the answers.

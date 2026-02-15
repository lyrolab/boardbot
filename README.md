# BoardBot

AI-powered moderation and triaging for feedback boards. BoardBot connects to feedback platforms (currently [Fider](https://fider.io)), syncs user-submitted suggestions, and automatically processes them using LLMs to:

- **Moderate content** — detect spam, harassment, bug reports disguised as suggestions, advertisements, and other off-topic posts
- **Detect duplicates** — find existing suggestions that cover the same idea so duplicates can be merged
- **Assign tags** — categorize posts with relevant tags based on their content

Decisions can be reviewed manually or auto-applied back to the feedback board.

## Architecture

Monorepo with two packages:

- **`packages/backend`** — NestJS API with BullMQ job processing, TypeORM (PostgreSQL), and AI services via the Vercel AI SDK (OpenAI / OpenRouter)
- **`packages/frontend`** — React SPA with TanStack Router, TanStack React Query, and MUI / Radix UI components

Infrastructure: PostgreSQL for persistence, Redis for the job queue.

## How it works

1. A board is created and connected to a Fider instance via API key
2. BoardBot syncs posts and tags from Fider
3. Each new post goes through an AI pipeline:
   - **Moderation** — accept or reject with a reason (spam, question, bug report, etc.)
   - **Duplicate detection** — generate search queries, find candidates, analyze similarity
   - **Tag assignment** — pick 0–2 tags from the board's tag list
4. Results are stored as a decision on the post
5. A human reviews the decision (or it's auto-applied if enabled)
6. Approved decisions are pushed back to Fider (status changes, tags, duplicate links)

## Getting started

### Prerequisites

- Node.js 22
- Docker & Docker Compose

### Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL and Redis
docker compose up -d

# Start the backend (runs migrations automatically)
cd packages/backend
npm run dev

# Start the frontend
cd packages/frontend
npm run dev
```

The backend API runs with Swagger docs at `/api`. The frontend dev server runs on port 4781.

### Environment variables

The backend requires:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `FRONTEND_URL` | Frontend origin for CORS |
| `OPENAI_API_KEY` | OpenAI API key (or OpenRouter key) |

### Fider (optional, for local testing)

```bash
cd fider
docker compose up -d
```

This starts a local Fider instance on `localhost:4852`.

## Plugin architecture

Board integrations are pluggable. Each integration implements a `BoardInterface` and is registered with the `@BoardImplementation()` decorator. Fider is the first implementation — others can be added by following the same pattern.

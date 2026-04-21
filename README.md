# OpenRouter

![Architecture](./public/open-router-v0.1.png)

A unified API gateway for running and comparing various open-source AI models. OpenRouter provides a single interface to access multiple LLM providers (OpenAI, Anthropic Claude, Google Gemini), with built-in token usage tracking, cost management, and credit-based billing.

## Project Overview

OpenRouter solves the fragmentation problem of AI model access by offering:

- **Unified API**: Single endpoint to access multiple LLM providers
- **Token & Cost Tracking**: Automatic usage metrics and cost computation per model
- **Credit-Based Billing**: Prepaid credits system with transaction history
- **API Key Management**: Create, manage, and track usage per API key
- **Streaming Responses**: Real-time token-by-token streaming via SSE

## Tech Stack

| Layer               | Technology                                             |
| ------------------- | ------------------------------------------------------ |
| Runtime             | Bun 1.3.9                                              |
| Primary Backend     | Express.js 4.18.2                                      |
| API Gateway Backend | Express.js 4.18.2 + Zod 3.24                           |
| Frontend            | React 19 + Tailwind CSS 4                              |
| Frontend Server     | Bun.serve() with HTML imports + HMR                    |
| UI Components       | shadcn/ui + Radix primitives                           |
| Database            | PostgreSQL (Neon Serverless)                           |
| ORM                 | Prisma 7.7.0                                           |
| Authentication      | JWT + bcrypt                                           |
| Validation          | Zod 3.24                                               |
| AI SDKs             | openai 6.x, @anthropic-ai/sdk 0.88, @google/genai 1.x |
| Data Fetching       | TanStack Query 5                                       |
| Routing             | React Router 7                                         |
| Monorepo            | Turbo 2.8.10                                           |

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OpenRouter System                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────┐       ┌──────────────────────────────┐   │
│  │   Dashboard Frontend          │       │   API Backend               │   │
│  │   (React + Bun.serve)        │──────>│   (Express + Zod)           │   │
│  │   Port 9001                   │       │   Port 3001                │   │
│  └──────────────┬───────────────┘       └───────────┬──────────────────┘   │
│                 │                                    │                     │
│                 │ HTTP                               │ LLM Calls           │
│                 ▼                                    ▼                     │
│  ┌──────────────────────────────┐       ┌──────────────────────────────┐   │
│  │   Primary Backend            │       │   LLM Providers              │   │
│  │   (Express)                  │──────>│   - OpenAI                   │   │
│  │   Port 3000                   │       │   - Anthropic Claude        │   │
│  └──────────────┬───────────────┘       │   - Google Gemini           │   │
│                 │                          └──────────────────────────────┘   │
│                 │ PostgreSQL (Neon)                                        │
│                 ▼                                                         │
│  ┌──────────────────────────────┐                                           │
│  │   Prisma ORM                 │                                           │
│  │   + PostgreSQL               │                                           │
│  └──────────────────────────────┘                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### System Components

#### Primary Backend (Express.js - Port 3000)

Handles all user-facing and administrative functionality:

- **Auth Module** (`/auth`): User registration, login, JWT session management
- **API Keys Module** (`/api-keys`): Create, list, update, disable, delete API keys
- **Models Module** (`/models`): Available AI models and provider listings
- **Payments Module** (`/payments`): Credit purchases and transaction history

#### API Backend (Express.js - Port 3001)

Handles LLM proxy and streaming:

- **Completions Endpoint**: Proxy requests to OpenAI/Anthropic/Gemini
- **Streaming**: Server-sent events (SSE) for real-time token delivery
- **Token Counting**: Input/output token tracking per request
- **Credit Deduction**: Automatic credit consumption via Prisma transaction

#### Dashboard Frontend (React + Bun.serve - Port 9001)

Served via `Bun.serve()` with native HTML imports and HMR. Pages:

- Authentication (sign up, sign in)
- API key management
- Credit balance and purchases
- Dashboard overview with usage stats

## Database Schema

### Entity Relationship

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────────┐
│    User     │──────>│   ApiKey    │──────>│  Conversation       │
│             │       │             │       │                    │
│ - id        │       │ - id        │       │ - id                │
│ - email     │       │ - userId    │       │ - userId            │
│ - password  │       │ - apiKey   │       │ - apiKeyId          │
│ - credits   │       │ - disabled │       │ - input/output     │
│             │       │ - deleted  │       │ - token counts     │
└─────────────┘       │ - creditsConsumed  └─────────────────────┘
                      └─────────────┘              │
                                                    ▼
┌─────────────────────┐       ┌─────────────────────┐
│   OnrampTransaction │       │  ModelProviderMap   │
│                     │       │                     │
│ - id                │       │ - id                 │
│ - userId            │       │ - modelId            │
│ - amount            │       │ - providerId         │
│ - status            │       │ - inputTokenCost     │
└─────────────────────┘       │ - outputTokenCost    │
                              └──────────┬───────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
              ┌───────────┐       ┌───────────┐       ┌───────────┐
              │ Company  │       │  Model    │       │ Provider │
              │          │       │           │       │          │
              │ - id     │       │ - id      │       │ - id     │
              │ - name   │       │ - name    │       │ - name   │
              │ - website│       │ - slug    │       │ - website│
              └─────────┘       │ - companyId      └─────────┘
                               └──────────┘
```

### Models

| Model                  | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `User`                 | User accounts with credit balance               |
| `ApiKey`               | User API keys with usage tracking (soft-delete) |
| `Company`              | AI provider companies (OpenAI, Anthropic, etc.) |
| `Model`                | Available AI models with slugs                  |
| `Provider`             | LLM providers                                   |
| `ModelProviderMapping` | Cost mapping per model per provider             |
| `OnrampTransaction`    | Credit purchase transactions                    |
| `Conversation`         | Chat history with token counts                  |

## API Endpoints

### Primary Backend (Port 3000)

| Route           | Method | Description                  |
| --------------- | ------ | ---------------------------- |
| `/auth/sign-up` | POST   | User registration            |
| `/auth/sign-in` | POST   | User login                   |
| `/auth/profile` | GET    | Get user profile (protected) |
| `/api-keys`     | POST   | Create API key (protected)   |
| `/api-keys`     | GET    | List API keys (protected)    |
| `/api-keys`     | PUT    | Update API key (protected)   |
| `/api-keys/:id` | DELETE | Delete API key (protected)   |
| `/models`       | GET    | List available models        |
| `/payments`     | GET    | Get transactions             |

### API Backend (Port 3001)

| Route          | Method | Description                    |
| -------------- | ------ | ------------------------------ |
| `/completions` | POST   | LLM completion (SSE streaming) |

## Project Structure

```
openrouter/
├── apps/
│   ├── backend/              # Primary Express backend
│   │   └── src/
│   │       ├── index.ts
│   │       ├── middleware/
│   │       └── modules/
│   │           ├── auth/
│   │           ├── apiKeys/
│   │           ├── models/
│   │           └── payments/
│   ├── api-backend/         # Express LLM gateway
│   │   └── src/
│   │       ├── index.ts
│   │       ├── types.ts
│   │       └── llms/
│   │           ├── Base.ts
│   │           ├── Openai.ts
│   │           ├── Claude.ts
│   │           └── Gemini.ts
│   └── dashboard-frontend/  # React dashboard (Bun.serve)
│       └── src/
│           ├── index.ts       # Bun.serve entry point
│           ├── frontend.tsx   # React root
│           ├── pages/
│           │   ├── Landing.tsx
│           │   ├── Signin.tsx
│           │   ├── Signup.tsx
│           │   ├── Dashboard.tsx
│           │   ├── ApiKeys.tsx
│           │   └── Credits.tsx
│           ├── components/
│           └── providers/
├── packages/
│   ├── db/                  # Prisma database package
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── index.ts
│   ├── ui/                  # Shared React UI components
│   ├── typescript-config/   # Shared TypeScript configs
│   └── eslint-config/       # Shared ESLint configuration
├── turbo.json              # Turborepo config
└── package.json
```

## Getting Started

### Prerequisites

- Bun 1.3.9+
- PostgreSQL database (Neon)

### Installation

```bash
# Install dependencies
bun install

# Generate Prisma client
cd packages/db && bunx prisma generate
```

### Development

```bash
# Run all services (frontend + both backends)
bun run dev

# Run individual services
bun run dev --filter=backend      # Primary backend (port 3000)
bun run dev --filter=api-backend  # API gateway (port 3001)
bun run dev --filter=dashboard-frontend  # Frontend (port 9001)
```

### Environment Variables

Create `.env` files in each app directory:

```env
# apps/backend/.env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key

# apps/api-backend/.env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
```

## Monorepo Commands

| Command               | Description               |
| --------------------- | ------------------------- |
| `bun run build`       | Build all apps            |
| `bun run dev`         | Run all apps in dev mode  |
| `bun run lint`        | Lint all apps             |
| `bun run check-types` | TypeScript type check     |
| `bun run format`      | Format code with Prettier |

## License

MIT
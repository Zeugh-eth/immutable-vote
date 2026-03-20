# PRD: Immutable Vote — ENS DAO Static Governance Dashboard

## Introduction

Build a standalone, IPFS-hostable governance dashboard for **ENS DAO** — a single-DAO site with no server dependencies. The app loads from IPFS via `.eth.limo`, fetches live data from the Gateful REST API, and renders everything client-side.

This is an isolated per-DAO build. No DAO selector, no home page, no panel. Just direct access to ENS governance data. Once proven with ENS, the same pattern can be replicated for other DAOs (UNI, COMP, etc.) as separate deployments.

## Goals

- Produce a fully static build (`output: 'export'`) deployable to IPFS
- Zero server dependencies — all data fetched client-side from Gateful REST API
- Single-DAO scope: ENS only (hardcoded, no dynamic DAO routing)
- Preserve core features: risk analysis, token distribution, attack profitability, proposals, holders/delegates, activity feed, treasury
- Replace Apollo/GraphQL with TanStack Query + typed fetch against Gateful REST API
- Full TDD — every story has tests before implementation
- Lightweight enough to load fast through eth.limo gateway

## User Stories

### US-001: Strip to single-DAO static shell
**Description:** As a developer, I need the project restructured as a single-DAO (ENS) static site with no server dependencies.

**Acceptance Criteria:**
- [ ] Remove `[daoId]` dynamic routing — all pages are flat (`/`, `/token-distribution`, `/governance`, etc.)
- [ ] Remove home page DAO selector / panel — root `/` goes directly to ENS overview
- [ ] `next.config.mjs` has `output: 'export'` set
- [ ] All `next/image` replaced with `<img>` or `unoptimized: true`
- [ ] All API routes removed (`app/api/` deleted)
- [ ] Server-side redirects removed
- [ ] `serverExternalPackages` removed from next config
- [ ] `resend` package removed from dependencies
- [ ] ENS DAO config hardcoded as the single data source
- [ ] `next build` produces `out/` directory successfully
- [ ] Typecheck passes
- [ ] Tests pass

### US-002: Implement Gateful REST data layer for ENS
**Description:** As a developer, I need typed data fetching hooks that pull ENS data from the Gateful REST API.

**Acceptance Criteria:**
- [ ] Create `shared/data/gateful-client.ts` with typed fetch functions for all ENS endpoints
- [ ] Endpoints covered: `/ens/proposals`, `/ens/token`, `/ens/treasury/liquid`, `/ens/treasury/dao-token`, `/ens/treasury/total`, `/ens/feed/events`, `/ens/accounts/{addr}/delegations`, `/ens/accounts/{addr}/delegators`, `/ens/token/historical-data`, `/ens/delegated-supply/compare`, `/ens/circulating-supply/compare`, `/ens/proposals/compare`, `/ens/votes/compare`
- [ ] All response types defined in `shared/data/types.ts` matching actual Gateful API shapes
- [ ] Create React hooks (`useProposals`, `useToken`, `useTreasury`, `useFeedEvents`, `useDelegations`, etc.) using TanStack Query
- [ ] Remove Apollo Client, `@anticapture/graphql-client` workspace dependency, and all `graphql` imports
- [ ] `NEXT_PUBLIC_BASE_URL` env var configures Gateful API base URL (default: `https://gateful.up.railway.app`)
- [ ] Typecheck passes
- [ ] Tests pass

### US-003: Wire features to new data hooks
**Description:** As a developer, I need all existing feature components to use the new Gateful REST hooks instead of Apollo/GraphQL.

**Acceptance Criteria:**
- [ ] `features/dao-overview` uses `useToken`, `useTreasury` hooks
- [ ] `features/token-distribution` uses token supply and compare hooks
- [ ] `features/attack-profitability` uses treasury and token price hooks
- [ ] `features/governance` uses `useProposals` and proposal detail hooks
- [ ] `features/holders-and-delegates` uses delegation and delegator hooks
- [ ] `features/feed` uses `useFeedEvents` hook
- [ ] `features/risk-analysis` renders from DAO config (static data, no API needed)
- [ ] `features/resilience-stages` renders from DAO config (static data)
- [ ] No Apollo imports remain anywhere in the codebase
- [ ] All features render with data when pointed at live Gateful endpoint
- [ ] Typecheck passes
- [ ] Tests pass

### US-004: Fix asset paths and fonts for IPFS
**Description:** As a user on eth.limo, I need all assets to load correctly.

**Acceptance Criteria:**
- [ ] All static assets use relative paths (no absolute URLs)
- [ ] Google Fonts replaced with self-hosted Inter in `public/fonts/`
- [ ] No hardcoded `localhost` or domain-specific URLs for assets
- [ ] `next.config.mjs` configured for IPFS-compatible paths
- [ ] Built `out/` serves correctly via `npx serve out`
- [ ] Typecheck passes
- [ ] Tests pass

### US-005: Remove unused features and pages
**Description:** As a developer, I need to remove features that don't apply to a single-DAO isolated site.

**Acceptance Criteria:**
- [ ] Remove `app/alerts/` (multi-DAO feature)
- [ ] Remove `app/contact/` and `app/donate/` (server-dependent or out of scope)
- [ ] Remove `app/aave/` (different DAO)
- [ ] Remove `features/alerts/` and `features/donation/`
- [ ] Remove `features/cookie/` if not needed
- [ ] Remove or simplify `features/panel/` (no multi-DAO panel)
- [ ] PostHog and Umami either removed or made optional via env var
- [ ] FAQ, glossary, terms-of-service kept as static pages if useful, removed if not
- [ ] No dead imports or unused components remain
- [ ] Typecheck passes
- [ ] Tests pass

### US-006: Static page generation and routing
**Description:** As a user, I need clean URLs for each section that work on IPFS.

**Acceptance Criteria:**
- [ ] Root `/` renders ENS overview (what was `/ens`)
- [ ] `/token-distribution` renders token distribution page
- [ ] `/attack-profitability` renders attack profitability page
- [ ] `/holders-and-delegates` renders holders page
- [ ] `/resilience-stages` renders resilience page
- [ ] `/risk-analysis` renders risk analysis page
- [ ] `/governance` renders governance/proposals list
- [ ] `/governance/proposal/[proposalId]` uses client-side catch-all for dynamic proposal IDs
- [ ] All pages pre-rendered as static HTML in `out/`
- [ ] 404 page works
- [ ] Typecheck passes
- [ ] Tests pass

### US-007: IPFS deployment script
**Description:** As a developer, I need one command to build and pin to IPFS.

**Acceptance Criteria:**
- [ ] `scripts/deploy-ipfs.sh` builds with `next build` and pins `out/` to IPFS
- [ ] Supports local `ipfs` CLI with `--cid-version=1`
- [ ] Prints CID and preview URL
- [ ] `.env.example` lists all required build-time env vars
- [ ] README documents the deployment flow
- [ ] Typecheck passes
- [ ] Tests pass

### US-008: Smoke test and build verification
**Description:** As a developer, I need automated verification that the static build works.

**Acceptance Criteria:**
- [ ] Test script builds the project
- [ ] Verifies `out/` contains: `index.html`, `token-distribution/index.html`, `governance/index.html`, `_next/static/`
- [ ] Serves `out/` locally and checks key pages return 200
- [ ] Verifies no broken asset references in HTML
- [ ] Runnable via `npm run test:smoke`
- [ ] Typecheck passes
- [ ] Tests pass

### US-009: README
**Description:** As a developer, I need docs for Immutable Vote ENS.

**Acceptance Criteria:**
- [ ] README explains: what this is, how to dev, how to build, how to deploy to IPFS
- [ ] Lists all env vars
- [ ] Explains how to create another DAO's site from this template
- [ ] Typecheck passes

## Functional Requirements

- FR-1: `next build` produces a complete static site in `out/` — no server runtime
- FR-2: All data fetched client-side from Gateful REST API at `https://gateful.up.railway.app/ens/*`
- FR-3: `NEXT_PUBLIC_BASE_URL` configures the API endpoint at build time
- FR-4: Site is ENS-only — no DAO switching, no multi-DAO navigation
- FR-5: All section pages pre-rendered as static HTML
- FR-6: Proposal detail pages load dynamically (client-side routing for `/governance/proposal/[id]`)
- FR-7: Wallet connection (RainbowKit) available for read-only features
- FR-8: Assets load correctly through IPFS gateways via relative paths

## Non-Goals

- No multi-DAO support in this build (other DAOs = separate deployments)
- No server-side rendering or ISR
- No on-chain write transactions (voting, delegating) — read-only for MVP
- No redesign — visual parity with current ENS page on Anticapture
- No new features beyond what exists
- No alerts or notification system

## Technical Considerations

- **Gateful REST API**: `https://gateful.up.railway.app` with CORS enabled. All endpoints scoped to `/ens/*`.
- **Replace Apollo + GraphQL entirely** with TanStack Query (already a dep) + native fetch
- **Proposal detail pages** are the only dynamic route — use Next.js catch-all `[[...slug]]` or client-side navigation
- **DAO config** (`shared/dao-config/ens.ts`) contains static risk/governance data — no API needed for those features
- **next/font** may not work with static export — test and fall back to self-hosted
- **Bundle size target**: under 5MB compressed for fast IPFS loading

## Success Metrics

- `next build` with `output: 'export'` completes with zero errors
- All 7 section pages render with live ENS data via Gateful
- Build output under 5MB compressed
- Site loads in under 5s through eth.limo
- Zero runtime server dependencies

## Open Questions

- ENS name for deployment? (e.g., `ens.immutablevote.eth.limo` or similar)
- Should the service-providers page be included? (depends on Gateful support)
- Keep glossary/FAQ/terms or strip for minimal MVP?

# PRD: Immutable Vote — IPFS-Native Static Governance Dashboard

## Introduction

Convert the Anticapture governance dashboard from a server-dependent Next.js app into a fully static, IPFS-hostable frontend that works seamlessly through `.eth.limo`. The goal is a minimal viable governance dashboard that loads from IPFS with zero server infrastructure requirements, while retaining the core data visualization and analysis features that make Anticapture useful.

The app will be served at `immutablevote.eth.limo` (or similar ENS name) and must work identically whether accessed through eth.limo, a local IPFS gateway, or any pinning service.

## Goals

- Produce a fully static build (`next export` / `output: 'export'`) that can be pinned to IPFS
- Zero server dependencies at runtime — all data fetching happens client-side
- Preserve core governance analysis features: risk analysis, token distribution, attack profitability, proposals, holders/delegates
- Abstract data fetching behind a provider interface so the GraphQL backend can be swapped for direct subgraph/RPC queries later
- Pre-render all known DAO pages at build time for clean URLs
- Work through eth.limo gateway without broken routes or assets
- Maintain wallet connection (RainbowKit) for future interactive features
- Full TDD — every story has tests before implementation

## User Stories

### US-001: Configure Next.js for Static Export
**Description:** As a developer, I need the project to produce a static HTML/JS/CSS build that can be deployed to IPFS.

**Acceptance Criteria:**
- [ ] `next.config.mjs` has `output: 'export'` set
- [ ] All `next/image` usages replaced with standard `<img>` tags or `next/image` with `unoptimized: true`
- [ ] All API routes removed (`app/api/` directory deleted or emptied)
- [ ] Server-side redirects converted to client-side redirects or removed
- [ ] `next build` produces a static `out/` directory with all pages
- [ ] No `getServerSideProps` or server-only imports remain
- [ ] Typecheck passes
- [ ] Tests pass

### US-002: Implement Data Fetching Abstraction Layer
**Description:** As a developer, I need a clean abstraction over data sources so we can swap between the GraphQL API gateway and direct RPC/subgraph queries without changing feature code.

**Acceptance Criteria:**
- [ ] Create `shared/data/` directory with provider interface types
- [ ] Define `DataProvider` interface covering: proposals, token metrics, delegates, treasury, feed events, risk analysis
- [ ] Implement `GraphQLDataProvider` that wraps existing Apollo Client queries
- [ ] Export a React context (`DataProviderContext`) that features consume instead of calling Apollo directly
- [ ] Existing Apollo hooks still work through the abstraction
- [ ] Config allows setting the GraphQL endpoint URL at build time via env var
- [ ] Typecheck passes
- [ ] Tests pass

### US-003: Remove Server-Side Dependencies
**Description:** As a developer, I need to strip all server-only code paths so the build succeeds as a static export.

**Acceptance Criteria:**
- [ ] `app/api/contact/` route removed (contact form either removed or converted to `mailto:` link)
- [ ] `app/api/figma/` route removed
- [ ] `resend` package usage removed from production code
- [ ] Server-only env vars (`RESEND_API_KEY`, `FIGMA_TOKEN`, `CONTACT_EMAIL`, `ALLOWED_ORIGINS`) no longer referenced at runtime
- [ ] `next.config.mjs` redirects replaced with a client-side redirect component or removed
- [ ] `serverExternalPackages` config removed
- [ ] Build completes with `output: 'export'` without errors
- [ ] Typecheck passes
- [ ] Tests pass

### US-004: Static Path Generation for DAO Pages
**Description:** As a user, I want to access each DAO's dashboard via a clean URL like `/ens` or `/uni` that works on IPFS.

**Acceptance Criteria:**
- [ ] `generateStaticParams` implemented for `[daoId]` routes, returning all DAOs from `shared/dao-config/index.ts` (UNI, ENS, OP, GTC, SCR, NOUNS, COMP, OBOL)
- [ ] Each DAO's main page and all sub-pages (attack-profitability, holders-and-delegates, resilience-stages, risk-analysis, token-distribution, governance) are pre-rendered
- [ ] `out/` directory contains HTML files for every DAO route (e.g., `out/ens/index.html`, `out/ens/token-distribution/index.html`)
- [ ] 404 page renders correctly for unknown DAOs
- [ ] Typecheck passes
- [ ] Tests pass

### US-005: Fix Asset Paths for IPFS Compatibility
**Description:** As a user accessing the site via IPFS gateway, I need all assets (JS, CSS, images, fonts) to load correctly regardless of the gateway URL structure.

**Acceptance Criteria:**
- [ ] `next.config.mjs` sets `basePath` or `assetPrefix` to work with IPFS relative paths
- [ ] All static assets in `public/` are referenced with relative paths
- [ ] No hardcoded absolute URLs to `localhost` or specific domains for assets
- [ ] Google Fonts replaced with self-hosted fonts in `public/fonts/` (Inter)
- [ ] Built `out/` directory serves correctly when tested with a local HTTP server (`npx serve out`)
- [ ] Typecheck passes
- [ ] Tests pass

### US-006: Client-Side Analytics Replacement
**Description:** As a developer, I need analytics to work without server-side code, or be gracefully disabled.

**Acceptance Criteria:**
- [ ] PostHog integration uses client-side-only SDK or is removed
- [ ] Umami integration uses client-side script tag or is removed
- [ ] No analytics code causes build failures or runtime errors
- [ ] Analytics can be enabled/disabled via build-time env var
- [ ] Typecheck passes
- [ ] Tests pass

### US-007: Contact & Donation Pages — Static Conversion
**Description:** As a user, I want the contact and donation pages to work without server-side APIs.

**Acceptance Criteria:**
- [ ] Contact page uses `mailto:` link or external form service instead of API route
- [ ] Donation page works fully client-side (wallet interaction is already client-side)
- [ ] FAQ, glossary, and terms-of-service pages render as static pages
- [ ] All informational pages accessible and correct in static build
- [ ] Typecheck passes
- [ ] Tests pass

### US-008: IPFS Deployment Script & ENS Content Hash Update
**Description:** As a developer, I need a one-command script to build, pin to IPFS, and optionally update the ENS content hash.

**Acceptance Criteria:**
- [ ] `scripts/deploy-ipfs.sh` script that: builds the project, pins `out/` to IPFS (via `ipfs add -r` or Pinata/web3.storage API), outputs the CID
- [ ] Script prints the eth.limo URL for verification
- [ ] README documents the full deployment flow including ENS content hash update
- [ ] `.env.example` updated with all required build-time env vars
- [ ] Typecheck passes
- [ ] Tests pass

### US-009: Smoke Test — Full Static Build Verification
**Description:** As a developer, I need an automated smoke test that verifies the static build works end-to-end.

**Acceptance Criteria:**
- [ ] Test script builds the project with `next build`
- [ ] Verifies `out/` directory exists with expected structure (home page, all DAO pages, assets)
- [ ] Serves `out/` with a local HTTP server and checks that key pages return 200
- [ ] Verifies no broken asset references (JS/CSS files referenced in HTML exist in `out/`)
- [ ] Can be run in CI (`npm run test:smoke`)
- [ ] Typecheck passes
- [ ] Tests pass

### US-010: README & Documentation
**Description:** As a developer or contributor, I need clear docs on how to build, deploy, and develop Immutable Vote.

**Acceptance Criteria:**
- [ ] `README.md` rewritten for Immutable Vote (not Anticapture monorepo)
- [ ] Documents: prerequisites, local dev, static build, IPFS deployment, ENS setup
- [ ] Explains the data provider abstraction and how to swap backends
- [ ] Lists all build-time environment variables with descriptions
- [ ] Includes architecture diagram (text-based) showing static build → IPFS → eth.limo flow
- [ ] Typecheck passes

## Functional Requirements

- FR-1: `next build` produces a complete static site in `out/` with no server runtime
- FR-2: All pages render client-side with data fetched via TanStack Query + fetch from the Gateful REST API (`https://gateful.up.railway.app`)
- FR-3: `NEXT_PUBLIC_BASE_URL` env var configures the Gateful REST API endpoint at build time
- FR-4: All 7 supported DAO dashboards (UNI, ENS, GTC, SCR, NOUNS, COMP, OBOL) are pre-rendered as static HTML (OP excluded — not on Gateful)
- FR-5: Wallet connection (RainbowKit + wagmi) works for read-only purposes
- FR-6: All sub-pages per DAO (overview, attack-profitability, holders-and-delegates, resilience-stages, risk-analysis, token-distribution, governance) are statically generated
- FR-7: No runtime dependency on any server — the app functions identically served from IPFS, S3, or `file://`
- FR-8: Assets load correctly through IPFS gateways using relative paths
- FR-9: Proposal detail pages (`/[daoId]/governance/proposal/[proposalId]`) use client-side routing (hash or catch-all) since proposal IDs are dynamic

## Non-Goals

- No server-side rendering or incremental static regeneration
- No rewriting data fetching to use direct subgraph queries (that's Phase 2 — the abstraction layer prepares for it)
- No new features — this is a conversion, not a feature release
- No mobile app or PWA features
- No custom IPFS gateway — we use eth.limo and standard gateways
- No on-chain write transactions (voting, delegating) — read-only for MVP
- No redesign — visual parity with current Anticapture dashboard

## Technical Considerations

- **Data source: Gateful REST API** at `https://gateful.up.railway.app` — NOT the GraphQL API Gateway. CORS is enabled (`access-control-allow-origin: *`). Endpoints are `/{daoId}/proposals`, `/{daoId}/token`, `/{daoId}/treasury/liquid`, `/{daoId}/feed/events`, `/{daoId}/accounts/{address}/delegations`, etc.
- **Available DAOs on Gateful**: ens, uni, comp, nouns, gtc, obol, scr (NOT op — returns 404)
- **Apollo Client should be replaced** with a simpler REST client (fetch + SWR/TanStack Query) since the backend is REST, not GraphQL
- **Next.js static export** requires `output: 'export'` and has limitations: no middleware, no API routes, no `next/image` optimization, no ISR
- **Dynamic routes** (`[proposalId]`) can't be pre-rendered without knowing all IDs at build time — use client-side catch-all route or hash routing for proposals
- **NuqsAdapter** (URL search params) needs to use `nuqs/adapters/next/app` which should work with static export
- **Wallet config** uses `publicClient` from viem for ENS resolution — this works client-side via Alchemy RPC
- **Font loading**: `next/font` may not work with static export — use self-hosted font files instead
- **eth.limo specifics**: serves content from IPFS via ENS content hash, supports `_redirects` file for SPA fallback (needs verification), respects standard HTTP caching headers from IPFS

## Success Metrics

- `next build` completes with zero errors on `output: 'export'`
- `out/` directory serves correctly via `npx serve out` with all pages and assets loading
- Build size under 10MB (compressed) for reasonable IPFS pinning
- All existing DAO pages render with data when pointed at a live GraphQL endpoint
- Site loads in under 5 seconds through eth.limo gateway

## Open Questions

- Does eth.limo support a `_redirects` or `200.html` fallback for SPA routing? (If yes, proposal detail pages can use path routing instead of hash)
- Should we strip features that are broken without the API (alerts, service-providers) or keep them with loading/error states?
- What ENS name will be used? (`immutablevote.eth`? subdomain of `anticapture.eth`?)
- Should the feed feature be included in MVP or deferred? (It's heavy on API calls)
- Is the current Anticapture API Gateway publicly accessible with CORS, or do we need to deploy a public instance?

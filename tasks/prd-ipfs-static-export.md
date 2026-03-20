# PRD: Immutable Vote — ENS Governance + Voting (IPFS)

## Introduction

Build a minimal, IPFS-hostable governance interface for **ENS DAO** — proposals list, proposal detail with vote breakdown, wallet connect, and on-chain voting (`castVote` / `castVoteWithReason`). Nothing else.

No dashboard, no analytics, no token distribution, no multi-DAO. Just governance.

Served via IPFS + eth.limo. Zero server dependencies.

## Goals

- Static build (`output: 'export'`) deployable to IPFS
- Show ENS proposals (list + detail with vote breakdown)
- Connect wallet via RainbowKit
- Cast votes on active proposals (for/against/abstain, with optional reason)
- Display connected user's voting power and vote status
- Fetch data from Gateful REST API (proposals, votes) + on-chain reads (voting power)
- Full TDD

## User Stories

### US-001: Project scaffold — static Next.js shell
**Description:** As a developer, I need a clean static Next.js project with only governance routing.

**Acceptance Criteria:**
- [ ] Strip the monorepo dashboard down to governance-only pages
- [ ] Route structure: `/` (proposals list), `/proposal/[id]` (proposal detail)
- [ ] `next.config.mjs` has `output: 'export'`, `images: { unoptimized: true }`
- [ ] All API routes removed (`app/api/` deleted)
- [ ] All non-governance features removed (token-distribution, attack-profitability, risk-analysis, resilience-stages, holders-and-delegates, feed, dao-overview, alerts, donation, faq, glossary, terms, cookie, panel, contact, donate, aave)
- [ ] Server-side redirects, `serverExternalPackages`, `resend` removed
- [ ] Only keep: `shared/components/` (design system), `shared/providers/`, `shared/dao-config/ens.ts`, `shared/utils/`, `shared/types/`, `shared/services/wallet/`, `widgets/` (header/nav only if needed)
- [ ] `next build` produces `out/` with `index.html` and `proposal/` directory
- [ ] Typecheck passes
- [ ] Tests pass

### US-002: Gateful REST client for proposals and votes
**Description:** As a developer, I need typed data fetching for ENS proposals and votes from Gateful.

**Acceptance Criteria:**
- [ ] Create `shared/data/gateful.ts` — typed fetch client
- [ ] `fetchProposals(params?)` → `GET /ens/proposals` with pagination, status filter, ordering
- [ ] `fetchProposal(id)` → `GET /ens/proposals/{id}` returns full proposal with calldata
- [ ] `fetchProposalVotes(id, params?)` → `GET /ens/proposals/{id}/votes` with pagination and ordering
- [ ] All types in `shared/data/types.ts` matching actual Gateful response shapes (Proposal, Vote, PaginatedResponse)
- [ ] React hooks: `useProposals()`, `useProposal(id)`, `useProposalVotes(id)` using TanStack Query
- [ ] Remove Apollo Client, `@apollo/client`, `graphql`, `@anticapture/graphql-client` from dependencies
- [ ] `NEXT_PUBLIC_API_URL` env var (default: `https://gateful.up.railway.app`)
- [ ] Typecheck passes
- [ ] Tests pass

### US-003: Proposals list page
**Description:** As a user, I want to see all ENS governance proposals with their status and vote counts.

**Acceptance Criteria:**
- [ ] `/` renders a list of ENS proposals fetched from Gateful
- [ ] Each proposal shows: title, status (Active/Executed/Pending/Defeated), for/against/abstain vote counts, proposer address, timestamps
- [ ] Active proposals visually distinguished (highlighted or sorted first)
- [ ] Clicking a proposal navigates to `/proposal/[id]`
- [ ] Loading skeleton while data fetches
- [ ] Error state if API is unreachable
- [ ] Pagination or infinite scroll for older proposals
- [ ] Typecheck passes
- [ ] Tests pass

### US-004: Proposal detail page
**Description:** As a user, I want to read a full proposal and see the vote breakdown.

**Acceptance Criteria:**
- [ ] `/proposal/[id]` renders full proposal detail via client-side fetch
- [ ] Shows: title, status, full description (markdown rendered), proposer, start/end timestamps, quorum
- [ ] Vote progress bar: for vs against vs abstain with percentages
- [ ] Quorum indicator (current votes vs required quorum)
- [ ] Votes list: voter address, vote direction, voting power, reason (if any), timestamp
- [ ] Votes list supports pagination/infinite scroll
- [ ] Calldata section showing targets, values, calldatas (raw, collapsible)
- [ ] Loading and error states
- [ ] Typecheck passes
- [ ] Tests pass

### US-005: Wallet connection
**Description:** As a user, I need to connect my wallet to check my voting power and vote.

**Acceptance Criteria:**
- [ ] RainbowKit connect button in header/nav
- [ ] wagmi provider configured for Ethereum mainnet
- [ ] Connected wallet shows: address (ENS name if available), voting power read from ENS Governor contract
- [ ] Voting power read on-chain via `getVotes(address)` on ENS Governor (`0x323a76393544d5ecca80cd6ef2a560c6a395b7e3`)
- [ ] Disconnecting wallet clears state
- [ ] `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` and `NEXT_PUBLIC_ALCHEMY_KEY` env vars
- [ ] Works in static build (all client-side)
- [ ] Typecheck passes
- [ ] Tests pass

### US-006: Vote on proposals
**Description:** As a token holder, I want to cast my vote (for/against/abstain) on active ENS proposals.

**Acceptance Criteria:**
- [ ] Vote buttons (For / Against / Abstain) visible on active proposal detail page when wallet connected
- [ ] Optional reason/comment text field
- [ ] Vote calls `castVote(proposalId, support)` or `castVoteWithReason(proposalId, support, reason)` on ENS Governor contract
- [ ] Transaction simulation before sending (show error if user has no voting power or already voted)
- [ ] Loading state during transaction + success/error toast
- [ ] After successful vote, refetch proposal votes to show updated counts
- [ ] If user has already voted, show their vote and disable vote buttons
- [ ] Vote buttons hidden when wallet not connected (show "Connect wallet to vote" prompt)
- [ ] Vote buttons hidden for non-active proposals
- [ ] Typecheck passes
- [ ] Tests pass

### US-007: IPFS build + deployment
**Description:** As a developer, I need the build to work on IPFS and a script to deploy.

**Acceptance Criteria:**
- [ ] All assets use relative paths
- [ ] Google Fonts replaced with self-hosted Inter in public/fonts/
- [ ] `/proposal/[id]` uses client-side catch-all route (since IDs are dynamic)
- [ ] `scripts/deploy-ipfs.sh` builds and pins `out/` with CIDv1
- [ ] `.env.example` lists all env vars
- [ ] `out/` serves correctly via `npx serve out`
- [ ] Typecheck passes
- [ ] Tests pass

### US-008: Smoke tests
**Description:** As a developer, I need automated verification.

**Acceptance Criteria:**
- [ ] Build produces `out/` with `index.html`
- [ ] Serve `out/` and verify `/` returns 200
- [ ] Verify `_next/static/` assets exist
- [ ] Runnable via `npm run test:smoke`
- [ ] Typecheck passes
- [ ] Tests pass

### US-009: README
**Description:** As a developer, I need minimal docs.

**Acceptance Criteria:**
- [ ] What this is, how to run, how to build, how to deploy
- [ ] Env vars documented
- [ ] How to fork for another DAO
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Static build in `out/` — no server runtime
- FR-2: Proposals list + detail fetched from `https://gateful.up.railway.app/ens/proposals`
- FR-3: Votes fetched from `https://gateful.up.railway.app/ens/proposals/{id}/votes`
- FR-4: Voting power read on-chain from ENS Governor contract (`0x323a76393544d5ecca80cd6ef2a560c6a395b7e3`) via `getVotes(address)`
- FR-5: `castVote` / `castVoteWithReason` calls ENS Governor contract via connected wallet
- FR-6: RainbowKit wallet connection on Ethereum mainnet
- FR-7: Proposal detail pages load via client-side routing (dynamic IDs)
- FR-8: Assets load via relative paths on IPFS gateways

## Non-Goals

- No token distribution, attack profitability, risk analysis, resilience, holders, feed, treasury, or any analytics
- No multi-DAO support
- No proposal creation (only voting)
- No delegation management
- No admin or moderator features
- No redesign — reuse existing governance components where possible

## Technical Considerations

- **Gateful REST API**: CORS enabled. `/ens/proposals` (list), `/ens/proposals/{id}` (detail), `/ens/proposals/{id}/votes` (votes)
- **Voting power**: Read on-chain via `getVotes(address)` on ENS Governor. Existing `useVoterInfo` hook uses GraphQL — needs rewrite to use direct contract read via wagmi `useReadContract`
- **Vote casting**: Existing `voteOnProposal.ts` already uses viem `writeContract` directly — can be reused mostly as-is, just hardcode ENS governor address
- **ENS Governor contract**: `0x323a76393544d5ecca80cd6ef2a560c6a395b7e3` on Ethereum mainnet
- **ENS Governor ABI**: Already in `abis/ens-governor.json`
- **Has-voted check**: Can be read from Gateful votes list (check if connected address appears) or on-chain via `hasVoted(proposalId, address)` on governor
- **Proposal status logic**: Status field from Gateful API (ACTIVE, EXECUTED, PENDING_EXECUTION, DEFEATED, etc.)
- **Markdown rendering**: `markdown-to-jsx` already a dependency — used for proposal descriptions

## Success Metrics

- Static build completes, deploys to IPFS, loads through eth.limo
- Can browse all ENS proposals and read full details
- Can connect wallet, see voting power, cast a vote on an active proposal
- Zero server dependencies at runtime

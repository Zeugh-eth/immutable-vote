# PRD: Complete ENS Governance Interface

## Goal

Build a minimal, fast-loading governance interface with feature parity to Anticapture's ENS governance section, using simple 2005-style web design.

## Design Principles

- **Simple HTML/CSS** - No complex frameworks on the UI layer
- **Fast loading** - < 100KB HTML+CSS per page
- **System fonts** - No web font downloads
- **Minimal JS** - React only for data fetching and wallet
- **Tables for data** - Classic HTML tables for votes/actions
- **High contrast** - Clear text, obvious clickability

## User Stories

### US-001: Fix Clickable Proposals

**As a user, I want to click on proposals to view details**

**AC:**
- [ ] Proposal cards are clickable links
- [ ] Clicking navigates to `/proposal/[id]`
- [ ] Hover state shows it's clickable (cursor, subtle bg change)
- [ ] Tests pass

### US-002: Proposal Detail - Basic Shell

**As a user, I want to see proposal details on a dedicated page**

**AC:**
- [ ] Route `/proposal/[id]` works
- [ ] Fetches proposal from Gateful
- [ ] Shows: title, proposer, status
- [ ] Back button to proposals list
- [ ] Loading state
- [ ] Error state (proposal not found)
- [ ] Tests pass

### US-003: Vote Counts & Progress Bars

**As a user, I want to see vote results visually**

**AC:**
- [ ] For/Against/Abstain vote counts (formatted: 488K, 1.44M)
- [ ] Vote percentages (100%, 0%, etc.)
- [ ] Visual progress bars (green=for, red=against, gray=abstain)
- [ ] Bars stack to 100% width
- [ ] Numbers readable (high contrast)
- [ ] Tests pass

### US-004: Status & Time Indicators

**As a user, I want to know proposal status and timing**

**AC:**
- [ ] Status badge (Ongoing/Executed/Pending/Defeated/Cancelled)
- [ ] Color-coded (green=ongoing, blue=executed, yellow=pending, red=defeated)
- [ ] Time remaining for active proposals ("5d left", "Voting closes in 5D 3H")
- [ ] Time since for completed proposals ("2d ago", "12d ago")
- [ ] Created/Started/Ends timestamps
- [ ] Tests pass

### US-005: Wallet Connect & Voting Power

**As a user, I want to see my voting power**

**AC:**
- [ ] RainbowKit connect button in header
- [ ] Shows connected address or ENS name
- [ ] Reads voting power from ENS Governor via `getVotes(address)`
- [ ] Displays: "Your VP: 123.45K" (or "0" if none)
- [ ] Updates when wallet changes
- [ ] Tests pass

### US-006: Vote Buttons & Transaction

**As a token holder, I want to vote on active proposals**

**AC:**
- [ ] Vote buttons (For/Against/Abstain) on active proposals
- [ ] Only visible when wallet connected
- [ ] Hidden if proposal not active
- [ ] Check `hasVoted(proposalId, address)` on-chain
- [ ] If voted, show "You voted: For" (no buttons)
- [ ] Clicking button calls `castVote(proposalId, support)`
- [ ] Loading state during tx
- [ ] Success/error feedback
- [ ] Refetch data after vote
- [ ] Tests pass

### US-007: Vote Reason (Optional Comment)

**As a voter, I can optionally add a reason for my vote**

**AC:**
- [ ] Text input "Add a comment (optional)" below vote buttons
- [ ] If filled, uses `castVoteWithReason` instead of `castVote`
- [ ] Character limit: 280 chars
- [ ] Counter shows remaining chars
- [ ] Tests pass

### US-008: Votes Tab - List of Voters

**As a user, I want to see who voted and how**

**AC:**
- [ ] Tab navigation (Description / Votes / Actions)
- [ ] Votes tab fetches from Gateful `/proposals/{id}/votes`
- [ ] Shows table: Address, Direction, Amount, Reason, Time
- [ ] Address formatted (ENS if available, else truncated)
- [ ] Direction icon (✓ for, ✗ against, – abstain)
- [ ] Voting power formatted (488.14K)
- [ ] Timestamp formatted (relative or absolute)
- [ ] Pagination (20 votes per page)
- [ ] Tests pass

### US-009: Actions Tab - Calldata Display

**As a user, I want to see what the proposal will execute**

**AC:**
- [ ] Actions tab shows targets, values, calldatas
- [ ] Table format: Target Address, Value (ETH), Calldata
- [ ] Calldata truncated with expand button
- [ ] Each action numbered (#1, #2, etc.)
- [ ] Copy button for addresses/calldata
- [ ] Tests pass

### US-010: Description Tab - Markdown Rendering

**As a user, I want to read the proposal description**

**AC:**
- [ ] Markdown rendered (headings, lists, tables, code, links)
- [ ] Use `react-markdown` or similar lightweight lib
- [ ] Tables styled (borders, padding)
- [ ] Code blocks monospace with background
- [ ] External links open in new tab
- [ ] Tests pass

### US-011: Quorum Indicator

**As a user, I want to see if quorum is met**

**AC:**
- [ ] Shows "Quorum: 488K / 1M" (current votes / required)
- [ ] Progress bar (fills based on percentage)
- [ ] Color: gray if not met, green if met
- [ ] Only show for proposals that have quorum
- [ ] Tests pass

### US-012: Simple, Fast Styling

**As a developer, I want the UI to load fast and look clean**

**AC:**
- [ ] No external font files (use system font stack)
- [ ] Inline critical CSS for above-the-fold
- [ ] Total CSS < 20KB
- [ ] No animations (except loading spinners)
- [ ] High contrast text (WCAG AA minimum)
- [ ] Simple :hover states (bg color change, underline)
- [ ] HTML tables for votes/actions (not divs)
- [ ] Tests pass (Lighthouse performance > 90)

## Technical Stack

- **Framework:** Next.js 16 (static export)
- **Styling:** Tailwind (purged, minimal config)
- **Data:** TanStack Query + Gateful API + viem (on-chain)
- **Wallet:** RainbowKit + wagmi
- **Markdown:** react-markdown
- **Governor ABI:** Already in `lib/abis/ens-governor.json`

## Non-Goals

- No animations/transitions (except loading)
- No complex charts (simple progress bars only)
- No vote delegation UI
- No proposal creation
- No admin features

## Success Metrics

- Proposals list loads in < 1s
- Proposal detail loads in < 2s
- Total page size < 150KB
- Lighthouse performance > 90
- All votes/actions visible
- Voting works end-to-end

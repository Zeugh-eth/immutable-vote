# ENS Governance - Feature Benchmark

Based on https://anticapture.com/ens/governance

## Proposals List Page

### Essential Features
- [x] List of proposals (title, status, proposer)
- [ ] **Status badges** (Ongoing, Executed, Pending Execution, Defeated)
- [ ] **Time indicators** ("5d left", "2d ago", "12d ago")
- [ ] **Vote counts** (total votes in K/M format)
- [ ] **Vote percentages** (For %, Against %)
- [ ] **Visual vote bars** (green for, red against)
- [ ] **Quorum indicator** (when applicable)
- [ ] **Clickable proposal cards** → detail page

### Nice-to-Have
- [ ] Filter by status
- [ ] Search proposals
- [ ] Sort by date/votes

## Proposal Detail Page

### Essential Features
- [ ] **Back to list** button
- [ ] **Proposal header**
  - Title
  - Status badge (with icon)
  - Proposer (with avatar/ENS name)
  - Share button (X/Twitter)
  
- [ ] **Voting Section**
  - Current vote counts (For/Against/Abstain with icons)
  - Vote percentages
  - Visual progress bars
  - Quorum progress (X / 1M with bar)
  - Time remaining ("Voting closes in 5D 3H")
  - **Vote buttons** (For/Against/Abstain) - only when wallet connected
  - Your voting power display
  
- [ ] **Status Timeline**
  - Created (date + time + tx link)
  - Started (date + time)
  - Ends (date + time)
  
- [ ] **Tabs**
  - Description (markdown rendered)
  - Votes (list of voters with amounts)
  - Actions (calldata, targets, values)

### Description Tab
- [ ] Markdown rendering
- [ ] Headings (Abstract, Specification, etc.)
- [ ] Tables (formatted)
- [ ] Code blocks
- [ ] Links

### Votes Tab
- [ ] List of votes
- [ ] Voter address/ENS
- [ ] Vote direction (For/Against/Abstain with icon)
- [ ] Voting power
- [ ] Timestamp
- [ ] Optional: vote reason
- [ ] Pagination/infinite scroll

### Actions Tab
- [ ] Calldata display
- [ ] Target addresses
- [ ] Values (ETH amounts)
- [ ] Decoded function calls (if possible)

## Wallet Integration

- [ ] Connect wallet button (RainbowKit)
- [ ] Display connected address/ENS
- [ ] Show user's voting power
- [ ] **Check if user has voted**
- [ ] **Vote transaction** (castVote/castVoteWithReason)
- [ ] Transaction feedback (loading, success, error)

## Design Principles (2005-style Simple)

1. **Minimal CSS** - Basic gradients, simple borders, no complex animations
2. **Fast loading** - Inline critical CSS, minimal JS
3. **HTML tables** for data (votes list, actions)
4. **Simple flexbox** layouts
5. **System fonts** or single web font
6. **Solid colors** instead of gradients/shadows
7. **Click affordance** - underlines, :hover states
8. **No frameworks** - vanilla HTML/CSS where possible

## Data Sources

### Gateful API
- `/ens/proposals` → proposals list
- `/ens/proposals/{id}` → proposal detail
- `/ens/proposals/{id}/votes` → votes list

### On-Chain (via viem)
- `getVotes(address)` → user's voting power
- `hasVoted(proposalId, address)` → check if voted
- `castVote(proposalId, support)` → vote
- `castVoteWithReason(proposalId, support, reason)` → vote with comment

## Original Code Mapping

Location in `/root/Projects/immutable-vote/apps/dashboard/`:

- **Proposals List**: `features/governance/components/proposal-list/`
- **Proposal Detail**: `features/governance/components/proposal-overview/`
- **Vote buttons**: `features/governance/components/proposal-overview/VoteOption.tsx`
- **Vote casting**: `features/governance/utils/voteOnProposal.ts`
- **Voting power**: `features/governance/hooks/useAccountPower.ts`
- **Votes list**: `features/governance/components/proposal-overview/VotesTabContent.tsx`
- **Description**: `features/governance/components/proposal-overview/DescriptionTabContent.tsx`

## Implementation Priority

### Phase 1 (MVP - Current)
- [x] Proposals list with basic info
- [ ] Fix: Make proposals clickable
- [ ] Proposal detail page (basic)

### Phase 2 (Core Voting)
- [ ] Vote counts and percentages
- [ ] Voting buttons (when connected)
- [ ] Vote transaction handling
- [ ] Has-voted check

### Phase 3 (Polish)
- [ ] Votes tab with list
- [ ] Actions/calldata tab
- [ ] Status timeline
- [ ] Markdown rendering for descriptions
- [ ] Share button
- [ ] Quorum indicator

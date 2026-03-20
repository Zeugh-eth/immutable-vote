# ENS Vote

Minimal IPFS-ready governance interface for ENS DAO.

## What Works

- ✅ Proposals list from Gateful REST API
- ✅ Wallet connect (RainbowKit)
- ✅ Static export (`npm run build` → `out/`)
- ✅ 8MB build size
- ✅ Clean, typed codebase

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** + **Tailwind CSS**
- **RainbowKit** + **wagmi** + **viem** (wallet + chain interaction)
- **TanStack Query** (data fetching)
- **Gateful REST API** (proposals data)

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
# Static site in out/
```

## Deploy to IPFS

```bash
npm run build
ipfs add -r --cid-version=1 out/
# Update ENS content hash with CID
```

## Env Vars (optional)

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
NEXT_PUBLIC_API_URL=https://gateful.up.railway.app
```

## TODO

- [ ] Proposal detail page
- [ ] Vote casting (castVote + castVoteWithReason)
- [ ] Voting power display
- [ ] Vote status (has voted check)
- [ ] Markdown rendering for descriptions
- [ ] Votes list on detail page

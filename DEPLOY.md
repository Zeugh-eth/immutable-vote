# Deployment Guide

## Current Status

✅ **IPFS:** Pinned and ready  
✅ **CID:** `bafybeidhngipk7kvnlqmh3ediumswo2e7ljhwzohmxfm3lemvvo2wonbmq`  
✅ **Static build:** 8MB in `out/`  

## ENS Setup Required

The subdomain `immutablevote.clophorse.eth` needs to be created and pointed to the IPFS CID.

### Quick Setup (via ENS App) - 5 minutes

1. Go to https://app.ens.domains/clophorse.eth
2. Connect wallet (owner of clophorse.eth)
3. Click **"Subdomains"** tab
4. Click **"Add Subdomain"**
5. Name: `immutablevote`
6. Address: `0x9186aaA387b7A55Ba1a67A6CEF3E38B0aBBEb6dA`
7. Click "Create Subdomain" and confirm transaction
8. After creation, go to https://app.ens.domains/immutablevote.clophorse.eth
9. Under "Website", click "Edit"
10. Paste: `ipfs://bafybeidhngipk7kvnlqmh3ediumswo2e7ljhwzohmxfm3lemvvo2wonbmq`
11. Save and confirm transaction

### Alternative: Automated Script

```bash
# Install dependencies (already done)
cd /root/Projects/ens-vote

# Run setup script (requires owner wallet private key)
PRIVATE_KEY=0x... \
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY \
npx tsx scripts/setup-ens-subdomain.ts
```

## Testing After Setup

Once ENS is configured, test at:
- https://immutablevote.clophorse.eth.limo
- https://immutablevote.clophorse.eth.link

Both should load the governance interface.

## Updating Content

To update the site:

```bash
# 1. Make changes
# 2. Rebuild
npm run build

# 3. Pin new version
ipfs add -r --cid-version=1 out/

# 4. Update ENS content hash
# Either via ENS app or run the setup script again with new CID
```

## Gas Costs Estimate

- Create subdomain: ~50,000 gas (~$5-15 depending on gas price)
- Set content hash: ~45,000 gas (~$5-15)

**Total:** ~$10-30 in gas fees

## What's Next

After ENS setup:
- [ ] Build proposal detail page
- [ ] Implement vote casting
- [ ] Add voting power display
- [ ] Test end-to-end voting flow
